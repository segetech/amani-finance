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

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  return app;
}
