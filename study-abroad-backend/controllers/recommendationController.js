const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getCache, setCache } = require('../services/cacheService');
const { buildRecommendations } = require('../services/recommendationService');

async function getRecommendations(req, res, next) {
  try {
    const preferences = {
      country: req.body.country || req.user?.preferences?.country,
      budget: req.body.budget || req.user?.preferences?.budget,
      fieldOfStudy: req.body.fieldOfStudy || req.user?.preferences?.fieldOfStudy,
      intakeMonth: req.body.intakeMonth || req.user?.preferences?.intakeMonth,
      ieltsScore: req.body.ieltsScore || req.user?.preferences?.ieltsScore,
    };

    if (Object.values(preferences).every((value) => !value)) {
      return errorResponse(res, 400, 'Provide at least one preference to get recommendations');
    }

    if (req.user) {
      const cacheKey = `rec:${req.user._id}`;
      const cached = await getCache(cacheKey);
      if (cached) {
        return successResponse(res, 200, 'Recommendations retrieved', cached);
      }
    }

    const results = await buildRecommendations(preferences);

    if (req.user) {
      await setCache(`rec:${req.user._id}`, results, 600);
    }

    return successResponse(res, 200, 'Recommendations retrieved', results);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getRecommendations };
