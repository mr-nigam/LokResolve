import '@foodmesh/utils/config/env';
import app from './app.js';


import{
    bootstrapDB
} from '@lokresolve/utils';

import {
    connectDB,
    closeDB
} from './config/postgre.js';



const startServer = async()=>{

    await bootstrapDB({
        connectDB,
        closeDB
    });

    const PORT = process.env.PORT || 4001;
    
    app.listen(PORT,()=>{
        console.log(`🚀 Auth Server running on port: ${PORT}`);
    });
};


startServer();