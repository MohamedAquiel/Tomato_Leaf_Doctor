process.env.JWT_SECRET = 'test_secret_key_for_jest'
process.env.JWT_EXPIRE = '7d'
process.env.NODE_ENV = 'test'

const { register, login, logout, getMe, updatePassword } = require('../controllers/authController')

const makeRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn().mockReturnThis()
  res.cookie = jest.fn().mockReturnThis()
  return res
}

const mockUser = (overrides = {}) => ({
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  isActive: true,
  lastLogin: null,
  password: '$2a$10$hashedpassword',
  matchPassword: jest.fn(),
  getSignedJwtToken: jest.fn().mockReturnValue('mock.jwt.token'),
  save: jest.fn().mockResolvedValue(true),
  toObject: jest.fn().mockReturnValue({ _id: 'user123', name: 'Test User', email: 'test@example.com', role: 'user' }),
  ...overrides,
})

jest.mock('../models/User')
const User = require('../models/User')

describe('Suite 3 - Auth Controller', () => {

  beforeEach(() => jest.clearAllMocks())

  describe('register()', () => {

    it('returns 400 if name is missing', async () => {
      const req = { body: { email: 'test@test.com', password: '123456' } }
      const res = makeRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }))
    })

    it('returns 400 if email is missing', async () => {
      const req = { body: { name: 'Test', password: '123456' } }
      const res = makeRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 if password is missing', async () => {
      const req = { body: { name: 'Test', email: 'test@test.com' } }
      const res = makeRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 409 if email already exists', async () => {
      User.findOne.mockResolvedValue(mockUser())
      const req = { body: { name: 'Test', email: 'test@test.com', password: '123456' } }
      const res = makeRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(409)
    })

    it('returns 201 and token on successful registration', async () => {
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue(mockUser())
      const req = { body: { name: 'Test', email: 'new@test.com', password: '123456' } }
      const res = makeRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: 'mock.jwt.token' }))
    })
  })

  describe('login()', () => {

    it('returns 400 if email is missing', async () => {
      const req = { body: { password: '123456' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 if password is missing', async () => {
      const req = { body: { email: 'test@test.com' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 401 if user not found', async () => {
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) })
      const req = { body: { email: 'nobody@test.com', password: '123456' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 401 if account is inactive', async () => {
      const inactiveUser = mockUser({ isActive: false })
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(inactiveUser) })
      const req = { body: { email: 'test@test.com', password: '123456' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 401 if password does not match', async () => {
      const user = mockUser()
      user.matchPassword.mockResolvedValue(false)
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })
      const req = { body: { email: 'test@test.com', password: 'wrongpass' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 200 and token on successful login', async () => {
      const user = mockUser()
      user.matchPassword.mockResolvedValue(true)
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })
      const req = { body: { email: 'test@test.com', password: 'correct' } }
      const res = makeRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: 'mock.jwt.token' }))
    })

    it('updates lastLogin on successful login', async () => {
      const user = mockUser()
      user.matchPassword.mockResolvedValue(true)
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })
      const req = { body: { email: 'test@test.com', password: 'correct' } }
      const res = makeRes()
      await login(req, res)
      expect(user.save).toHaveBeenCalled()
    })
  })

  describe('logout()', () => {

    it('returns 200 on logout', async () => {
      const req = {}
      const res = makeRes()
      await logout(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }))
    })

    it('sets cookie to expire on logout', async () => {
      const req = {}
      const res = makeRes()
      await logout(req, res)
      expect(res.cookie).toHaveBeenCalledWith('token', 'none', expect.any(Object))
    })
  })

  describe('getMe()', () => {

    it('returns 404 if user not found', async () => {
      User.findById.mockResolvedValue(null)
      const req = { user: { _id: 'nonexistent' } }
      const res = makeRes()
      await getMe(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('returns 200 with user data', async () => {
      const user = mockUser()
      User.findById.mockResolvedValue(user)
      const req = { user: { _id: 'user123' } }
      const res = makeRes()
      await getMe(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: user }))
    })
  })

  describe('updatePassword()', () => {

    it('returns 400 if currentPassword missing', async () => {
      const req = { body: { newPassword: 'newpass' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 if newPassword missing', async () => {
      const req = { body: { currentPassword: 'old' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 if newPassword too short', async () => {
      const req = { body: { currentPassword: 'old', newPassword: '123' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 404 if user not found', async () => {
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) })
      const req = { body: { currentPassword: 'old123', newPassword: 'new123456' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('returns 401 if current password incorrect', async () => {
      const user = mockUser()
      user.matchPassword.mockResolvedValue(false)
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })
      const req = { body: { currentPassword: 'wrongold', newPassword: 'new123456' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 200 on successful password update', async () => {
      const user = mockUser()
      user.matchPassword.mockResolvedValue(true)
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })
      const req = { body: { currentPassword: 'correct', newPassword: 'new123456' }, user: { _id: 'u1' } }
      const res = makeRes()
      await updatePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})
