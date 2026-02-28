'use strict';

const { PAGINATION } = require('../config/constants');

const sendSuccess = (res, data, statusCode = 200, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    ...meta,
    data,
  });
};

const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

const getPagination = (
  query,
  defaults = {}
) => {
  const defaultPage  = defaults.page  || PAGINATION.DEFAULT_PAGE;
  const defaultLimit = defaults.limit || PAGINATION.DEFAULT_LIMIT;
  let page = parseInt(query.page, 10);
  if (!Number.isFinite(page) || page < 1) {
    page = defaultPage;
  }
  let limit = parseInt(query.limit, 10);
  if (!Number.isFinite(limit) || limit < 1) {
    limit = defaultLimit;
  }
  if (limit > PAGINATION.MAX_LIMIT) {
    limit = PAGINATION.MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = { sendSuccess, sendError, getPagination };
