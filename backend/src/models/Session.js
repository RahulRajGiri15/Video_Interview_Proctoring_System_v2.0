const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['FOCUS_LOST', 'NO_FACE', 'MULTIPLE_FACES', 'SUSPICIOUS_OBJECT', 'EYE_CLOSURE'],
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'danger'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  sessionTime: {
    type: Number,
    required: true
  },
  data: mongoose.Schema.Types.Mixed
})

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  candidateName: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in milliseconds
  },
  events: [eventSchema],
  focusData: {
    totalFocusLoss: Number,
    maxFocusLossDuration: Number,
    noFaceInstances: Number,
    multipleFaceInstances: Number,
    eyeClosureInstances: Number
  },
  objectData: {
    suspiciousObjectsDetected: [String],
    totalSuspiciousDetections: Number
  },
  integrityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  recordingPath: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated'],
    default: 'active'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Session', sessionSchema)