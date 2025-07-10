const prisma = require('../configs/database');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const KPI_API_URL = 'http://localhost:3000/api/v1/kpi-reports';

const spkController = {

    // 1. GET /api/spk/decision-matrix
    getDecisionMatrix: async (req, res) => {
        try {
            const response = await fetch(KPI_API_URL);
            const json = await response.json();
            const data = json.data;

            if (!data || !Array.isArray(data)) {
                return res.status(400).json({
                    error: true,
                    message: "Data KPI tidak valid"
                });
            }

            return res.status(200).json({
                error: false,
                message: 'Decision matrix berhasil diambil',
                data
            });

        } catch (error) {
            console.error("Gagal ambil decision matrix:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal ambil matriks keputusan",
                errorDetail: error.message,
            });
        }
    },

    // 2. GET /api/spk/normalized-matrix
    getNormalizedMatrix: async (req, res) => {
        try {
            const response = await fetch(KPI_API_URL);
            const json = await response.json();
            const data = json.data;

            const metrics = await prisma.metric.findMany();

            const maxValues = [], minValues = [];

            for (let i = 0; i < data[0].metrics.length; i++) {
                const values = data.map(d => d.metrics[i]);
                maxValues[i] = Math.max(...values);
                minValues[i] = Math.min(...values);
            }

            const normalized = data.map(row => {
                const values = row.metrics.map((val, i) => {
                    const metric = metrics[i];
                    const max = maxValues[i];
                    const min = minValues[i];

                    if (metric.char === 'Benefit') {
                        return (val - min) / (max - min);
                    } else if (metric.char === 'Cost') {
                        return (max - val) / (max - min);
                    }
                    return 0;
                });

                return {
                    fullName: row.fullName,
                    values: values.map(v => Number(v.toFixed(4)))
                };
            });

            return res.status(200).json({
                error: false,
                message: 'Normalisasi matriks berhasil',
                data: normalized
            });

        } catch (error) {
            console.error("Gagal normalisasi:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal normalisasi matriks",
                errorDetail: error.message,
            });
        }
    },

    // 3. GET /api/spk/si-ri
    getSiRi: async (req, res) => {
        try {
            console.log("Starting getSiRi function");
            
            // Get Developer division
            const developerDivision = await prisma.division.findFirst({
                where: { divisionName: "Developer" }
            });

            console.log("Developer division found:", developerDivision);

            if (!developerDivision) {
                return res.status(404).json({
                    error: true,
                    message: "Developer division not found"
                });
            }

            // Get Developer division metrics
            const metrics = await prisma.metric.findMany({
                where: { divisionId: developerDivision.id }
            });

            console.log("Metrics found:", metrics.length);

            if (metrics.length === 0) {
                return res.status(200).json({
                    error: false,
                    message: 'No metrics found for Developer division',
                    data: []
                });
            }

            // Get current month and year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0-11
            const currentYear = currentDate.getFullYear();

            console.log("Current month/year:", currentMonth, currentYear);

            // Get completed projects from current month
            const projects = await prisma.project.findMany({
                where: {
                    status: "DONE",
                    tanggal_selesai: {
                        not: null
                    }
                }
            });

            console.log("Total DONE projects:", projects.length);
            console.log("Projects dates:", projects.map(p => ({ id: p.id, name: p.projectName, date: p.tanggal_selesai })));

            // Filter projects by current month completion date
            let currentMonthProjects = projects.filter(p => {
                if (!p.tanggal_selesai) return false;
                
                try {
                    const completionDate = new Date(p.tanggal_selesai);
                    return completionDate.getMonth() === currentMonth && 
                           completionDate.getFullYear() === currentYear;
                } catch (error) {
                    console.error("Error parsing tanggal_selesai:", p.tanggal_selesai, error);
                    return false;
                }
            });

            console.log("Current month projects:", currentMonthProjects.length);

            // If no projects in current month, use the most recent completed projects
            if (currentMonthProjects.length === 0) {
                console.log("No projects in current month, using recent projects");
                // Sort by completion date and take the most recent ones
                currentMonthProjects = projects
                    .filter(p => p.tanggal_selesai)
                    .sort((a, b) => new Date(b.tanggal_selesai) - new Date(a.tanggal_selesai))
                    .slice(0, 5); // Take up to 5 most recent projects
                
                console.log("Using recent projects:", currentMonthProjects.length);
            }

            if (currentMonthProjects.length === 0) {
                return res.status(200).json({
                    error: false,
                    message: 'No completed projects found',
                    data: []
                });
            }

            // Get assessments for current month projects
            const allAssessments = [];
            for (const project of currentMonthProjects) {
                console.log("Processing project:", project.id, project.projectName);
                
                try {
                    const projectAssessments = await prisma.assesment.findMany({
                        where: { projectId: project.id },
                        include: {
                            user: true,
                            metric: true
                        }
                    });

                    console.log("Assessments found for project:", project.id, projectAssessments.length);

                    projectAssessments.forEach(assessment => {
                        assessment.projectBobot = project.bobot;
                        allAssessments.push(assessment);
                    });
                } catch (assessmentError) {
                    console.error("Error fetching assessments for project:", project.id, assessmentError);
                    // Continue with other projects
                }
            }

            console.log("Total assessments found:", allAssessments.length);

            if (allAssessments.length === 0) {
                return res.status(200).json({
                    error: false,
                    message: 'No assessment data found for current month projects',
                    data: []
                });
            }

            // Group assessments by user and calculate weighted scores
            const userAssessments = {};
            allAssessments.forEach(assessment => {
                if (!userAssessments[assessment.userId]) {
                    userAssessments[assessment.userId] = {
                        userId: assessment.userId,
                        fullName: assessment.user.fullName,
                        metrics: {}
                    };
                }

                // Calculate weighted scores for each metric
                if (!userAssessments[assessment.userId].metrics[assessment.metricId]) {
                    userAssessments[assessment.userId].metrics[assessment.metricId] = {
                        totalWeightedScore: 0,
                        totalWeight: 0
                    };
                }

                // Find the KPI to get target and char for skorAkhir calculation
                const kpi = metrics.find(k => k.id === assessment.metricId);
                if (kpi && kpi.target && assessment.value !== 0) {
                    const actual = assessment.value;
                    const target = kpi.target;
                    let skorAkhir = 0;

                    // Calculate skorAkhir based on characteristic
                    if (kpi.char === 'Benefit') {
                        skorAkhir = (actual / target) * 100;
                    } else if (kpi.char === 'Cost') {
                        skorAkhir = (target / actual) * 100;
                    }

                    // Add weighted score: skorAkhir * project.bobot
                    const weightedScore = skorAkhir * assessment.projectBobot;
                    userAssessments[assessment.userId].metrics[assessment.metricId].totalWeightedScore += weightedScore;
                    userAssessments[assessment.userId].metrics[assessment.metricId].totalWeight += assessment.projectBobot;
                }
            });

            // Convert to expected format with weighted averages
            const rawData = Object.values(userAssessments).map(user => {
                const metricsArray = metrics.map(kpi => {
                    const metricData = user.metrics[kpi.id];
                    if (metricData && metricData.totalWeight > 0) {
                        // Calculate weighted average: sum(skorAkhir * bobot) / sum(bobot)
                        const weightedAverage = metricData.totalWeightedScore / metricData.totalWeight;
                        return Math.round(weightedAverage * 100) / 100; // Round to 2 decimal places
                    }
                    return 0;
                });

                return {
                    fullName: user.fullName,
                    metrics: metricsArray
                };
            });

            console.log("RawData users:", rawData.length);

            if (rawData.length === 0) {
                return res.status(200).json({
                    error: false,
                    message: 'No assessment data for current month',
                    data: []
                });
            }

            // Check if we have valid metrics data
            if (rawData[0].metrics.length === 0) {
                return res.status(200).json({
                    error: false,
                    message: 'No valid metrics data found',
                    data: []
                });
            }

            // Calculate max and min values for normalization
            const maxValues = [], minValues = [];
            for (let i = 0; i < rawData[0].metrics.length; i++) {
                const values = rawData.map(d => d.metrics[i]);
                maxValues[i] = Math.max(...values);
                minValues[i] = Math.min(...values);
            }

            // Normalize the data
            const normalized = rawData.map(row => {
                const values = row.metrics.map((val, i) => {
                    const metric = metrics[i];
                    const max = maxValues[i];
                    const min = minValues[i];

                    // Avoid division by zero
                    if (max === min) return 1;

                    if (metric.char === 'Benefit') {
                        return (val - min) / (max - min);
                    } else if (metric.char === 'Cost') {
                        return (max - val) / (max - min);
                    }
                    return 0;
                });
                return {
                    fullName: row.fullName,
                    values: values.map(v => Number(v.toFixed(4)))
                };
            });

            // Calculate Si and Ri values
            const siRi = normalized.map(user => {
                let Si = 0, Ri = 0;
                user.values.forEach((v, i) => {
                    const weight = metrics[i]?.weight || 0; // Use weight instead of bobot
                    const skor = v * weight;
                    Si += skor;
                    if (skor > Ri) Ri = skor;
                });
                return {
                    fullName: user.fullName,
                    Si: Number(Si.toFixed(4)),
                    Ri: Number(Ri.toFixed(4))
                };
            });

            return res.status(200).json({
                error: false,
                message: 'Nilai Si dan Ri berhasil dihitung',
                data: siRi
            });

        } catch (error) {
            console.error("Gagal hitung Si Ri:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal hitung Si dan Ri",
                errorDetail: error.message,
            });
        }
    },

    // 4. GET /api/spk/vikor-result
    getVikorResultByProject: async (req, res) => {
        try {
            const response = await fetch(KPI_API_URL);
            const json = await response.json();
            const rawData = json.data;

            const metrics = await prisma.metric.findMany();

            const maxValues = [], minValues = [];
            for (let i = 0; i < rawData[0].metrics.length; i++) {
                const values = rawData.map(d => d.metrics[i]);
                maxValues[i] = Math.max(...values);
                minValues[i] = Math.min(...values);
            }

            const normalized = rawData.map(row => {
                const values = row.metrics.map((val, i) => {
                    const metric = metrics[i];
                    const max = maxValues[i];
                    const min = minValues[i];

                    if (metric.char === 'Benefit') {
                        return (val - min) / (max - min);
                    } else if (metric.char === 'Cost') {
                        return (max - val) / (max - min);
                    }
                    return 0;
                });
                return {
                    fullName: row.fullName,
                    values: values.map(v => Number(v.toFixed(4)))
                };
            });

            const siRi = normalized.map(user => {
                let Si = 0, Ri = 0;
                user.values.forEach((v, i) => {
                    const bobot = metrics[i]?.bobot || 0;
                    const skor = v * bobot;
                    Si += skor;
                    if (skor > Ri) Ri = skor;
                });
                return {
                    fullName: user.fullName,
                    Si: Number(Si.toFixed(4)),
                    Ri: Number(Ri.toFixed(4))
                };
            });

            const Smin = Math.min(...siRi.map(u => u.Si));
            const Smax = Math.max(...siRi.map(u => u.Si));
            const Rmin = Math.min(...siRi.map(u => u.Ri));
            const Rmax = Math.max(...siRi.map(u => u.Ri));
            const v = 0.5;

            const result = siRi.map(u => {
                const Qi = (
                    v * ((u.Si - Smin) / (Smax - Smin || 1)) +
                    (1 - v) * ((u.Ri - Rmin) / (Rmax - Rmin || 1))
                );
                return {
                    fullName: u.fullName,
                    Si: u.Si,
                    Ri: u.Ri,
                    Qi: Number(Qi.toFixed(4))
                };
            }).sort((a, b) => a.Qi - b.Qi);

            const rankedResult = result.map((item, index) => ({
                ...item,
                rank: index + 1
            }));
            
            return res.status(200).json({
                error: false,
                message: 'Nilai VIKOR (Q) berhasil dihitung',
                data: rankedResult
            });

        } catch (error) {
            console.error("Gagal hitung VIKOR:", error);
            return res.status(500).json({
                error: true,
                message: "Gagal hitung nilai VIKOR",
                errorDetail: error.message,
            });
        }
    },
};

module.exports = spkController;