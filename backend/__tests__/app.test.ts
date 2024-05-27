import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpar a tabela energyData antes de iniciar os testes
  await prisma.energyData.deleteMany();
});

afterAll(async () => {
  // Fechar a conexão com o Prisma após os testes
  await prisma.$disconnect();
});

describe('POST /upload', () => {
  it('should upload a file and save data to the database', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', path.join(__dirname, 'test.pdf'));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('pathFile');
    
  });

  it('should return an error if file upload fails', async () => {
    const res = await request(app).post('/upload');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
  });
});

describe('GET /bills', () => {
  it('should return bills ordered by date', async () => {
    const res = await request(app).get('/bills?q=someClient');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

describe('GET /download/:path', () => {

  it('should return an error if file does not exist', async () => {
    const res = await request(app).get('/download/nonexistent.pdf');

    expect(res.status).toBe(404);
  });
});
