import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"


export const sleepLogs = pgTable('sleep_logs', {
  id: text('id').primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp('date').notNull(),
  duration: text('duration').notNull(),
  quality: text('quality').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sleepAssessments = pgTable('sleep_assessments', {
  id: text('id').primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp('date').notNull(),
  score: text('score').notNull(),
  factors: text('factors').notNull(),
  recommendations: text('recommendations').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sleepGoals = pgTable('sleep_goals', {
  id: text('id').primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetDuration: integer('sleep_hour_goal').notNull(), // in minutes
  bedtime: text('preferred_bedtime').notNull(), // target bedtime in HH:MM format
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

