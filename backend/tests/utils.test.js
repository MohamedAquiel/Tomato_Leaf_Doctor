const { sendSuccess, sendError, getPagination } = require('../utils/sendResponse')
const asyncHandler = require('../utils/asyncHandler')

const makeRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn().mockReturnThis()
  return res
}

describe('Suite 1 - Utility Functions', () => {

  describe('sendSuccess', () => {
    it('sends 200 with correct shape', () => {
      const res = makeRes()
      sendSuccess(res, { id: 1 })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: { id: 1 } })
      )
    })

    it('sends custom status code', () => {
      const res = makeRes()
      sendSuccess(res, {}, 201)
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('includes meta fields in response', () => {
      const res = makeRes()
      sendSuccess(res, [], 200, { total: 5, pages: 2 })
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ total: 5, pages: 2 })
      )
    })
  })

  describe('sendError', () => {
    it('sends 400 error with correct shape', () => {
      const res = makeRes()
      sendError(res, 'Bad Request')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'Bad Request' })
      )
    })

    it('sends custom error status code', () => {
      const res = makeRes()
      sendError(res, 'Not found', 404)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('sends 401 for unauthorized', () => {
      const res = makeRes()
      sendError(res, 'Unauthorized', 401)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })

  describe('getPagination', () => {
    it('returns correct page, limit, skip for valid input', () => {
      const result = getPagination({ page: '2', limit: '10' })
      expect(result.page).toBe(2)
      expect(result.limit).toBe(10)
      expect(result.skip).toBe(10)
    })

    it('defaults to page 1 for invalid page', () => {
      const result = getPagination({ page: 'abc', limit: '10' })
      expect(result.page).toBe(1)
    })

    it('defaults to page 1 for negative page', () => {
      const result = getPagination({ page: '-1', limit: '10' })
      expect(result.page).toBe(1)
    })

    it('defaults limit when invalid', () => {
      const result = getPagination({ page: '1', limit: 'xyz' })
      expect(result.limit).toBeGreaterThan(0)
    })

    it('caps limit at MAX_LIMIT', () => {
      const result = getPagination({ page: '1', limit: '99999' })
      expect(result.limit).toBeLessThanOrEqual(100)
    })

    it('calculates skip correctly', () => {
      const result = getPagination({ page: '3', limit: '20' })
      expect(result.skip).toBe(40)
    })
  })

  describe('asyncHandler', () => {
    it('calls the wrapped function with req, res, next', async () => {
      const fn = jest.fn().mockResolvedValue('done')
      const wrapped = asyncHandler(fn)
      const req = {}, res = {}, next = jest.fn()
      await wrapped(req, res, next)
      expect(fn).toHaveBeenCalledWith(req, res, next)
    })

    it('calls next with error when async function throws', async () => {
      const err = new Error('async error')
      const fn = jest.fn().mockRejectedValue(err)
      const wrapped = asyncHandler(fn)
      const req = {}, res = {}, next = jest.fn()
      await wrapped(req, res, next)
      expect(next).toHaveBeenCalledWith(err)
    })

    it('does not call next when function resolves successfully', async () => {
      const fn = jest.fn().mockResolvedValue('ok')
      const wrapped = asyncHandler(fn)
      const req = {}, res = {}, next = jest.fn()
      await wrapped(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
