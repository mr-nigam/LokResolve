
import pool from '../config/postgre.js';

import {
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintTables = async () => {
    try {
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);


        // 6. Complaint Comments
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_comments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                author_id UUID NOT NULL,

                author_role VARCHAR(30) NOT NULL
                    CHECK (author_role IN (
                        'CUSTOMER', 'AGENT', 'ADMIN', 'SYSTEM'
                    )),

                body TEXT NOT NULL
                    CHECK (LENGTH(TRIM(body)) > 0),

                visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
                    CHECK (visibility IN ('PUBLIC', 'INTERNAL')),

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMPTZ
            );
        `);


        // 8. Complaint SLA Tracking
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_sla_tracking (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL UNIQUE
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                sla_policy_id UUID NOT NULL
                    REFERENCES sla_policies(id)
                    ON DELETE RESTRICT,

                first_response_due_at TIMESTAMPTZ NOT NULL,

                first_responded_at TIMESTAMPTZ,

                resolution_due_at TIMESTAMPTZ NOT NULL,

                breached_at TIMESTAMPTZ,

                is_response_breached BOOLEAN NOT NULL DEFAULT FALSE,

                is_resolution_breached BOOLEAN NOT NULL DEFAULT FALSE,

                last_evaluated_at TIMESTAMPTZ,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);


        // 11. Complaint Feedback
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_feedback (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL UNIQUE
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                customer_id UUID NOT NULL,

                rating SMALLINT NOT NULL
                    CHECK (rating BETWEEN 1 AND 5),

                feedback TEXT,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);


        // Indexes for common query patterns.
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_complaints_customer_created
                ON complaints(customer_id, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_complaints_status_priority
                ON complaints(status, priority, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_complaints_assignee_status
                ON complaints(assigned_agent_id, status, updated_at DESC);

            CREATE INDEX IF NOT EXISTS idx_complaints_team_status
                ON complaints(assigned_team_id, status, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_complaints_category
                ON complaints(category_id, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_complaints_active
                ON complaints(created_at DESC)
                WHERE deleted_at IS NULL;

            CREATE INDEX IF NOT EXISTS idx_status_history_complaint
                ON complaint_status_history(complaint_id, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_comments_complaint
                ON complaint_comments(complaint_id, created_at DESC);

            CREATE INDEX IF NOT EXISTS idx_escalations_complaint
                ON complaint_escalations(complaint_id, triggered_at DESC);

            CREATE INDEX IF NOT EXISTS idx_outbox_pending
                ON complaint_outbox(created_at)
                WHERE published_at IS NULL;
        `);


        // Automatically update updated_at on row updates.
        const tablesWithUpdatedAt = [
            'sla_policies',
            'complaint_categories',
            'complaints',
            'complaint_comments',
            'complaint_sla_tracking',
            'complaint_feedback'
        ];

        for (const table of tablesWithUpdatedAt) {
            await createUpdatedAtTrigger(pool, table);
        }


        console.log(
            'Complaint table, indexes and triggers created successfully'
        );

    } catch (err) {
        console.error('Complaint table creation failed:', err);
        throw err;
    }
};


export default createComplaintTables;