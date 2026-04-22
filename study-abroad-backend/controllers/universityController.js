const crypto = require('crypto');
const University = require('../models/University');
const Program = require('../models/Program');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getCache, setCache, deleteCacheByPattern } = require('../services/cacheService');

function hashQuery(query) {
  return crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
}

function tuitionFilter(minTuition, maxTuition) {
  const filter = {};
  if (minTuition !== undefined) filter.$gte = Number(minTuition);
  if (maxTuition !== undefined) filter.$lte = Number(maxTuition);
  return filter;
}

async function getUniversities(req, res, next) {
  try {
    const { country, field, intake, minTuition, maxTuition, sort, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;
    const cacheKey = `universities:${hashQuery(req.query)}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return successResponse(res, 200, 'Universities retrieved', cached.data, cached.pagination);
    }

    const filter = {};
    if (country) filter.country = new RegExp(country, 'i');

    const idSets = [];
    if (field || intake) {
      const programFilter = {};
      if (field) programFilter.fieldOfStudy = new RegExp(field, 'i');
      if (intake) programFilter.intakeMonths = intake;
      const uniIds = await Program.distinct('university', programFilter);
      idSets.push(uniIds.map(String));
    }

    if (minTuition !== undefined || maxTuition !== undefined) {
      const programs = await Program.find({ tuition: tuitionFilter(minTuition, maxTuition) }).select('university').lean();
      idSets.push(programs.map((program) => program.university.toString()));
    }

    if (idSets.length) {
      const intersection = idSets.reduce((acc, ids) => acc.filter((id) => ids.includes(id)));
      filter._id = { $in: intersection };
    }

    const sortObj = sort === 'ranking_desc' ? { ranking: -1 } : { ranking: 1 };
    const [universities, total] = await Promise.all([
      University.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      University.countDocuments(filter),
    ]);

    const result = {
      data: universities,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    };

    await setCache(cacheKey, result, 300);
    return successResponse(res, 200, 'Universities retrieved', result.data, result.pagination);
  } catch (err) {
    return next(err);
  }
}

async function getUniversityById(req, res, next) {
  try {
    const key = `university:${req.params.id}`;
    const cached = await getCache(key);
    if (cached) return successResponse(res, 200, 'University retrieved', cached);

    const university = await University.findById(req.params.id).lean();
    if (!university) return errorResponse(res, 404, 'University not found');

    const programs = await Program.find({ university: req.params.id }).lean();
    const result = { ...university, programs };

    await setCache(key, result, 900);
    return successResponse(res, 200, 'University retrieved', result);
  } catch (err) {
    return next(err);
  }
}

async function getPrograms(req, res, next) {
  try {
    const { universityId, field, degree, minTuition, maxTuition, ieltsMax, intake, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;
    const cacheKey = `programs:${hashQuery(req.query)}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return successResponse(res, 200, 'Programs retrieved', cached.data, cached.pagination);
    }

    const filter = {};
    if (universityId) filter.university = universityId;
    if (field) filter.fieldOfStudy = new RegExp(field, 'i');
    if (degree) filter.degree = degree;
    if (intake) filter.intakeMonths = intake;
    if (minTuition !== undefined || maxTuition !== undefined) filter.tuition = tuitionFilter(minTuition, maxTuition);
    if (ieltsMax) filter.ieltsMin = { $lte: parseFloat(ieltsMax) };

    const [programs, total] = await Promise.all([
      Program.find(filter)
        .populate('university', 'name country city ranking')
        .sort({ tuition: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Program.countDocuments(filter),
    ]);

    const result = {
      data: programs,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    };

    await setCache(cacheKey, result, 300);
    return successResponse(res, 200, 'Programs retrieved', result.data, result.pagination);
  } catch (err) {
    return next(err);
  }
}

async function createUniversity(req, res, next) {
  try {
    const { name, country, city, applicationDeadline, ranking, description } = req.body;
    if (!name || !country || !city) {
      return errorResponse(res, 400, 'University name, country, and city are required');
    }
    const university = await University.create({
      name,
      country,
      city,
      applicationDeadline,
      ranking,
      description
    });
    
    // Invalidate universities cache to ensure new data is immediately available
    await deleteCacheByPattern('universities:*');
    
    return successResponse(res, 201, 'University created successfully', university);
  } catch (err) {
    return next(err);
  }
}

async function createProgram(req, res, next) {
  try {
    const { id } = req.params; // universityId
    const { name, fieldOfStudy, degree, duration, tuition, currency, intakeMonths, ieltsMin } = req.body;
    
    if (!name || !fieldOfStudy || !degree || tuition === undefined) {
      return errorResponse(res, 400, 'Name, field of study, degree, and tuition are required fields.');
    }
    
    const university = await University.findById(id);
    if (!university) return errorResponse(res, 404, 'Target university could not be located.');

    const newProgram = await Program.create({
      university: id,
      name,
      fieldOfStudy,
      degree,
      duration,
      tuition,
      currency,
      intakeMonths: intakeMonths || [],
      ieltsMin
    });

    await deleteCacheByPattern('programs:*');
    await deleteCacheByPattern(`university:${id}`);
    
    return successResponse(res, 201, 'Academic Program deployed successfully', newProgram);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getUniversities, getUniversityById, getPrograms, createUniversity, createProgram };
