import React, { useEffect } from 'react'
import styles from './CameraView.module.css'

const CameraView = ({ videoRef, canvasRef, isActive, focusData, objectData }) => {
  const getFocusStatus = () => {
    if (!focusData) return 'unknown'
    if (focusData.noFaceDuration > 10000) return 'no-face'
    if (focusData.focusLostDuration > 5000) return 'focus-lost'
    if (focusData.multipleFaces) return 'multiple-faces'
    return 'focused'
  }

  const getStatusMessage = () => {
    const status = getFocusStatus()
    switch (status) {
      case 'focused': return '✅ Candidate is focused'
      case 'focus-lost': return '⚠️ Candidate looking away'
      case 'no-face': return '❌ No face detected'
      case 'multiple-faces': return '⚠️ Multiple people detected'
      default: return 'Camera initializing...'
    }
  }

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={styles.video}
        />
        <canvas
          ref={canvasRef}
          className={styles.overlay}
        />
        {isActive && (
          <div className={styles.statusOverlay}>
            <div className={`${styles.statusBadge} ${styles[getFocusStatus()]}`}>
              {getStatusMessage()}
            </div>
            {objectData.detectedObjects.length > 0 && (
              <div className={styles.objectAlert}>
                Suspicious objects detected:
                {objectData.detectedObjects.map((obj, index) => (
                  <span key={index} className={styles.objectTag}>
                    {obj.class} ({Math.round(obj.confidence * 100)}%)
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.controls}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Focus Score:</span>
            <span className={styles.value}>
              {focusData ? Math.round(focusData.focusScore) : 0}%
            </span>
          </div>
          <div className={styles.stat}>
            <span>Objects:</span>
            <span className={styles.value}>
              {objectData ? objectData.detectedObjects.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraView