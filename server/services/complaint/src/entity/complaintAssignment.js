import pool from 
'../config/postgre.js';

import { 
    createUpdatedAtTrigger
} from '@lokresolve/utils';


const createComplaintAssignmentsTable = async() => {
    try{

        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaint_assignments (
                id UUID PRIMARY KEY 
                    DEFAULT gen_random_uuid(),

                complaint_id UUID NOT NULL
                    REFERENCES complaints(id)
                    ON DELETE RESTRICT,

                assigned_to UUID,

                assigned_team_id UUID,

                assignment_reason TEXT,

                assigned_at TIMESTAMPTZ NOT 
                    NULL DEFAULT CURRENT_TIMESTAMP,

                unassigned_at TIMESTAMPTZ,

                is_current BOOLEAN NOT NULL DEFAULT TRUE,

                CHECK (
                    unassigned_at IS NULL
                    OR unassigned_at >= assigned_at
                )
            );
        `);
        
        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS
                uq_complaint_current_assignment
            ON complaint_assignments(complaint_id)
            WHERE is_current = TRUE;
        `);

        await pool.query(`
            
        `);

        await createUpdatedAtTrigger(pool, 'complaint_assignments');

        console.log("Complaint Assignments table and indexes created successfully");

    }catch(err){

        console.error("Complaint Assignments Table creation failed", err);
    
    }
};


export default createComplaintAssignmentsTable;