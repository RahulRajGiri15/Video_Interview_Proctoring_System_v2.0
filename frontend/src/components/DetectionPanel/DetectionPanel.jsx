import React from 'react'
import styles from './DetectionPanel.module.css'

const DetectionPanel = ({ focusData, objectData, events, isActive }) => {
  const getIntegrityScore = () => {
    let score = 100
    // Deduct for focus issues
    const focusLossEvents = events.filter(e => e.type === 'FOCUS_LOST').length
    const noFaceEvents = events.filter(e => e.type === 'NO_FACE').length
    const multipleFaceEvents = events.filter(e => e.type === 'MULTIPLE_FACES').length
    const objectEvents = events.filter(e => e.type === 'SUSPICIOUS_OBJECT').length
    score -= (focusLossEvents * 5)
    score -= (noFaceEvents * 10)
    score -= (multipleFaceEvents * 15)
    score -= (objectEvents * 20)
    return Math.max(0, score)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'danger': return '#F44336'
      case 'warning': return '#FF9800'
      case 'info': return '#2196F3'
      default: return '#4CAF50'
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Detection Status</h3>
        {isActive && (
          <div className={styles.integrityScore}>
            Integrity: <span className={styles.scoreValue}>{getIntegrityScore()}%</span>
          </div>
        )}
      </div>
      <div className={styles.section}>
        <h4>Focus Detection</h4>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span>Face Detected: </span>
            <span className={focusData?.faceDetected ? styles.good : styles.bad}>
              {focusData?.faceDetected ? 'Yes' : 'No'}
            </span>
          </div>
          <div className={styles.metric}>
            <span>Looking at Screen:</span>
            <span className={focusData?.lookingAtScreen ? styles.good : styles.warning}>
              {focusData?.lookingAtScreen ? 'Yes' : 'No'}
            </span>
          </div>
          <div className={styles.metric}>
            <span>Focus Lost Duration:</span>
            <span className={focusData?.focusLostDuration > 5000 ? styles.warning : styles.good}>
              {Math.round((focusData?.focusLostDuration || 0) / 1000)}s
            </span>
          </div>
          <div className={styles.metric}>
            <span>Multiple Faces: </span>
            <span className={focusData?.multipleFaces ? styles.bad : styles.good}>
              {focusData?.multipleFaces ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h4>Object Detection</h4>
        <div className={styles.objectList}>
          {objectData?.detectedObjects?.length > 0 ? (
            objectData.detectedObjects.map((obj, index) => (
              <div key={index} className={styles.detectedObject}>
                <span className={styles.objectName}>{obj.class}</span>
                <span className={styles.confidence}>
                  {Math.round(obj.confidence * 100)}%
                </span>
              </div>
            ))
          ) : (
            <div className={styles.noObjects}>No suspicious objects detected</div>
          )}
        </div>
      </div>
      <div className={styles.section}>
        <h4>Event Log</h4>
        <div className={styles.eventLog}>
          {events.length > 0 ? (
            events.slice(-10).reverse().map((event, index) => (
              <div key={index} className={styles.event}>
                <div
                  className={styles.eventIndicator}
                  style={{ backgroundColor: getSeverityColor(event.severity) }}
                ></div>
                <div className={styles.eventContent}>
                  <div className={styles.eventMessage}>{event.message}</div>
                  <div className={styles.eventTime}>{formatTime(event.timestamp)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noEvents}>No events logged</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetectionPanel