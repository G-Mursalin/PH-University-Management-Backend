import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandlers';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// Parser
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
