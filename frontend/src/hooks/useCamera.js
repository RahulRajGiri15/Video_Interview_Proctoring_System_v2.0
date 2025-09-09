import { useState, useRef } from 'react'

export const useCamera = () => {
  const [stream, setStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunks = useRef([])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      return mediaStream
    } catch (error) {
      console.error('Error accessing camera:', error)
      throw error
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setStream(null)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startRecording = () => {
    if (!stream) return
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9'
      })
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data)
        }
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        // Here you can send the recording to your backend
        console.log('Recording completed, blob size:', blob.size)
        recordedChunks.current = []
      }
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Record in 1-second chunks
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return {
    videoRef,
    canvasRef,
    stream,
    startCamera,
    stopCamera,
    isRecording,
    startRecording,
    stopRecording
  }
}