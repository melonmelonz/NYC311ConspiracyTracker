import {
  availableCategories,
  boroughReports,
  categoryReports,
  listReports,
  mapData,
  searchReports,
  statsSummary
} from '../services/reportService.js';

function parseReportQuery(query) {
  return {
    limit: query.limit ? Number(query.limit) : undefined,
    borough: query.borough,
    category: query.category,
    search: query.q,
    minScore: query.minScore ? Number(query.minScore) : undefined
  };
}

export async function getAllReports(req, res, next) {
  try {
    const reports = await listReports(parseReportQuery(req.query));

    res.json({
      meta: {
        count: reports.length,
        categories: availableCategories()
      },
      data: reports
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportsByCategory(req, res, next) {
  try {
    const reports = await categoryReports(req.params.category, parseReportQuery(req.query));

    res.json({
      meta: {
        category: req.params.category.toUpperCase(),
        count: reports.length
      },
      data: reports
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportsByBorough(req, res, next) {
  try {
    const reports = await boroughReports(req.params.borough, parseReportQuery(req.query));

    res.json({
      meta: {
        borough: req.params.borough.toUpperCase(),
        count: reports.length
      },
      data: reports
    });
  } catch (error) {
    next(error);
  }
}

export async function searchConspiracyReports(req, res, next) {
  try {
    const reports = await searchReports(req.query.q || '', parseReportQuery(req.query));

    res.json({
      meta: {
        query: req.query.q || '',
        count: reports.length
      },
      data: reports
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await statsSummary();

    res.json({
      meta: {
        generatedAt: new Date().toISOString()
      },
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

export async function getMapData(req, res, next) {
  try {
    const payload = await mapData(parseReportQuery(req.query));

    res.json({
      meta: {
        count: payload.reports.length
      },
      data: payload
    });
  } catch (error) {
    next(error);
  }
}
