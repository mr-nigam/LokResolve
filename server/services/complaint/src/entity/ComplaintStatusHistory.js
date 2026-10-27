import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintStatusHistoryTable = async() => {
    try{
        
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_status_history (
                id UUID PRIMARY KEY 
                    DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                previous_status VARCHAR(30),

                new_status VARCHAR(30) NOT NULL,

                changed_by UUID,

                change_reason TEXT,

                metadata JSONB NOT NULL DEFAULT '{}'::JSONB,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CHECK (
                    previous_status IS NULL
                    OR previous_status IN (
                        'SUBMITTED', 'TRIAGED', 'ASSIGNED',
                        'IN_PROGRESS', 'RESOLVED', 'CLOSED',
                        'REOPENED', 'ESCALATED', 'REJECTED',
                        'CANCELLED'
                    )
                ),

                CHECK (new_status IN (
                    'SUBMITTED', 'TRIAGED', 'ASSIGNED',
                    'IN_PROGRESS', 'RESOLVED', 'CLOSED',
                    'REOPENED', 'ESCALATED', 'REJECTED',
                    'CANCELLED'
                ))
            );
        `);

        await createUpdatedAtTrigger(pool, 'complaint_status_history');

        console.log("Complaint Status History table and indexes created successfully");

    }catch(err){

        console.error("Complaint Status History Table creation failed", err);
    
    }
};


export default createComplaintStatusHistoryTable;