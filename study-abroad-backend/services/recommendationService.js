const Program = require('../models/Program');

async function buildRecommendations(preferences) {
  const { country, budget, fieldOfStudy, intakeMonth, ieltsScore } = preferences;
  const numericBudget = budget ? parseFloat(budget) : 0;
  const numericIelts = ieltsScore ? parseFloat(ieltsScore) : 0;
  const matchStage = {};

  if (numericIelts) matchStage.ieltsMin = { $lte: numericIelts };
  if (numericBudget) matchStage.tuition = { $lte: numericBudget };

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'universities',
        localField: 'university',
        foreignField: '_id',
        as: 'universityData',
      },
    },
    { $unwind: '$universityData' },
    ...(country ? [{ $match: { 'universityData.country': new RegExp(country, 'i') } }] : []),
    {
      $addFields: {
        relevanceScore: {
          $add: [
            fieldOfStudy ? { $cond: [{ $regexMatch: { input: '$fieldOfStudy', regex: fieldOfStudy, options: 'i' } }, 3, 0] } : 0,
            intakeMonth ? { $cond: [{ $in: [intakeMonth, '$intakeMonths'] }, 2, 0] } : 0,
            numericBudget ? { $cond: [{ $lte: ['$tuition', numericBudget * 0.8] }, 2, 0] } : 0,
            country ? { $cond: [{ $regexMatch: { input: '$universityData.country', regex: country, options: 'i' } }, 1, 0] } : 0,
          ],
        },
      },
    },
    { $sort: { relevanceScore: -1, 'universityData.ranking': 1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        name: 1,
        fieldOfStudy: 1,
        degree: 1,
        tuition: 1,
        currency: 1,
        intakeMonths: 1,
        ieltsMin: 1,
        duration: 1,
        relevanceScore: 1,
        university: {
          _id: '$universityData._id',
          name: '$universityData.name',
          country: '$universityData.country',
          city: '$universityData.city',
          ranking: '$universityData.ranking',
          website: '$universityData.website',
        },
      },
    },
  ];

  return Program.aggregate(pipeline);
}

module.exports = { buildRecommendations };
