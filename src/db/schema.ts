import {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    integer,
    timestamp,
    date,
    uuid,
    uniqueIndex,
    index,
    type AnyPgColumn
} from 'drizzle-orm/pg-core'

export const articles = pgTable(
    'articles',
    {
        id: serial('id').primaryKey(),
        groupId: uuid('group_id').notNull().defaultRandom(),
        locale: varchar('locale', { length: 5 }).notNull(),
        title: text('title').notNull(),
        slug: varchar('slug', { length: 255 }).notNull(),
        excerpt: text('excerpt'),
        content: text('content'),
        image: text('image'),
        tag: varchar('tag', { length: 100 }),
        published: boolean('published').notNull().default(true),
        version: integer('version').notNull().default(1),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    (table) => [
        uniqueIndex('articles_group_locale_idx').on(table.groupId, table.locale),
        uniqueIndex('articles_slug_locale_idx').on(table.slug, table.locale),
        index('articles_created_at_idx').on(table.createdAt)
    ]
)

export const agendaEvents = pgTable(
    'agenda_events',
    {
        id: serial('id').primaryKey(),
        groupId: uuid('group_id').notNull().defaultRandom(),
        locale: varchar('locale', { length: 5 }).notNull(),
        title: text('title').notNull(),
        date: varchar('date', { length: 50 }).notNull(),
        time: varchar('time', { length: 50 }).notNull(),
        startDatetime: timestamp('start_datetime', { withTimezone: true }).notNull(),
        endDatetime: timestamp('end_datetime', { withTimezone: true }),
        location: text('location'),
        description: text('description'),
        image: text('image'),
        published: boolean('published').notNull().default(true),
        isRecurring: boolean('is_recurring').notNull().default(false),
        recurrencePattern: varchar('recurrence_pattern', { length: 20 }),
        recurrenceEndDate: date('recurrence_end_date'),
        parentEventId: integer('parent_event_id').references((): AnyPgColumn => agendaEvents.id, { onDelete: 'cascade' }),
        version: integer('version').notNull().default(1),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    (table) => [
        uniqueIndex('events_group_locale_start_idx').on(table.groupId, table.locale, table.startDatetime),
        index('events_start_datetime_idx').on(table.startDatetime),
        index('events_parent_event_id_idx').on(table.parentEventId)
    ]
)
