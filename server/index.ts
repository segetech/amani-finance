import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleUploadThing } from "./routes/uploadthing";
import { createVideoUploadUrl, getAssetStatus, deleteAsset } from "./routes/mux";

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

  return app;
}
