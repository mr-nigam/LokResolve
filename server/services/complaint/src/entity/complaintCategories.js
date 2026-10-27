import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintCategoriesTable = async() => {
    try{
        
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_categories (
                id UUID PRIMARY KEY 
                    DEFAULT gen_random_uuid(),

                name VARCHAR(100) NOT NULL,

                code VARCHAR(50) NOT NULL UNIQUE,

                description TEXT,

                parent_category_id UUID
                    REFERENCES complaint_categories(id)
                    ON DELETE RESTRICT,

                default_priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
                    CHECK (default_priority IN (
                        'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
                    )),

                default_sla_policy_id UUID
                    REFERENCES sla_policies(id)
                    ON DELETE SET NULL,

                is_active BOOLEAN NOT NULL DEFAULT TRUE,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                UNIQUE (parent_category_id, name)
            );
        `);
        
        await createUpdatedAtTrigger(pool, 'complaint_categories');

        console.log("Complaint Categories table and indexes created successfully");

    }catch(err){

        console.error("Complaint Categories Table creation failed", err);
    
    }
};


export default createComplaintCategoriesTable;