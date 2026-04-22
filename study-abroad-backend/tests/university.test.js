const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const University = require('../models/University');
const Program = require('../models/Program');

async function seedUniversities() {
  const [oxford, toronto, melbourne] = await University.create([
    { name: 'Oxford University', country: 'UK', city: 'Oxford', ranking: 1, website: 'https://ox.ac.uk' },
    { name: 'University of Toronto', country: 'Canada', city: 'Toronto', ranking: 2, website: 'https://utoronto.ca' },
    { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', ranking: 3, website: 'https://unimelb.edu.au' },
  ]);

  await Program.create([
    { university: oxford._id, name: 'MSc Computer Science', fieldOfStudy: 'Computer Science', degree: 'Masters', duration: 12, tuition: 30000, intakeMonths: ['September'], ieltsMin: 7 },
    { university: oxford._id, name: 'BA Economics', fieldOfStudy: 'Economics', degree: 'Bachelors', duration: 36, tuition: 28000, intakeMonths: ['October'], ieltsMin: 7 },
    { university: toronto._id, name: 'MEng Computer Engineering', fieldOfStudy: 'Computer Engineering', degree: 'Masters', duration: 24, tuition: 22000, intakeMonths: ['January', 'September'], ieltsMin: 6.5 },
    { university: toronto._id, name: 'Diploma Business', fieldOfStudy: 'Business', degree: 'Diploma', duration: 12, tuition: 14000, intakeMonths: ['May'], ieltsMin: 6 },
    { university: melbourne._id, name: 'PhD Data Science', fieldOfStudy: 'Data Science', degree: 'PhD', duration: 48, tuition: 25000, intakeMonths: ['February'], ieltsMin: 7 },
  ]);

  return { oxford, toronto, melbourne };
}

describe('University Discovery', () => {
  test('GET /api/universities -> 200 + array + pagination object present', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(3);
  });

  test('GET /api/universities?country=UK -> only UK universities returned', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities?country=UK');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].country).toBe('UK');
  });

  test('GET /api/universities?page=1&limit=2 -> max 2 results, correct totalPages', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  test('GET /api/universities/:id -> 200 with programs array populated', async () => {
    const { oxford } = await seedUniversities();
    const res = await request(app).get(`/api/universities/${oxford._id}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.programs)).toBe(true);
    expect(res.body.data.programs.length).toBe(2);
  });

  test('GET /api/universities/:id (bad id) -> 400', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities/bad-id');

    expect(res.status).toBe(400);
  });

  test('GET /api/universities/:id (nonexistent) -> 404', async () => {
    await seedUniversities();
    const res = await request(app).get(`/api/universities/${new mongoose.Types.ObjectId()}`);

    expect(res.status).toBe(404);
  });

  test('GET /api/universities/programs/all -> 200 + programs list', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities/programs/all');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(5);
  });

  test('GET /api/universities/programs/all?field=Computer -> filters by field', async () => {
    await seedUniversities();
    const res = await request(app).get('/api/universities/programs/all?field=Computer');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((program) => program.fieldOfStudy.includes('Computer'))).toBe(true);
  });
});
