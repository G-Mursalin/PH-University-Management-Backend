/* eslint-disable no-console */
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';
import seedSuerAdmin from './app/DB/inex';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log('Database is connected');
        seedSuerAdmin();
        server = app.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main();

// Handle Unhandled rejections
process.on('unhandledRejection', () => {
    console.log('🧨Unhandled rejection is detected. Shutting Down...');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Handle Uncaught exceptions
process.on('uncaughtException', () => {
    console.log('🧨Uncaught exception is detected. Shutting Down...');
    process.exit(1);
});
