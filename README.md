# [Video Interview Proctoring System](https://videoproctoringsystem.vercel.app/)


**Live Link :** [https://videoproctoringsystem.vercel.app/](https://videoproctoringsystem.vercel.app/)


**Frontend :** [https://videoproctoringsystem.vercel.app/](https://videoproctoringsystem.vercel.app/)  
**Backend API :** [https://videoproctoringbackend.onrender.com](https://videoproctoringbackend.onrender.com)

---

## Overview

This project is a comprehensive **video interview proctoring system**. It leverages **real-time computer vision** to monitor candidate focus and detect suspicious objects during online interviews. The system also generates detailed reports with an integrity score to evaluate the authenticity of interview sessions.

---

## Why Use a Video Proctoring System?

A video proctoring system enhances the reliability and integrity of online interviews by:

* **Ensuring candidate focus:** Detects if candidates are attentive during interviews.
* **Detecting unauthorized behavior:** Flags multiple faces, suspicious objects, or prohibited devices in real time.
* **Maintaining interview integrity:** Generates detailed reports for evaluation.
* **Providing real-time alerts:** Optionally notifies if suspicious events occur during the session.

This project demonstrates the integration of **modern web technologies** and **real-time computer vision** for a secure and interactive online interview experience.

---

## Features

* **Real-time Focus Detection:** Monitors candidate attention using face and eye tracking.
* **Face Detection:** Identifies presence/absence of faces and flags multiple faces in the frame.
* **Object Detection:** Detects unauthorized items such as phones, books, or electronic devices using TensorFlow\.js.
* **Integrity Scoring:** Computes a final score based on logged suspicious events.
* **Detailed Reports:** Generates session summaries including all events and the overall integrity score.
* **Tech Stack:** MERN (MongoDB, Express, React, Node.js), TensorFlow\.js, MediaPipe, React Webcam

---

## Prerequisites

* Node.js (v16 or higher recommended)
* npm (v8 or higher recommended)
* MongoDB instance (local or MongoDB Atlas)
* Modern web browser with camera access

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/video-proctoring-system.git
cd video-proctoring-system
```

### 2. Install Dependencies

**Backend:**

```
cd backend
npm install
```

**Frontend:**

```
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the backend directory and add your MongoDB connection URI:

```
MONGODB_URI=your-mongodb-connection-string
```

### 4. Start Development Servers

**Backend:**

```
npm run dev
```

**Frontend:**

```
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000) by default.

---

## Deployment

The application can be deployed on platforms such as **Vercel** (frontend) and **Render** (backend).

**Frontend Deployment (Vercel):**

* Push your frontend code to GitHub.
* Create a new project on Vercel and link the repository.
* Set environment variables if required.
* Deploy to get a public URL: [https://videoproctoringsystem.vercel.app/](https://videoproctoringsystem.vercel.app/)

**Backend Deployment (Render):**

* Push your backend code to GitHub.
* Create a Web Service on Render and connect the repository.
* Set build command:

```
npm install
```

* Set start command:

```
npm start
```

* Add environment variable `MONGODB_URI`.
* Deploy to get a public URL: [https://videoproctoringbackend.onrender.com](https://videoproctoringbackend.onrender.com)

---

## API Endpoints

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| POST   | /api/sessions             | Create a new session  |
| POST   | /api/sessions/\:id/events | Log a detection event |
| PUT    | /api/sessions/\:id/end    | End a session         |
| GET    | /api/sessions/\:id        | Retrieve final report |

---

## License

This project is licensed under the **MIT License**.
