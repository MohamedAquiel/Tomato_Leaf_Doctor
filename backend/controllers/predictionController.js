const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const Prediction = require('../models/Prediction');
const { ROLES, PAGINATION } = require('../config/constants');
const predict = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Please upload an image file',
    });
  }

  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  const filePath = req.file.path;

  let mlResult;
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${mlServiceUrl}/predict`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    mlResult = response.data;
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const mlError =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message ||
      'ML service unavailable';

    const isConnectionError = err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND';
    return res.status(503).json({
      success: false,
      error: isConnectionError
        ? 'The AI prediction service is currently offline. Please try again later.'
        : `Prediction service error: ${mlError}`,
    });
  }

  const imageUrl = '/uploads/' + req.file.filename;
  const isGuest = !req.user;

  const prediction = await Prediction.create({
    user: req.user ? req.user._id : null,
    imageUrl,
    diseaseKey: mlResult.disease_key,
    displayName: mlResult.display_name,
    confidence: mlResult.confidence,
    isHealthy: mlResult.is_healthy,
    solution: mlResult.solution || null,
    topPredictions: mlResult.top_predictions || [],
    isGuest,
    notes: '',
  });

  res.status(201).json({
    success: true,
    data: prediction,
  });
};
const getMyPredictions = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  const [predictions, total] = await Promise.all([
    Prediction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Prediction.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: predictions.length,
    total,
    page,
    pages,
    data: predictions,
  });
};
const getPrediction = async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    return res.status(404).json({
      success: false,
      error: 'Prediction not found',
    });
  }

  const isOwner = prediction.user && prediction.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this prediction',
    });
  }

  res.status(200).json({
    success: true,
    data: prediction,
  });
};
const deletePrediction = async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    return res.status(404).json({
      success: false,
      error: 'Prediction not found',
    });
  }

  const isOwner = prediction.user && prediction.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this prediction',
    });
  }
  if (prediction.imageUrl) {
    const filename = path.basename(prediction.imageUrl);
    const uploadDir = process.env.UPLOAD_PATH || 'uploads/';
    const filePath = path.isAbsolute(uploadDir)
      ? path.join(uploadDir, filename)
      : path.join(__dirname, '..', uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prediction.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
};
const getAllPredictions = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const [predictions, total] = await Promise.all([
    Prediction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Prediction.countDocuments(),
  ]);

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: predictions.length,
    total,
    page,
    pages,
    data: predictions,
  });
};
const updateNotes = async (req, res) => {
  const { notes } = req.body;

  if (notes === undefined || notes === null) {
    return res.status(400).json({
      success: false,
      error: 'Notes field is required',
    });
  }

  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    return res.status(404).json({
      success: false,
      error: 'Prediction not found',
    });
  }

  const isOwner = prediction.user && prediction.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this prediction',
    });
  }

  prediction.notes = notes;
  await prediction.save();

  res.status(200).json({
    success: true,
    data: prediction,
  });
};

module.exports = {
  predict,
  getMyPredictions,
  getPrediction,
  deletePrediction,
  getAllPredictions,
  updateNotes,
};
