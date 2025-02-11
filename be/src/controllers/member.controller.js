const prisma = require("../configs/database");
const { encryptPassword } = require("../utils/bcrypt.js");

const memberController = {
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
      const newMember = await prisma.user.create({
        data: {
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

  // Get all members
  getAllMembers: async (req, res) => {
    try {
      const members = await prisma.user.findMany({
        where: { role: "MEMBER" },
        include: { division: true },
      });

      res.status(200).json({
        error: false,
        message: "Members retrieved successfully",
        data: members,
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
      const member = await prisma.user.findUnique({ where: { id } });

      if (!member) {
        return res.status(404).json({
          error: true,
          message: "Member tidak ditemukan.",
        });
      }

      await prisma.user.delete({ where: { id } });

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
