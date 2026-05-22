import { Router } from 'express';
import {
  getAllReports,
  getMapData,
  getReportsByBorough,
  getReportsByCategory,
  getStats,
  searchConspiracyReports
} from '../controllers/reportController.js';

const router = Router();

/*
  GET /api/reports
  Pulls the latest NYC 311 data, runs server-side conspiracy classification,
  persists relevant reports, and returns cleaned case-file records. Optional
  query filters: limit, borough, category, q, minScore.
*/
router.get('/reports', getAllReports);

/*
  GET /api/reports/category/:category
  Returns reports for one classified intelligence category, for example
  /api/reports/category/SURVEILLANCE.
*/
router.get('/reports/category/:category', getReportsByCategory);

/*
  GET /api/reports/borough/:borough
  Returns conspiracy-related reports isolated to a single NYC borough.
*/
router.get('/reports/borough/:borough', getReportsByBorough);

/*
  GET /api/reports/search?q=
  Searches complaint type, descriptor, borough, and category fields.
*/
router.get('/reports/search', searchConspiracyReports);

/*
  GET /api/stats
  Returns aggregate counts used by dashboard stat cards and Recharts visuals.
*/
router.get('/stats', getStats);

/*
  GET /api/map-data
  Returns marker-ready report coordinates plus cinematic fake danger zones.
*/
router.get('/map-data', getMapData);

export default router;
