const User = require('../models/User');
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  const days = parseInt(jwtExpire, 10);
  const cookieOptions = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      data: userData,
    });
};
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and password are required',
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'An account with that email already exists',
    });
  }

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required',
    });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Your account has been deactivated. Please contact support.',
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
};
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);

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
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters',
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
};
