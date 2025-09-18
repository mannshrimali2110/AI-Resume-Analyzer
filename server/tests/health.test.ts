import request from 'supertest';
import express from 'express';
import healthRouter from '../src/routes/health';

describe('GET /api/health', () => {
  const app = express();
  app.use('/api/health', healthRouter);

  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});
