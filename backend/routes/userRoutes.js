'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getDashboardStats,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, authorize(ROLES.ADMIN), getDashboardStats);
router.get('/', protect, authorize(ROLES.ADMIN), getAllUsers);
router.get('/:id', protect, authorize(ROLES.ADMIN), getUser);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateUser);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteUser);

module.exports = router;
