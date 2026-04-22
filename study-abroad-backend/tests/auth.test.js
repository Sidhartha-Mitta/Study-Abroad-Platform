const request = require('supertest');
const app = require('../server');

async function registerUser(overrides = {}) {
  const payload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...overrides,
  };

  return request(app).post('/api/auth/register').send(payload);
}

describe('Auth - Register', () => {
  test('POST /api/auth/register with valid data -> 201 + token in response', async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  test('POST /api/auth/register duplicate email -> 409', async () => {
    await registerUser();
    const res = await registerUser();

    expect(res.status).toBe(409);
  });

  test('POST /api/auth/register missing name -> 400 with errors array', async () => {
    const res = await registerUser({ name: '' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  test('POST /api/auth/register password < 8 chars -> 400', async () => {
    const res = await registerUser({ password: 'short' });

    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register invalid email -> 400', async () => {
    const res = await registerUser({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

describe('Auth - Login', () => {
  test('POST /api/auth/login valid credentials -> 200 + token', async () => {
    await registerUser();
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login wrong password -> 401', async () => {
    await registerUser();
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login non-existent email -> 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'missing@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('Auth - Protected routes', () => {
  test('GET /api/auth/profile with valid token -> 200 + user object', async () => {
    const registerRes = await registerUser();
    const token = registerRes.body.data.token;
    const res = await request(app).get('/api/auth/profile').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  test('GET /api/auth/profile without token -> 401', async () => {
    const res = await request(app).get('/api/auth/profile');

    expect(res.status).toBe(401);
  });

  test('GET /api/auth/profile with malformed token -> 401', async () => {
    const res = await request(app).get('/api/auth/profile').set('Authorization', 'Bearer malformed.token');

    expect(res.status).toBe(401);
  });

  test('PATCH /api/auth/preferences with valid token -> 200 + updated preferences', async () => {
    const registerRes = await registerUser();
    const token = registerRes.body.data.token;
    const res = await request(app)
      .patch('/api/auth/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ country: 'UK', budget: 25000, fieldOfStudy: 'Computer Science', intakeMonth: 'September', ieltsScore: 7.5 });

    expect(res.status).toBe(200);
    expect(res.body.data.preferences.country).toBe('UK');
    expect(res.body.data.preferences.budget).toBe(25000);
  });
});
