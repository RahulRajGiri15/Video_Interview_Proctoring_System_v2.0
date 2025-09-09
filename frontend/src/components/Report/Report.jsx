import React, { useState, useEffect } from 'react'
import styles from './Report.module.css'
import { apiService } from '../../services/apiService'

const Report = ({ sessionData }) => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      if (!sessionData || !sessionData.sessionId) {
        setLoading(false)
        return
      }
      try {
        const fetchedReport = await apiService.getReport(sessionData.sessionId)
        setReport(fetchedReport)
      } catch (err) {
        setError("Failed to fetch report. Please check the backend connection.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [sessionData])

  if (loading) {
    return <div className={styles.reportContainer}>Loading report...</div>
  }

  if (error) {
    return <div className={styles.reportContainer}><div className={styles.alertDanger}>{error}</div></div>
  }

  if (!report) {
    return <div className={styles.reportContainer}><div className={styles.noData}>No session data available. Please complete an interview first.</div></div>
  }

  const durationInMinutes = Math.floor(report.duration / 1000 / 60)
  const focusLossEvents = report.events.filter(e => e.type === 'FOCUS_LOST').length
  const suspiciousObjectEvents = report.events.filter(e => e.type === 'SUSPICIOUS_OBJECT').length
  const noFaceEvents = report.events.filter(e => e.type === 'NO_FACE').length
  const multipleFacesEvents = report.events.filter(e => e.type === 'MULTIPLE_FACES').length

  return (
    <div className={styles.reportContainer}>
      <div className={styles.header}>
        <h2>Proctoring Report</h2>
        <button onClick={() => window.print()} className={styles.printBtn}>Print Report</button>
      </div>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Candidate Name:</span>
          <span className={styles.value}>{report.candidateName}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Interview Duration:</span>
          <span className={styles.value}>{durationInMinutes} minutes</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Final Integrity Score:</span>
          <span className={styles.scoreValue}>{report.integrityScore}%</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Event Log</h3>
        <div className={styles.eventList}>
          {report.events.length > 0 ? (
            report.events.map((event, index) => (
              <div key={index} className={styles.eventItem}>
                <span className={styles.eventTime}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                <span className={styles.eventMessage} data-severity={event.severity}>{event.message}</span>
              </div>
            ))
          ) : (
            <div className={styles.noEvents}>No suspicious events were detected.</div>
          )}
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Statistics</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Focus Lost</span>
            <span className={styles.statValue}>{focusLossEvents} times</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>No Face Detected</span>
            <span className={styles.statValue}>{noFaceEvents} times</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Multiple Faces</span>
            <span className={styles.statValue}>{multipleFacesEvents} times</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Suspicious Objects</span>
            <span className={styles.statValue}>{suspiciousObjectEvents} times</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report