const jwt = require('jsonwebtoken')
const { protect, authorize, optionalProtect } = require('../middleware/auth')

process.env.JWT_SECRET = 'test_secret_key_for_jest'
process.env.JWT_EXPIRE = '7d'

const makeRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn().mockReturnThis()
  return res
}

const makeToken = (payload = {}) =>
  jwt.sign({ id: 'user123', ...payload }, process.env.JWT_SECRET, { expiresIn: '1h' })

describe('Suite 2 - Middleware Tests', () => {

  describe('protect middleware', () => {

    it('returns 401 when no token provided', async () => {
      const req = { headers: {}, cookies: {} }
      const res = makeRes()
      const next = jest.fn()
      await protect(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })

    it('returns 401 for invalid token', async () => {
      const req = { headers: { authorization: 'Bearer invalidtoken123' }, cookies: {} }
      const res = makeRes()
      const next = jest.fn()
      await protect(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 401 for expired token', async () => {
      const expiredToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET, { expiresIn: '-1s' })
      const req = { headers: { authorization: `Bearer ${expiredToken}` }, cookies: {} }
      const res = makeRes()
      const next = jest.fn()
      await protect(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })

  describe('authorize middleware', () => {

    it('calls next when user has required role', () => {
      const req = { user: { role: 'admin' } }
      const res = makeRes()
      const next = jest.fn()
      authorize('admin')(req, res, next)
      expect(next).toHaveBeenCalled()
    })

    it('returns 403 when user lacks required role', () => {
      const req = { user: { role: 'user' } }
      const res = makeRes()
      const next = jest.fn()
      authorize('admin')(req, res, next)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(next).not.toHaveBeenCalled()
    })

    it('allows multiple roles', () => {
      const req = { user: { role: 'user' } }
      const res = makeRes()
      const next = jest.fn()
      authorize('admin', 'user')(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('optionalProtect middleware', () => {

    it('calls next without user when no token', async () => {
      const req = { headers: {}, cookies: {} }
      const res = makeRes()
      const next = jest.fn()
      await optionalProtect(req, res, next)
      expect(next).toHaveBeenCalled()
      expect(req.user).toBeUndefined()
    })

    it('calls next without user when token is invalid', async () => {
      const req = { headers: { authorization: 'Bearer badtoken' }, cookies: {} }
      const res = makeRes()
      const next = jest.fn()
      await optionalProtect(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('errorHandler middleware', () => {
    const errorHandler = require('../middleware/errorHandler')

    it('handles CastError with 400', () => {
      const err = { name: 'CastError', value: 'invalid-id' }
      const req = {}
      const res = makeRes()
      const next = jest.fn()
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('handles duplicate key error with 409', () => {
      const err = { code: 11000, keyValue: { email: 'test@test.com' } }
      const req = {}
      const res = makeRes()
      const next = jest.fn()
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(409)
    })

    it('handles ValidationError with 400', () => {
      const err = {
        name: 'ValidationError',
        errors: { name: { message: 'Name required' } }
      }
      const req = {}
      const res = makeRes()
      const next = jest.fn()
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('handles generic error with 500', () => {
      const err = { message: 'Something broke', statusCode: 500 }
      const req = {}
      const res = makeRes()
      const next = jest.fn()
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
