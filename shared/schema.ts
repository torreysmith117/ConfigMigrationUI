import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const migrationConfigurations = pgTable("migration_configurations", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  sourceDbServer: text("source_db_server").notNull(),
  sourceDbName: text("source_db_name").notNull(),
  targetDbName: text("target_db_name").notNull(),
  etlDbName: text("etl_db_name").notNull(),
  agreement: text("agreement").notNull(),
  agreementLabel: text("agreement_label").notNull(),
  exportCriteria: text("export_criteria").notNull(),
  criteriaLabel: text("criteria_label").notNull(),
  selectionParameter: text("selection_parameter"),
  exportDirectory: text("export_directory"),
  logDirectory: text("log_directory"),
  agreementNotes: text("agreement_notes"),
  exportDate: timestamp("export_date").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).notNull().default('completed'),
  description: text("description").default(''),
  recordCount: integer("record_count").notNull().default(0),
  executionTime: integer("execution_time").notNull().default(0), // in milliseconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMigrationConfigSchema = createInsertSchema(migrationConfigurations).omit({
  id: true,
  createdAt: true,
});

export const migrationConfigRelations = relations(migrationConfigurations, ({ one }) => ({}));

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMigrationConfig = z.infer<typeof insertMigrationConfigSchema>;
export type MigrationConfigDB = typeof migrationConfigurations.$inferSelect;
