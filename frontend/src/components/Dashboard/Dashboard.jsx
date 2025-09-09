import React, { useState, useEffect, useRef } from 'react'
import CameraView from '../Camera/CameraView'
import DetectionPanel from '../DetectionPanel/DetectionPanel'
import { useFocusDetection } from '../../hooks/useFocusDetection'
import { useObjectDetection } from '../../hooks/useObjectDetection'
import { useCamera } from '../../hooks/useCamera'
import { apiService } from '../../services/apiService'
import styles from './Dashboard.module.css'

const Dashboard = ({ onSessionComplete }) => {
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [events, setEvents] = useState([])
  const intervalRef = useRef(null)

  const {
    videoRef,
    canvasRef,
    stream,
    startCamera,
    stopCamera,
    isRecording,
    startRecording,
    stopRecording
  } = useCamera()

  const {
    focusData,
    processFocusDetection
  } = useFocusDetection(videoRef, canvasRef)

  const {
    objectData,
    processObjectDetection
  } = useObjectDetection(videoRef, canvasRef)

  const startSession = async () => {
    if (!candidateName.trim()) {
      alert('Please enter candidate name')
      return
    }
    try {
      await startCamera()
      await startRecording()
      const session = await apiService.createSession({
        candidateName: candidateName.trim(),
        startTime: new Date().toISOString()
      })
      setSessionId(session.id)
      setSessionStartTime(new Date())
      setIsSessionActive(true)
      setEvents([])
      // Start detection loops
      intervalRef.current = setInterval(() => {
        processFocusDetection()
        processObjectDetection()
      }, 1000)
    } catch (error) {
      console.error('Error starting session:', error)
      alert('Failed to start session')
    }
  }

  const endSession = async () => {
    try {
      clearInterval(intervalRef.current)
      await stopRecording()
      stopCamera()
      const sessionData = {
        sessionId,
        candidateName,
        startTime: sessionStartTime,
        endTime: new Date(),
        // events,
        focusData,
        objectData
      }
      await apiService.endSession(sessionId, sessionData)
      onSessionComplete(sessionData)
      setIsSessionActive(false)
      setSessionId(null)
      setCandidateName('')
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionTime: Date.now() - sessionStartTime?.getTime()
    }
    setEvents(prev => [...prev, newEvent])
    // Send to backend
    apiService.logEvent(sessionId, newEvent)
  }

  useEffect(() => {
    // Monitor focus changes
    if (focusData.focusLostDuration > 5000 && isSessionActive) {
      addEvent({
        type: 'FOCUS_LOST',
        severity: 'warning',
        message: `Focus lost for ${Math.round(focusData.focusLostDuration / 1000)}s`,
        data: focusData
      })
    }
    if (focusData.noFaceDuration > 10000 && isSessionActive) {
      addEvent({
        type: 'NO_FACE',
        severity: 'danger',
        message: `No face detected for ${Math.round(focusData.noFaceDuration / 1000)}s`,
        data: focusData
      })
    }
    if (focusData.multipleFaces && isSessionActive) {
      addEvent({
        type: 'MULTIPLE_FACES',
        severity: 'danger',
        message: 'Multiple faces detected in frame',
        data: focusData
      })
    }
  }, [focusData, isSessionActive])

  useEffect(() => {
    // Monitor object detection
    if (objectData.detectedObjects.length > 0 && isSessionActive) {
      objectData.detectedObjects.forEach(obj => {
        addEvent({
          type: 'SUSPICIOUS_OBJECT',
          severity: 'danger',
          message: `${obj.class} detected (${Math.round(obj.confidence * 100)}% confidence)`,
          data: obj
        })
      })
    }
  }, [objectData, isSessionActive])

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.sessionInfo}>
          <h2>Interview Session</h2>
          {isSessionActive && (
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              LIVE
            </div>
          )}
        </div>
        {!isSessionActive ? (
          <div className={styles.startSession}>
            <input
              type="text"
              placeholder="Enter candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className={styles.nameInput}
            />
            <button onClick={startSession} className={styles.startBtn}>
              Start Interview
            </button>
          </div>
        ) : (
          <div className={styles.sessionControls}>
            <span className={styles.timer}>
              {Math.floor((Date.now() - sessionStartTime?.getTime()) / 1000)}s
            </span>
            <button onClick={endSession} className={styles.endBtn}>
              End Interview
            </button>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.videoSection}>
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isActive={isSessionActive}
            focusData={focusData}
            objectData={objectData}
          />
        </div>
        <div className={styles.detectionSection}>
          <DetectionPanel
            focusData={focusData}
            objectData={objectData}
            events={events}
            isActive={isSessionActive}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard