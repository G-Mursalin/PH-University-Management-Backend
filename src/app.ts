import express, { Application } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.route';
const app: Application = express();

// Parser
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/students', studentRoutes);

export default app;
