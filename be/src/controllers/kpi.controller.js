const prisma = require('../configs/database');

const kpiController = {
 // Create a new KPI (metric)
 createKpi: async (req, res) => {
  const { kodeKpi, kpiName, target, bobot, char, divisionId } = req.body;

  if (!kodeKpi || !kpiName || target === undefined || bobot === undefined || !char || !divisionId) {
    return res.status(400).json({
      error: true,
      message: "Kode KPI, Nama KPI, Target, Bobot, Karakteristik, dan Division ID wajib diisi.",
    });
  }

  try {
    const targetInPercent = target;
    const newKpi = await prisma.metric.create({
      data: {
        kodeKpi,
        kpiName,
        target: targetInPercent,
        bobot,
        char,
        divisionId,  
      },
    });

    res.status(201).json({
      error: false,
      message: "KPI created successfully",
      data: newKpi,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Gagal menambahkan KPI",
      errorDetail: error.message,
    });
  }
},

// Get all KPIs
getAllKpis: async (req, res) => {
  try {
    const kpis = await prisma.metric.findMany();

    const result = kpis.map((kpi) => ({
      id: kpi.id,
      kodeKpi: kpi.kodeKpi,
      kpiName: kpi.kpiName,
      target: kpi.target,  
      bobot: kpi.bobot,
      char: kpi.char,
      divisionId: kpi.divisionId,  
      created_at: kpi.created_at,
      updated_at: kpi.updated_at,
    }));

    res.status(200).json({
      error: false,
      message: "KPI data retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Gagal mengambil data KPI",
      errorDetail: error.message,
    });
  }
},

// Get KPIs by division
getKpisByDivision: async (req, res) => {
  const { divisionId } = req.query; 

  if (!divisionId) {
    return res.status(400).json({
      error: true,
      message: "Division ID harus disertakan.",
    });
  }

  try {
    const kpis = await prisma.metric.findMany({
      where: {
        divisionId: divisionId,  
      },
    });

    const result = kpis.map((kpi) => ({
      id: kpi.id,
      kodeKpi: kpi.kodeKpi,
      kpiName: kpi.kpiName,
      target: kpi.target,  
      bobot: kpi.bobot,
      char: kpi.char,
      divisionId: kpi.divisionId,  
      created_at: kpi.created_at,
      updated_at: kpi.updated_at,
    }));

    res.status(200).json({
      error: false,
      message: "KPI data for division retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Gagal mengambil data KPI berdasarkan divisi",
      errorDetail: error.message,
    });
  }
},

// Edit a KPI
editKpi: async (req, res) => {
  const { id } = req.params;
  const { kodeKpi, kpiName, target, bobot, char, divisionId } = req.body;

  if (!kodeKpi || !kpiName || target === undefined || bobot === undefined || !char || !divisionId) {
    return res.status(400).json({
      error: true,
      message: "Kode KPI, Nama KPI, Target, Bobot, Karakteristik, dan Division ID wajib diisi.",
    });
  }

  try {
    const kpi = await prisma.metric.findUnique({ where: { id } });

    if (!kpi) {
      return res.status(404).json({
        error: true,
        message: "KPI tidak ditemukan.",
      });
    }

    const targetInPercent = target ;
    const updatedKpi = await prisma.metric.update({
      where: { id },
      data: {
        kodeKpi,
        kpiName,
        target: targetInPercent,
        bobot,
        char,
        divisionId,  
      },
    });

    res.status(200).json({
      error: false,
      message: "KPI updated successfully",
      data: updatedKpi,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Gagal mengupdate KPI",
      errorDetail: error.message,
    });
  }
},

// Delete a KPI
deleteKpi: async (req, res) => {
  const { id } = req.params;

  try {
    const kpi = await prisma.metric.findUnique({ where: { id } });

    if (!kpi) {
      return res.status(404).json({
        error: true,
        message: "KPI tidak ditemukan.",
      });
    }

    await prisma.metric.delete({ where: { id } });

    res.status(200).json({
      error: false,
      message: "KPI deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Gagal menghapus KPI",
      errorDetail: error.message,
    });
  }
},
};

module.exports = kpiController;
