const prisma = require('../configs/database');
const { checkPassword, encryptPassword } = require('../utils/bcrypt.js');
const { generateToken } = require('../utils/jwt.js');
const validation = require('../validations/user.validation.js')
const constant = require('../utils/constant.js')

const userController = {
    // Generate custom userId format: USR-0001, USR-0002, etc.
    generateUserId: async () => {
        // Get the count of existing users to determine the next sequential number
        const userCount = await prisma.user.count();
        const nextNumber = (userCount + 1).toString().padStart(4, '0');

        return `USR-${nextNumber}`;
    },

    createUser: async (req, res) => {
        try {
            const { error } = validation.createUser.validate(req.body);
            if (error) return res.status(400).json({ message: error });

            const { name, email, role } = req.body;

            const isUser = await prisma.user.findUnique({
                where: { email },
            });

            if (isUser) return res.status(400).json({ message: "User already exists" });

            const hashedPassword = await encryptPassword("@Test123");

            // Generate custom userId
            let customUserId;
            let isUserIdUnique = false;

            // Ensure userId is unique
            while (!isUserIdUnique) {
                customUserId = await userController.generateUserId();
                const existingUser = await prisma.user.findUnique({
                    where: { id: customUserId },
                });
                if (!existingUser) {
                    isUserIdUnique = true;
                }
            }

            const user = await prisma.user.create({
                data: {
                    id: customUserId,
                    userId: customUserId,
                    fullName: name,
                    email,
                    role,
                    password: hashedPassword
                },
            });

            res.status(201).json({ error: false, message: 'User created successfully', data: user });

        } catch (err) {
            res.status(500).json({ message: 'Error creating user', error: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { error } = validation.loginSchema.validate(req.body);
            if (error) return res.status(400).json({ error: true, message: error.details[0].message, data: null });

            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) return res.status(401).json({ error: true, message: 'Invalid email or password', data: null });

            if (!user.password) {
                return res.status(401).json({ error: true, message: 'Password not set for this user', data: null });
            }

            const isPasswordValid = await checkPassword(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: true, message: 'Invalid email or password', data: null });

            const token = generateToken({ id: user.id, role: user.role });
            await prisma.token.create({
                data: {
                    token: token,
                    userId: user.id,
                },
            });


            res.status(200).json({ error: false, message: 'Login successful', data: { token, user } });
        } catch (err) {
            res.status(500).json({ error: true, message: 'Login error', data: null, errorDetail: err.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { error } = validation.updateUser.validate(req.body);
            if (error) return res.status(400).json({ error: true, message: error.details[0].message, data: null });

            const { name, email, role, divisionId } = req.body;
            const userId = req.user.id;

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ error: true, message: 'User not found', data: null });

            if (email) {
                const isEmailTaken = await prisma.user.findUnique({
                    where: { email },
                });
                if (isEmailTaken && isEmailTaken.id !== userId) {
                    return res.status(400).json({
                        error: true,
                        message: 'Email is already in use by another user',
                        data: null,
                    });
                }
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    fullName: name || user.fullName,
                    email: email || user.email,
                    role: role || user.role,
                    divisionId: divisionId || user.divisionId,
                },
            });

            res.status(200).json({ error: false, message: 'User updated successfully', data: updatedUser });
        } catch (err) {
            res.status(500).json({ error: true, message: 'Error updating user', data: null, errorDetail: err.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== constant.ROLE.SUPERADMIN) {
                return res.status(403).json({
                    error: true,
                    message: 'You do not have permission to access this resource',
                    data: null,
                });
            }

            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    divisionId: true,
                    created_at: true,
                    userId: true,
                },
            });

            console.log(users)
            res.status(200).json({
                error: false,
                message: 'Users retrieved successfully',
                data: users,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error retrieving users',
                errorDetail: err.message,
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.body;

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found',
                    data: null,
                });
            }

            // Begin transaction for delete cascade
            await prisma.$transaction(async (tx) => {
                // Delete all related metricResult from assesmentNonDev
                await tx.metricResult.deleteMany({
                    where: {
                        assesmentNonDev: {
                            userId: id
                        }
                    }
                });

                // Delete all related metricNormalization from assesmentNonDev
                await tx.metricNormalization.deleteMany({
                    where: {
                        assesmentNonDev: {
                            userId: id
                        }
                    }
                });

                // Delete all related assesmentResult from assesmentNonDev
                await tx.assesmentResult.deleteMany({
                    where: {
                        assesmentNonDev: {
                            userId: id
                        }
                    }
                });

                // Delete all assesmentNonDev records for this user
                await tx.assesmentNonDev.deleteMany({
                    where: { userId: id }
                });

                // Delete all projectCollaborator records for this user
                await tx.projectCollaborator.deleteMany({
                    where: { userId: id }
                });

                // Delete all tokens for this user
                await tx.token.deleteMany({
                    where: { userId: id }
                });

                // Finally, delete the user
                await tx.user.delete({
                    where: { id }
                });
            });

            res.status(200).json({
                error: false,
                message: 'User and all related data deleted successfully',
                data: null,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error deleting user',
                errorDetail: err.message,
            });
        }
    },

    deleteUserDivisionId: async (req, res) => {
        try {
            const { id } = req.body;

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found',
                    data: null,
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { divisionId: null },
            });

            res.status(200).json({
                error: false,
                message: 'Division removed from user successfully',
                data: updatedUser,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error removing division from user',
                errorDetail: err.message,
            });
        }
    },


};

module.exports = userController;
