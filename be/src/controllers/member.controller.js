const prisma = require("../configs/database");
const { encryptPassword } = require("../utils/bcrypt.js");

const memberController = {
  // Generate custom userId format: USR-0001, USR-0002, etc.
  generateUserId: async () => {
    // Find the highest existing userId number
    const lastUser = await prisma.user.findFirst({
      where: {
        userId: {
          startsWith: 'USR-'
        }
      },
      orderBy: {
        userId: 'desc'
      }
    });

    let nextNumber = 1;
    if (lastUser && lastUser.userId) {
      // Extract number from USR-XXXX format
      const lastNumber = parseInt(lastUser.userId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    return `USR-${nextNumber.toString().padStart(4, '0')}`;
  },

  // Create a new member
  createMember: async (req, res) => {
    const { fullName, divisionId } = req.body;
    const hashedPassword = await encryptPassword("@Test123");

    if (!fullName || !divisionId) {
      return res.status(400).json({
        error: true,
        message: "Nama dan Divisi wajib diisi.",
      });
    }

    try {
      // Generate unique userId
      const userId = await memberController.generateUserId();
      
      const newMember = await prisma.user.create({
        data: {
          userId,
          fullName,
          email: `${fullName.toLowerCase().replace(/\s/g, "")}@example.com`,
          password: hashedPassword,
          role: "MEMBER",
          divisionId,
        },
      });

      res.status(201).json({
        error: false,
        message: "Member created successfully",
        data: newMember,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menambahkan member",
        errorDetail: error.message,
      });
    }
  },

  // Update a member
  updateMember: async (req, res) => {
    const { id } = req.params;
    const { fullName, divisionId } = req.body;

    try {
      const member = await prisma.user.findUnique({ where: { id } });
      if (!member) {
        return res.status(404).json({
          error: true,
          message: "Member tidak ditemukan.",
        });
      }

      const updatedMember = await prisma.user.update({
        where: { id },
        data: { fullName, divisionId },
      });

      res.status(200).json({
        error: false,
        message: "Member updated successfully",
        data: updatedMember,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal mengupdate member",
        errorDetail: error.message,
      });
    }
  },

  // Get all members
  getAllMembers: async (req, res) => {
    try {
      const { division } = req.query;

      let whereClause = { role: "MEMBER" };

      if (division) {
        whereClause = {
          ...whereClause,
          division: {
            divisionName: division
          }
        };
      }

      const members = await prisma.user.findMany({
        where: whereClause,
        include: {
          division: {
            select: { divisionName: true },
          },
        },
        orderBy: {
          userId: 'asc'
        }
      });

      // Format respons biar lebih rapi
      const result = members.map((member) => ({
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        userId: member.userId,
        division: member.division
          ? member.division.divisionName
          : "Tidak ada divisi",
        created_at: member.created_at,
        updated_at: member.updated_at,
      }));

      res.status(200).json({
        error: false,
        message: "Members retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal mengambil data members",
        errorDetail: error.message,
      });
    }
  },

  // Delete a member
  deleteMember: async (req, res) => {
    const { id } = req.params;

    try {
      const member = await prisma.user.findUnique({
        where: { id },
        include: { division: true }
      });

      if (!member) {
        return res.status(404).json({
          error: true,
          message: "Member tidak ditemukan.",
        });
      }

      // Cascade delete: Remove all related records first
      await prisma.$transaction(async (tx) => {
        // Delete user tokens
        await tx.token.deleteMany({
          where: { userId: id }
        });

        // Delete user assessments (non-dev)
        await tx.assesmentNonDev.deleteMany({
          where: { userId: id }
        });

        // Delete project collaborations
        await tx.projectCollaborator.deleteMany({
          where: { userId: id }
        });

        // Finally delete the user
        await tx.user.delete({ where: { id } });
      });

      res.status(200).json({
        error: false,
        message: "Member deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menghapus member",
        errorDetail: error.message,
      });
    }
  },
};



module.exports = memberController;
