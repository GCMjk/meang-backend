import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';

import environments from './config/environments';

// setting environment variables (read)
if(process.env.NODE_ENV !== 'production'){
    const env = environments;
    console.log(env);
}

async function init() {

    const app = express();

    app.use(cors());
    app.use(compression());

    app.get('/', (_, res) => {
        res.send('API');
    });

    const httpServer = createServer(app);
    const PORT = process.env.PORT || 3000;

    httpServer.listen(
        {
            port: PORT
        },
        () => console.log(`http://localhost:${PORT} API`)
    );
}

init();