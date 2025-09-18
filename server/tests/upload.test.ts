import request from 'supertest';
import express from 'express';
import uploadRouter from '../src/routes/upload';
import path from 'path';
import fs from 'fs';

describe('POST /api/upload/resume', () => {
  const app = express();
  app.use('/api/upload', uploadRouter);

  it('should return 400 if no file uploaded', async () => {
    const res = await request(app)
      .post('/api/upload/resume');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Add more tests for valid PDF/DOCX uploads as needed
});
