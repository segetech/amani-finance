import 'dotenv/config';
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleUploadThing } from "./routes/uploadthing";
import { createVideoUploadUrl, getAssetStatus, deleteAsset } from "./routes/mux";
import { 
  getCommodities, 
  getCommodityById, 
  createCommodity, 
  updateCommodity, 
  deleteCommodity, 
  getCommodityCategories, 
  bulkUpdateCommodities 
} from "./routes/commodities";
import {
  getEconomicCountries,
  getEconomicCountryById,
  createEconomicCountry,
  updateEconomicCountry,
  deleteEconomicCountry,
  getRegionalMetrics,
  createRegionalMetric,
  updateRegionalMetric,
  deleteRegionalMetric
} from "./routes/economic-data";
import {
  getIndustrialSectors,
  createIndustrialSector,
  updateIndustrialSector,
  deleteIndustrialSector,
  getIndustrialCompanies,
  createIndustrialCompany,
  updateIndustrialCompany,
  deleteIndustrialCompany,
  getIndustrialMetrics,
  createIndustrialMetric,
  updateIndustrialMetric,
  deleteIndustrialMetric
} from "./routes/industrial-data";
import {
  getInvestmentCategories,
  createInvestmentCategory,
  updateInvestmentCategory,
  deleteInvestmentCategory,
  getInvestmentOpportunities,
  createInvestmentOpportunity,
  updateInvestmentOpportunity,
  deleteInvestmentOpportunity,
  getInvestmentMetrics,
  createInvestmentMetric,
  updateInvestmentMetric,
  deleteInvestmentMetric,
  getMarketTrends,
  createMarketTrend,
  updateMarketTrend,
  deleteMarketTrend
} from "./routes/investment-data";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  // Augmenter la limite de taille pour les uploads d'images (50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // UploadThing routes
  app.all("/api/uploadthing", handleUploadThing);

  // Mux routes
  app.post("/api/mux/upload", createVideoUploadUrl);
  app.get("/api/mux/asset/:assetId", getAssetStatus);
  app.delete("/api/mux/asset/:assetId", deleteAsset);

  // Commodities routes
  app.get("/api/commodities", getCommodities);
  app.get("/api/commodities/categories", getCommodityCategories);
  app.get("/api/commodities/:id", getCommodityById);
  app.post("/api/commodities", createCommodity);
  app.put("/api/commodities/:id", updateCommodity);
  app.delete("/api/commodities/:id", deleteCommodity);
  app.post("/api/commodities/bulk-update", bulkUpdateCommodities);

  // Economic data routes
  app.get("/api/economic-data/countries", getEconomicCountries);
  app.get("/api/economic-data/countries/:id", getEconomicCountryById);
  app.post("/api/economic-data/countries", createEconomicCountry);
  app.put("/api/economic-data/countries/:id", updateEconomicCountry);
  app.delete("/api/economic-data/countries/:id", deleteEconomicCountry);
  app.get("/api/economic-data/metrics", getRegionalMetrics);
  app.post("/api/economic-data/metrics", createRegionalMetric);
  app.put("/api/economic-data/metrics/:id", updateRegionalMetric);
  app.delete("/api/economic-data/metrics/:id", deleteRegionalMetric);

  // Industrial data routes
  app.get("/api/industrial-data/sectors", getIndustrialSectors);
  app.post("/api/industrial-data/sectors", createIndustrialSector);
  app.put("/api/industrial-data/sectors/:id", updateIndustrialSector);
  app.delete("/api/industrial-data/sectors/:id", deleteIndustrialSector);
  app.get("/api/industrial-data/companies", getIndustrialCompanies);
  app.post("/api/industrial-data/companies", createIndustrialCompany);
  app.put("/api/industrial-data/companies/:id", updateIndustrialCompany);
  app.delete("/api/industrial-data/companies/:id", deleteIndustrialCompany);
  app.get("/api/industrial-data/metrics", getIndustrialMetrics);
  app.post("/api/industrial-data/metrics", createIndustrialMetric);
  app.put("/api/industrial-data/metrics/:id", updateIndustrialMetric);
  app.delete("/api/industrial-data/metrics/:id", deleteIndustrialMetric);

  // Investment data routes
  app.get("/api/investment-data/categories", getInvestmentCategories);
  app.post("/api/investment-data/categories", createInvestmentCategory);
  app.put("/api/investment-data/categories/:id", updateInvestmentCategory);
  app.delete("/api/investment-data/categories/:id", deleteInvestmentCategory);
  app.get("/api/investment-data/opportunities", getInvestmentOpportunities);
  app.post("/api/investment-data/opportunities", createInvestmentOpportunity);
  app.put("/api/investment-data/opportunities/:id", updateInvestmentOpportunity);
  app.delete("/api/investment-data/opportunities/:id", deleteInvestmentOpportunity);
  app.get("/api/investment-data/metrics", getInvestmentMetrics);
  app.post("/api/investment-data/metrics", createInvestmentMetric);
  app.put("/api/investment-data/metrics/:id", updateInvestmentMetric);
  app.delete("/api/investment-data/metrics/:id", deleteInvestmentMetric);
  app.get("/api/investment-data/trends", getMarketTrends);
  app.post("/api/investment-data/trends", createMarketTrend);
  app.put("/api/investment-data/trends/:id", updateMarketTrend);
  app.delete("/api/investment-data/trends/:id", deleteMarketTrend);

  return app;
}
