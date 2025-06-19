import { users, migrationConfigurations, type User, type InsertUser, type MigrationConfigDB, type InsertMigrationConfig } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMigrationConfigurations(agreementFilter?: string): Promise<MigrationConfigDB[]>;
  createMigrationConfiguration(config: InsertMigrationConfig): Promise<MigrationConfigDB>;
  updateMigrationDescription(id: number, description: string): Promise<MigrationConfigDB | undefined>;
  deleteMigrationConfiguration(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMigrationConfigurations(agreementFilter?: string): Promise<MigrationConfigDB[]> {
    if (agreementFilter && agreementFilter !== 'all') {
      return await db.select().from(migrationConfigurations)
        .where(eq(migrationConfigurations.agreement, agreementFilter))
        .orderBy(desc(migrationConfigurations.createdAt));
    }
    
    return await db.select().from(migrationConfigurations)
      .orderBy(desc(migrationConfigurations.createdAt));
  }

  async createMigrationConfiguration(config: InsertMigrationConfig): Promise<MigrationConfigDB> {
    const [migrationConfig] = await db
      .insert(migrationConfigurations)
      .values(config)
      .returning();
    return migrationConfig;
  }

  async updateMigrationDescription(id: number, description: string): Promise<MigrationConfigDB | undefined> {
    const [updated] = await db
      .update(migrationConfigurations)
      .set({ description })
      .where(eq(migrationConfigurations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMigrationConfiguration(id: number): Promise<boolean> {
    const result = await db
      .delete(migrationConfigurations)
      .where(eq(migrationConfigurations.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
