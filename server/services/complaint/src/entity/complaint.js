
import pool from '../config/postgre.js';

import {
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintTables = async () => {
    try {
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaints (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                complaint_number VARCHAR(30) NOT NULL UNIQUE,

                customer_id UUID NOT NULL,

                category_id UUID NOT NULL
                    REFERENCES complaint_categories(id)
                    ON DELETE RESTRICT,

                subject VARCHAR(200) NOT NULL,

                description TEXT NOT NULL,

                priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
                    CHECK (priority IN (
                        'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
                    )),

                status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED'
                    CHECK (status IN (
                        'SUBMITTED',
                        'TRIAGED',
                        'ASSIGNED',
                        'IN_PROGRESS',
                        'RESOLVED',
                        'CLOSED',
                        'REOPENED',
                        'ESCALATED',
                        'REJECTED',
                        'CANCELLED'
                    )),

                source VARCHAR(20) NOT NULL DEFAULT 'WEB'
                    CHECK (source IN (
                        'WEB', 'MOBILE', 'EMAIL', 'PHONE', 'IN_PERSON'
                    )),

                assigned_team_id UUID,
                assigned_agent_id UUID,

                resolution_summary TEXT,

                resolved_at TIMESTAMPTZ,
                closed_at TIMESTAMPTZ,

                deleted_at TIMESTAMPTZ,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CHECK (
                    status <> 'RESOLVED'
                    OR resolved_at IS NOT NULL
                ),

                CHECK (
                    status <> 'CLOSED'
                    OR closed_at IS NOT NULL
                )
            );
        `);

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
        `);

        await createUpdatedAtTrigger(pool, 'complaints');


        console.log(
            'Complaint table, indexes and triggers created successfully'
        );

    }catch(err){
        console.error('Complaint table creation failed:', err);
        throw err;
    }
};


export default createComplaintTables;