import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintOutboxTable = async() => {
    try{
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_outbox (
                id UUID PRIMARY KEY 
                    DEFAULT gen_random_uuid(),

                aggregate_id UUID NOT NULL,

                event_type VARCHAR(100) NOT NULL,

                payload JSONB NOT NULL,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                published_at TIMESTAMPTZ,

                retry_count INTEGER NOT NULL DEFAULT 0
                    CHECK (retry_count >= 0),

                next_retry_at TIMESTAMPTZ,

                last_error TEXT
            );
        `);

        await createUpdatedAtTrigger(pool, 'complaint_outbox');

        console.log("Complaint Outbox table and indexes created successfully");

    }catch(err){

        console.error("Complaint Outbox Table creation failed", err);
    
    }
};


export default createComplaintOutboxTable;