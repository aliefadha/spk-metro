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
    
            // Inisialisasi total bobot dan skor berbobot
            let totalBobot = 0;
            let totalSkorBerbobot = 0;
    
            const reportData = assessments.map(assessment => {
                const metric = metrics.find(m => m.id === assessment.metricId);
                if (!metric || !metric.target || assessment.value === 0) return null;
    
                const actual = assessment.value;
                const target = metric.target;
                let skorAkhir = 0;
    
                if (metric.char === 'Benefit') {
                    skorAkhir = (actual / target) * 100;
                } else if (metric.char === 'Cost') {
                    skorAkhir = (target / actual) * 100;
                }
    
                // Tambahkan ke total skor berbobot dan total bobot
                totalBobot += metric.bobot ;
                totalSkorBerbobot += skorAkhir * metric.bobot;
    
                return {
                    metricId: assessment.metricId,
                    metricName: metric.kpiName,
                    bobot: metric.bobot,
                    target: metric.target,
                    skorAktual: actual,
                    skorAkhir: `${skorAkhir.toFixed(2)}`,
                    status: skorAkhir >= 100 ? "Achieved" : "Not Achieved",
                };
            }).filter(item => item !== null);
    
            // Hitung total skor jika total bobot > 0
            const totalSkor = totalSkorBerbobot / totalBobot;
    
            return res.status(200).json({
                error: false,
                message: "Data KPI Report berhasil diambil",
                data: {
                    reportData,
                    totalSkor: totalSkor.toFixed(2),
                },
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
            // Ambil semua projectCollaborator yang bukan project manager
            const projectMembers = await prisma.projectCollaborator.findMany({
                where: { isProjectManager: false },
                include: { user: true },
            });
    
            // Ambil semua metrik
            const metrics = await prisma.metric.findMany();
    
            // Ambil semua data assessment hanya untuk user yang ada di project
            const assessments = await prisma.assesment.findMany({
                where: { userId: { in: projectMembers.map(m => m.userId) } },
                include: { metric: true },
            });
    
            // Format hasil ke bentuk yang sesuai FE
            const result = projectMembers.map((member) => {
                const userId = member.userId;
                const userFullName = member.user.fullName;
    
                // Hitung skor metrik setelah normalisasi
                const normalizedScores = metrics.map((metric) => {
                    const assessment = assessments.find(
                        (a) => a.userId === userId && a.metricId === metric.id
                    );
    
                    if (!assessment || assessment.value === 0 || metric.target === 0) {
                        return 0;
                    }
    
                    const actual = assessment.value;
                    const target = metric.target;
    
                    let normalized = 0;
                    if (metric.char === 'Benefit') {
                        normalized = (actual / target) * 100;
                    } else if (metric.char === 'Cost') {
                        normalized = (target / actual) * 100;
                    }
    
                    return Number(normalized.toFixed(1));

                });
    
                // Hitung total skor berbobot
                let totalBobot = 0;
                let skorBerbobot = 0;
    
                normalizedScores.forEach((score, index) => {
                    const bobot = metrics[index].bobot || 0;
                    skorBerbobot += score * bobot;
                    totalBobot += bobot;
                });
    
                const totalSkor = totalBobot > 0 ? skorBerbobot / totalBobot : 0;
    
                // Status Achieved jika semua metrik capai 100 atau lebih
                const status = normalizedScores.every(score => score >= 100)
                    ? "Achieved"
                    : "Not Achieved";
    
                // Hanya tampilkan user yang punya assessment
                if (normalizedScores.every(val => val === 0)) return null;
    
                return {
                    fullName: userFullName,
                    metrics: normalizedScores,
                    totalSkor: totalSkor.toFixed(1),
                    status,
                };
            }).filter(item => item !== null); // Hanya user yang punya assessment
    
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
