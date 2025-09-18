import request from 'supertest';
import express from 'express';
import analyzeRouter from '../src/routes/analyze';

describe('POST /api/ai-analyze', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/ai-analyze', analyzeRouter);

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/ai-analyze')
      .send({ resumeText: '', jdText: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
