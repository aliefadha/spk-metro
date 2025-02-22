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
    
    
    
};

module.exports = metricController;
