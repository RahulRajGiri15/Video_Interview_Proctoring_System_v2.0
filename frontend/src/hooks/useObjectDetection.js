import { useState, useRef, useEffect } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

export const useObjectDetection = (videoRef, canvasRef) => {
  const [objectData, setObjectData] = useState({
    detectedObjects: [],
    suspiciousItems: 0
  })
  const modelRef = useRef(null)
  const suspiciousObjects = ['cell phone', 'book', 'laptop', 'remote', 'keyboard', 'mouse']

  useEffect(() => {
    loadModel()
  }, [])

  const loadModel = async () => {
    try {
      const model = await cocoSsd.load()
      modelRef.current = model
      console.log('COCO-SSD model loaded')
    } catch (error) {
      console.error('Error loading COCO-SSD model:', error)
    }
  }

  const processObjectDetection = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !modelRef.current) return

    if (video.readyState === 4) {
      try {
        const predictions = await modelRef.current.detect(video)
        const suspiciousDetections = predictions.filter(prediction =>
          suspiciousObjects.some(item =>
            prediction.class.toLowerCase().includes(item.toLowerCase())
          ) && prediction.score > 0.5
        )
        
        drawBoundingBoxes(canvas, suspiciousDetections)
        
        setObjectData({
          detectedObjects: suspiciousDetections.map(pred => ({
            class: pred.class,
            confidence: pred.score,
            bbox: pred.bbox
          })),
          suspiciousItems: suspiciousDetections.length
        })
      } catch (error) {
        console.error('Error during object detection:', error)
      }
    }
  }

  const drawBoundingBoxes = (canvas, predictions) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox
      
      ctx.strokeStyle = '#FF0000'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)
      
      ctx.fillStyle = '#FF0000'
      ctx.font = '16px Arial'
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 20 ? y - 5 : y + 20
      )
    })
  }

  return {
    objectData,
    processObjectDetection
  }
}