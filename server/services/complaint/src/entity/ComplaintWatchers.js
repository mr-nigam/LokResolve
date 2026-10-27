import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintWatcherTable = async() => {
    try{
        
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_watchers (
                complaint_id UUID NOT NULL
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                user_id UUID NOT NULL,

                created_at TIMESTAMPTZ NOT NULL 
                    DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (complaint_id, user_id)
            );
        `);
        
        await createUpdatedAtTrigger(pool, 'complaint_watchers');

        console.log("Complaint Watchers table and indexes created successfully");

    }catch(err){

        console.error("Complaint Watchers Table creation failed", err);
    }
};


export default createComplaintWatcherTable;