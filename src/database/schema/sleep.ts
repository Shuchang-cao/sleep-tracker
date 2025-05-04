import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './auth';
import { relations } from 'drizzle-orm';

export const sleepLogs = pgTable('sleep_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  duration: text('duration').notNull(),
  quality: text('quality').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sleepAssessments = pgTable('sleep_assessments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  score: text('score').notNull(),
  factors: text('factors').notNull(),
  recommendations: text('recommendations').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sleepGoals = pgTable('sleep_goals', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetDuration: integer('target_duration').notNull(), // in minutes
  bedtime: text('bedtime').notNull(), // target bedtime in HH:MM format
  wakeupTime: text('wakeup_time').notNull(), // target wakeup time in HH:MM format
  daysOfWeek: text('days_of_week').notNull(), // comma-separated list of days (e.g., "Mon,Tue,Wed,Thu,Fri")
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sleepLogsRelations = relations(sleepLogs, ({ one }) => ({
  user: one(users, {
    fields: [sleepLogs.userId],
    references: [users.id],
  }),
}));

export const sleepAssessmentsRelations = relations(sleepAssessments, ({ one }) => ({
  user: one(users, {
    fields: [sleepAssessments.userId],
    references: [users.id],
  }),
}));

export const sleepGoalsRelations = relations(sleepGoals, ({ one }) => ({
  user: one(users, {
    fields: [sleepGoals.userId],
    references: [users.id],
  }),
}));