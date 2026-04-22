const request = require('supertest');
const app = require('../server');
const University = require('../models/University');
const Program = require('../models/Program');
const Application = require('../models/Application');

async function register(email) {
  const res = await request(app).post('/api/auth/register').send({
    name: email.split('@')[0],
    email,
    password: 'password123',
  });
  return res.body.data.token;
}

async function createProgram() {
  const university = await University.create({
    name: 'Test University',
    country: 'UK',
    city: 'London',
    ranking: 10,
  });
  const program = await Program.create({
    university: university._id,
    name: 'MSc Artificial Intelligence',
    fieldOfStudy: 'Computer Science',
    degree: 'Masters',
    duration: 12,
    tuition: 20000,
    intakeMonths: ['September'],
    ieltsMin: 6.5,
  });
  return { university, program };
}

async function setupApplication() {
  const userAToken = await register('a@example.com');
  const userBToken = await register('b@example.com');
  
  process.env.ADMIN_SECRET = 'test_admin_secret';
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin_app@example.com',
    password: 'password123',
    adminSecret: 'test_admin_secret'
  });
  const adminToken = adminRes.body.data.token;

  const { program } = await createProgram();
  const applyRes = await request(app)
    .post('/api/applications')
    .set('Authorization', `Bearer ${userAToken}`)
    .send({ programId: program._id.toString() });

  return { userAToken, userBToken, adminToken, program, application: applyRes.body.data };
}

describe('Applications', () => {
  test('POST /api/applications (authenticated) -> 201 + application object', async () => {
    const token = await register('a@example.com');
    const { program } = await createProgram();
    const res = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({ programId: program._id.toString() });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('Applied');
    expect(res.body.data.program.name).toBe('MSc Artificial Intelligence');
  });

  test('POST /api/applications (unauthenticated) -> 401', async () => {
    const { program } = await createProgram();
    const res = await request(app).post('/api/applications').send({ programId: program._id.toString() });

    expect(res.status).toBe(401);
  });

  test('POST /api/applications duplicate -> 409', async () => {
    const token = await register('a@example.com');
    const { program } = await createProgram();
    await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({ programId: program._id.toString() });
    const res = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({ programId: program._id.toString() });

    expect(res.status).toBe(409);
  });

  test("GET /api/applications -> returns only current user's applications", async () => {
    const userAToken = await register('a@example.com');
    const userBToken = await register('b@example.com');
    const { program } = await createProgram();
    await request(app).post('/api/applications').set('Authorization', `Bearer ${userAToken}`).send({ programId: program._id.toString() });

    const resA = await request(app).get('/api/applications').set('Authorization', `Bearer ${userAToken}`);
    const resB = await request(app).get('/api/applications').set('Authorization', `Bearer ${userBToken}`);

    expect(resA.status).toBe(200);
    expect(resA.body.data).toHaveLength(1);
    expect(resB.status).toBe(200);
    expect(resB.body.data).toHaveLength(0);
  });

  test('GET /api/applications/:id (owner) -> 200', async () => {
    const { userAToken, application } = await setupApplication();
    const res = await request(app).get(`/api/applications/${application._id}`).set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(application._id);
  });

  test('GET /api/applications/:id (non-owner) -> 403', async () => {
    const { userBToken, application } = await setupApplication();
    const res = await request(app).get(`/api/applications/${application._id}`).set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
  });

  test('PATCH /:id/status Applied->Reviewed -> 200, status updated', async () => {
    const { adminToken, application } = await setupApplication();
    const res = await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Reviewed', note: 'Under review' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Reviewed');
  });

  test('PATCH /:id/status Applied->Accepted -> 400 invalid transition', async () => {
    const { adminToken, application } = await setupApplication();
    const res = await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Accepted' });

    expect(res.status).toBe(400);
  });

  test('PATCH /:id/status Reviewed->Accepted -> 200', async () => {
    const { adminToken, application } = await setupApplication();
    await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Reviewed' });
    const res = await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Accepted' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Accepted');
  });

  test('PATCH /:id/status Accepted->Withdrawn -> 400 (no transitions from Accepted)', async () => {
    const { adminToken, application } = await setupApplication();
    await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Reviewed' });
    await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Accepted' });
    const res = await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Withdrawn' });

    expect(res.status).toBe(400);
  });

  test('PATCH /:id/status by non-owner -> 403', async () => {
    const { userBToken, application } = await setupApplication();
    const res = await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ status: 'Reviewed' });

    expect(res.status).toBe(403);
  });

  test('GET /:id/history -> entries in chronological order, fromStatus null on first entry', async () => {
    const { adminToken, application } = await setupApplication();
    await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Reviewed' });
    await request(app)
      .patch(`/api/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Accepted' });

    const res = await request(app).get(`/api/applications/${application._id}/history`).set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].fromStatus).toBeNull();
    expect(res.body.data.map((entry) => entry.toStatus)).toEqual(['Applied', 'Reviewed', 'Accepted']);
  });
});
