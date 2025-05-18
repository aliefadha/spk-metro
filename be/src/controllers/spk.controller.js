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