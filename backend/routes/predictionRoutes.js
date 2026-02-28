'use strict';

const express = require('express');
const router = express.Router();

const {
  predict,
  getMyPredictions,
  getPrediction,
  deletePrediction,
  getAllPredictions,
  updateNotes,
} = require('../controllers/predictionController');

const { protect, authorize, optionalProtect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { ROLES } = require('../config/constants');
router.post('/', uploadSingle, optionalProtect, predict);
router.get('/my', protect, getMyPredictions);
router.get('/', protect, authorize(ROLES.ADMIN), getAllPredictions);
router.get('/:id', protect, getPrediction);
router.delete('/:id', protect, deletePrediction);
router.put('/:id/notes', protect, updateNotes);

module.exports = router;
