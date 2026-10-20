import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createUsersTable = async() => {
    try{
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS citext;
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id UUID PRIMARY KEY
                    DEFAULT gen_random_uuid(),

                college_id VARCHAR(16) 
                    UNIQUE NOT NULL, 
                
                name VARCHAR(50) NOT NULL,

                email CITEXT UNIQUE NOT NULL
                    CHECK (
                        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
                    ),

                -- E.164 Format
                phone VARCHAR(15) UNIQUE
                    CHECK (
                        phone ~ '^\\+[1-9][0-9]{6,14}$'
                    ),
                
                profile_picture_url TEXT,

                password TEXT,
                password_changed_at TIMESTAMPTZ,
                refresh_token TEXT,
                
                deleted_at TIMESTAMPTZ,
                deactivated_at TIMESTAMPTZ,
                
                created_at TIMESTAMPTZ 
                    DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ 
                    DEFAULT CURRENT_TIMESTAMP
            );    
        `);

        // await pool.query(`
        //     CREATE INDEX IF NOT EXISTS idx_users_college_id
        //     ON users(college_id)
        // `);
        
        await createUpdatedAtTrigger(pool, 'users');

        console.log("User table and indexes created successfully");

    }catch(err){

        console.error(" Used Table creation failed", err);
    
    }
};


export default createUsersTable;