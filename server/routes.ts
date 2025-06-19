import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMigrationConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Migration configuration routes
  app.get("/api/migration-configurations", async (req, res) => {
    try {
      const { agreementFilter } = req.query;
      const configurations = await storage.getMigrationConfigurations(agreementFilter as string);
      res.json(configurations);
    } catch (error) {
      console.error("Error fetching migration configurations:", error);
      res.status(500).json({ error: "Failed to fetch migration configurations" });
    }
  });

  app.post("/api/migration-configurations", async (req, res) => {
    try {
      const validatedData = insertMigrationConfigSchema.parse(req.body);
      const configuration = await storage.createMigrationConfiguration(validatedData);
      res.status(201).json(configuration);
    } catch (error) {
      console.error("Error creating migration configuration:", error);
      res.status(400).json({ error: "Failed to create migration configuration" });
    }
  });

  app.patch("/api/migration-configurations/:id/description", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { description } = req.body;
      const updated = await storage.updateMigrationDescription(id, description);
      if (!updated) {
        return res.status(404).json({ error: "Migration configuration not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating migration description:", error);
      res.status(400).json({ error: "Failed to update migration description" });
    }
  });

  app.delete("/api/migration-configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMigrationConfiguration(id);
      if (!deleted) {
        return res.status(404).json({ error: "Migration configuration not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting migration configuration:", error);
      res.status(400).json({ error: "Failed to delete migration configuration" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
