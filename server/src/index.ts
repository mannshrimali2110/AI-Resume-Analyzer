import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errors.middleware';
import healthRouter from './routes/health';
import uploadRouter from './routes/upload';
import analyzeRouter from './routes/analyze';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/health', healthRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/ai-analyze', analyzeRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
