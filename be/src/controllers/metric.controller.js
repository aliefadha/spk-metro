const prisma = require('../configs/database');

const metricController = { 
   
    getKPIReportByUser : async (req, res) => {
        try {
            const { userId, projectId } = req.body; 
    
            if (!userId || !projectId) {
                return res.status(400).json({
                    error: true,
                    message: "userId dan projectId wajib diisi dalam body request",
                });
            }
    
            const assessments = await prisma.assesment.findMany({
                where: { userId, projectId },
                include: {
                    metric: true, 
                },
            });
    
            if (!assessments.length) {
                return res.status(404).json({
                    error: true,
                    message: "Tidak ada data assessment untuk user dan project ini",
                });
            }
    
            const metrics = await prisma.metric.findMany({
                where: {
                    id: { in: assessments.map(a => a.metricId) }, 
                },
            });
    
            const reportData = assessments.map(assessment => {
                const metric = metrics.find(m => m.id === assessment.metricId);
    
                if (!metric) return null;
    
                const skorAkhir = (assessment.value / metric.target) * 100;
    
                return {
                    metricId: assessment.metricId,
                    metricName: metric.kpiName,
                    bobot: metric.bobot,
                    target: metric.target,
                    skorAktual: assessment.value,
                    skorAkhir: `${skorAkhir.toFixed(2)}%`,
                    status: skorAkhir >= 100 ? "Achieved" : "Not Achieved",
                };
            }).filter(item => item !== null);
    
            return res.status(200).json({
                error: false,
                message: "Data KPI Report berhasil diambil",
                data: reportData,
            });
    
        } catch (error) {
            console.error("Gagal mengambil data KPI Report:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal mengambil data KPI Report",
                errorDetail: error.message,
            });
        }
    },

    getAllKPIReports: async (req, res) => {
        try {
            // 🔹 Ambil semua projectCollaborator yang bukan project manager
            const projectMembers = await prisma.projectCollaborator.findMany({
                where: { isProjectManager: false },
                include: {
                    user: true, // Ambil informasi user
                },
            });
    
            // 🔹 Ambil semua metrik
            const metrics = await prisma.metric.findMany();
    
            // 🔹 Ambil semua data assessment hanya untuk user yang ada di project
            const assessments = await prisma.assesment.findMany({
                where: { userId: { in: projectMembers.map(m => m.userId) } },
                include: { metric: true },
            });
    
            // 🔹 Format hasil ke bentuk yang sesuai FE
            const result = projectMembers
                .map((member) => {
                    const userId = member.userId;
                    const userFullName = member.user.fullName;
    
                    // 🔹 Ambil nilai setiap metrik untuk user ini
                    const metricValues = metrics.map((metric) => {
                        const assessment = assessments.find(
                            (a) => a.userId === userId && a.metricId === metric.id
                        );
                        return assessment ? assessment.value : 0;
                    });
    
                    // 🔹 Skip kalau user tidak punya assessment
                    if (metricValues.every(val => val === 0)) return null;
    
                    // 🔹 Hitung total skor sebagai rata-rata pencapaian target
                    const totalSkor = metricValues.reduce((acc, val, index) => {
                        const target = metrics[index].target || 1;
                        return acc + (val / target) * 100;
                    }, 0) / metrics.length;
    
                    // 🔹 Status Achieved jika semua metrik mencapai targetnya
                    const status = metricValues.every((val, index) => val >= metrics[index].target)
                        ? "Achieved"
                        : "Not Achieved";
    
                    return {
                        fullName: userFullName,
                        metrics: metricValues,
                        totalSkor: `${totalSkor.toFixed(2)}%`,
                        status,
                    };
                })
                .filter(item => item !== null); // Hanya user yang punya assessment
    
            return res.status(200).json({
                error: false,
                message: "Semua data KPI Report berhasil diambil",
                data: result,
            });
        } catch (error) {
            console.error("Gagal mengambil data KPI Report:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal mengambil data KPI Report",
                errorDetail: error.message,
            });
        }
    },
    

    
 
};

module.exports = metricController;
