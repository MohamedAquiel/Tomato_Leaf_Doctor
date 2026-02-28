process.env.JWT_SECRET = 'test_secret_key_for_jest'
process.env.JWT_EXPIRE = '7d'

const mongoose = require('mongoose')

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/tomato_test_db', {})
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

beforeEach(async () => {
  const User = require('../models/User')
  const Prediction = require('../models/Prediction')
  await User.deleteMany({})
  await Prediction.deleteMany({})
})

describe('Suite 4 - Model Validation', () => {

  describe('User Model', () => {
    const User = require('../models/User')

    it('creates a user with valid data', async () => {
      const user = await User.create({ name: 'John', email: 'john@test.com', password: 'password123' })
      expect(user._id).toBeDefined()
      expect(user.name).toBe('John')
      expect(user.email).toBe('john@test.com')
    })

    it('fails without required name field', async () => {
      await expect(User.create({ email: 'a@b.com', password: '123456' })).rejects.toThrow()
    })

    it('fails without required email field', async () => {
      await expect(User.create({ name: 'Test', password: '123456' })).rejects.toThrow()
    })

    it('fails without required password field', async () => {
      await expect(User.create({ name: 'Test', email: 'test@test.com' })).rejects.toThrow()
    })

    it('defaults role to user', async () => {
      const user = await User.create({ name: 'Test', email: 'test@test.com', password: 'pass123' })
      expect(user.role).toBe('user')
    })

    it('defaults isActive to true', async () => {
      const user = await User.create({ name: 'Test', email: 'test2@test.com', password: 'pass123' })
      expect(user.isActive).toBe(true)
    })

    it('hashes password before save', async () => {
      const user = await User.create({ name: 'Test', email: 'hash@test.com', password: 'plaintext' })
      const saved = await User.findById(user._id).select('+password')
      expect(saved.password).not.toBe('plaintext')
      expect(saved.password).toMatch(/^\$2[ab]\$/)
    })

    it('matchPassword returns true for correct password', async () => {
      const user = await User.create({ name: 'Test', email: 'match@test.com', password: 'secret123' })
      const saved = await User.findById(user._id).select('+password')
      const result = await saved.matchPassword('secret123')
      expect(result).toBe(true)
    })

    it('matchPassword returns false for wrong password', async () => {
      const user = await User.create({ name: 'Test', email: 'wrong@test.com', password: 'secret123' })
      const saved = await User.findById(user._id).select('+password')
      const result = await saved.matchPassword('wrongpassword')
      expect(result).toBe(false)
    })

    it('getSignedJwtToken returns a string', async () => {
      const user = await User.create({ name: 'Test', email: 'jwt@test.com', password: 'pass123' })
      const token = user.getSignedJwtToken()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('rejects invalid email format', async () => {
      await expect(User.create({ name: 'Test', email: 'notanemail', password: 'pass123' })).rejects.toThrow()
    })

    it('rejects duplicate email', async () => {
      await User.create({ name: 'First', email: 'dup@test.com', password: 'pass123' })
      await expect(User.create({ name: 'Second', email: 'dup@test.com', password: 'pass456' })).rejects.toThrow()
    })

    it('rejects short password under 6 chars', async () => {
      await expect(User.create({ name: 'Test', email: 'short@test.com', password: '123' })).rejects.toThrow()
    })

    it('allows admin role', async () => {
      const user = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' })
      expect(user.role).toBe('admin')
    })
  })

  describe('Prediction Model', () => {
    const Prediction = require('../models/Prediction')

    const validPrediction = () => ({
      imageUrl: 'uploads/test.jpg',
      diseaseKey: 'Tomato___Early_Blight',
      displayName: 'Early Blight',
      confidence: 87.43,
      isHealthy: false,
    })

    it('creates prediction with valid data', async () => {
      const pred = await Prediction.create(validPrediction())
      expect(pred._id).toBeDefined()
      expect(pred.diseaseKey).toBe('Tomato___Early_Blight')
    })

    it('defaults isGuest to false', async () => {
      const pred = await Prediction.create(validPrediction())
      expect(pred.isGuest).toBe(false)
    })

    it('defaults isHealthy to false', async () => {
      const pred = await Prediction.create({ ...validPrediction(), isHealthy: undefined })
      expect(pred.isHealthy).toBe(false)
    })

    it('defaults notes to empty string', async () => {
      const pred = await Prediction.create(validPrediction())
      expect(pred.notes).toBe('')
    })

    it('defaults solution to null', async () => {
      const pred = await Prediction.create(validPrediction())
      expect(pred.solution).toBeNull()
    })

    it('fails without imageUrl', async () => {
      const { imageUrl, ...noImage } = validPrediction()
      await expect(Prediction.create(noImage)).rejects.toThrow()
    })

    it('fails without diseaseKey', async () => {
      const { diseaseKey, ...noKey } = validPrediction()
      await expect(Prediction.create(noKey)).rejects.toThrow()
    })

    it('fails without displayName', async () => {
      const { displayName, ...noName } = validPrediction()
      await expect(Prediction.create(noName)).rejects.toThrow()
    })

    it('fails without confidence', async () => {
      const { confidence, ...noConf } = validPrediction()
      await expect(Prediction.create(noConf)).rejects.toThrow()
    })

    it('fails when confidence below 0', async () => {
      await expect(Prediction.create({ ...validPrediction(), confidence: -1 })).rejects.toThrow()
    })

    it('fails when confidence above 100', async () => {
      await expect(Prediction.create({ ...validPrediction(), confidence: 101 })).rejects.toThrow()
    })

    it('creates healthy prediction with isHealthy true', async () => {
      const pred = await Prediction.create({ ...validPrediction(), diseaseKey: 'Tomato___Healthy', isHealthy: true })
      expect(pred.isHealthy).toBe(true)
    })

    it('accepts guest prediction with no user', async () => {
      const pred = await Prediction.create({ ...validPrediction(), isGuest: true })
      expect(pred.isGuest).toBe(true)
      expect(pred.user).toBeNull()
    })

    it('adds timestamps createdAt and updatedAt', async () => {
      const pred = await Prediction.create(validPrediction())
      expect(pred.createdAt).toBeDefined()
      expect(pred.updatedAt).toBeDefined()
    })

    it('stores solution as object', async () => {
      const solution = { description: 'Apply copper fungicide', symptoms: ['spots'] }
      const pred = await Prediction.create({ ...validPrediction(), solution })
      expect(pred.solution.description).toBe('Apply copper fungicide')
    })

    it('rejects notes exceeding 500 chars', async () => {
      const longNote = 'a'.repeat(501)
      await expect(Prediction.create({ ...validPrediction(), notes: longNote })).rejects.toThrow()
    })
  })
})
