import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintEscalationsTable = async() => {
    try{
        
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_escalations (
                id UUID PRIMARY KEY 
                    DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                from_level INTEGER NOT NULL DEFAULT 0
                    CHECK (from_level >= 0),

                to_level INTEGER NOT NULL
                    CHECK (to_level > from_level),

                reason TEXT NOT NULL,

                triggered_by UUID,

                triggered_at TIMESTAMPTZ NOT NULL 
                    DEFAULT CURRENT_TIMESTAMP,

                resolved_at TIMESTAMPTZ,

                resolved_by UUID,

                resolution_notes TEXT,

                CHECK (
                    resolved_at IS NULL
                    OR resolved_at >= triggered_at
                )
            );
        `);
        
        await createUpdatedAtTrigger(pool, 'complaint_escalations');

        console.log("Complaint Escalations table and indexes created successfully");

    }catch(err){

        console.error("Complaint Escalations Table creation failed", err);
    }
};


export default createComplaintEscalationsTable;