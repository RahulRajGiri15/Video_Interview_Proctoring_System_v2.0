const Session = require('../models/Session')
const { v4: uuidv4} = require('uuid')

exports.createSession = async (req, res) => {
  try {
    const { candidateName, startTime } = req.body
    const sessionId = uuidv4()
    const session = new Session({
      sessionId,
      candidateName,
      startTime: new Date(startTime),
      events: [],
      focusData: {},
      objectData: {},
      integrityScore: 100
    })
    await session.save()
    res.status(201).json({
      id: sessionId,
      message: 'Session created successfully'
    })
  } catch (error) {
    console.error('Error creating session:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
}

exports.logEvent = async (req, res) => {
  try {
    const { sessionId } = req.params
    const eventData = req.body
    const session = await Session.findOne({ sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    session.events.push(eventData)
    await session.save()
    res.json({ message: 'Event logged successfully' })
  } catch (error) {
    console.error('Error logging event:', error)
    res.status(500).json({ error: 'Failed to log event' })
  }
}

exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { endTime, focusData, objectData } = req.body
    const session = await Session.findOne({ sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    // Calculate session statistics
    const duration = new Date(endTime) - new Date(session.startTime)
    const integrityScore = calculateIntegrityScore(session.events)
    // Update session
    session.endTime = new Date(endTime)
    session.duration = duration
    session.focusData = processFocusData(session.events)
    session.objectData = processObjectData(session.events)
    session.integrityScore = integrityScore
    session.status = 'completed'
    await session.save()
    res.json({
      message: 'Session ended successfully',
      integrityScore,
      duration
    })
  } catch (error) {
    console.error('Error ending session:', error)
    res.status(500).json({ error: 'Failed to end session' })
  }
}

exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const session = await Session.findOne({ sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
}

const calculateIntegrityScore = (events) => {
  let score = 100
  events.forEach(event => {
    switch (event.type) {
      case 'FOCUS_LOST':
        score -= 5
        break
      case 'NO_FACE':
        score -= 10
        break
      case 'MULTIPLE_FACES':
        score -= 15
        break
      case 'SUSPICIOUS_OBJECT':
        score -= 20
        break
      case 'EYE_CLOSURE':
        score -= 8
        break
    }
  })
  return Math.max(0, score)
}

const processFocusData = (events) => {
  const focusEvents = events.filter(e =>
    ['FOCUS_LOST', 'NO_FACE', 'MULTIPLE_FACES', 'EYE_CLOSURE'].includes(e.type)
  )
  return {
    totalFocusLoss: focusEvents.filter(e => e.type === 'FOCUS_LOST').length,
    noFaceInstances: focusEvents.filter(e => e.type === 'NO_FACE').length,
    multipleFaceInstances: focusEvents.filter(e => e.type === 'MULTIPLE_FACES').length,
    eyeClosureInstances: focusEvents.filter(e => e.type === 'EYE_CLOSURE').length
  }
}

const processObjectData = (events) => {
  const objectEvents = events.filter(e => e.type === 'SUSPICIOUS_OBJECT')
  const detectedObjects = [...new Set(objectEvents.map(e => e.data?.class).filter(Boolean))]
  return {
    suspiciousObjectsDetected: detectedObjects,
    totalSuspiciousDetections: objectEvents.length
  }
}