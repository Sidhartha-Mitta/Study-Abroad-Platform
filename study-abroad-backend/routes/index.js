const authRoutes = require('./authRoutes');
const universityRoutes = require('./universityRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const applicationRoutes = require('./applicationRoutes');

function mountRoutes(app) {
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/universities', universityRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/applications', applicationRoutes);
}

module.exports = mountRoutes;
