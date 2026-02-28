const User = require('../models/User');
const Prediction = require('../models/Prediction');
const { PAGINATION } = require('../config/constants');
const getAllUsers = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search && req.query.search.trim()) {
    const searchRegex = new RegExp(req.query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages,
    data: users,
  });
};
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};
const updateUser = async (req, res) => {
  const allowedFields = ['name', 'role', 'isActive'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }
  await Prediction.deleteMany({ user: user._id });

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
};
const getProfile = async (req, res) => {
  const [user, predictionCount] = await Promise.all([
    User.findById(req.user._id),
    Prediction.countDocuments({ user: req.user._id }),
  ]);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toObject(),
      predictionCount,
    },
  });
};
const updateProfile = async (req, res) => {
  const allowedFields = ['name', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};
const getDashboardStats = async (req, res) => {
  const [
    totalUsers,
    totalPredictions,
    predictionsByDisease,
    recentPredictions,
  ] = await Promise.all([
    User.countDocuments(),
    Prediction.countDocuments(),
    Prediction.aggregate([
      {
        $group: {
          _id: '$diseaseKey',
          displayName: { $first: '$displayName' },
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          diseaseKey: '$_id',
          displayName: 1,
          count: 1,
          avgConfidence: { $round: ['$avgConfidence', 2] },
        },
      },
    ]),
    Prediction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('displayName confidence isHealthy isGuest createdAt user'),
  ]);
  const [activeUsers, guestPredictions] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Prediction.countDocuments({ isGuest: true }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalPredictions,
      guestPredictions,
      registeredPredictions: totalPredictions - guestPredictions,
      predictionsByDisease,
      recentPredictions,
    },
  });
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getDashboardStats,
};
