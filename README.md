<div align="center">

# 🎓 EduKids

**A multi-service AI-powered learning platform for primary-school classrooms**

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Live Data](#-live-data) · [IoT Classroom Device](#-iot-classroom-device) · [User Flows](#-user-flows) · [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

| Category | Capabilities |
|---|---|
| 👩‍🏫 **Teachers** | Classroom & course management, PDF lesson uploads, live session hosting, real-time classroom monitoring |
| 👦 **Students** | AI explanations, audio & video generation, quizzes, multilingual chatbot |
| 👨‍👩‍👦 **Parents** | View children's progress, review daily summaries |
| 🤖 **AI Tools** | Adaptive explanations, audio/video generation, quiz creation, PDF extraction |
| 💬 **Chatbot** | Text, speech-to-text, text-to-speech in Arabic, French & English |
| 🔴 **Live Sessions** | Real-time classroom support via Socket.IO |
| 🎛️ **IoT Device** | 4-button classroom feedback device connected through serial bridge |

---

## 🏗️ Architecture

EduKids is composed of four independent services, with an optional IoT bridge for classroom hardware:

```text
EduKids/
├── frontend/              React + Vite client
├── backend/               Express + MongoDB API + Socket.IO
├── aiTutorial-api/        FastAPI service — lesson AI tools
├── chatbot-api/           FastAPI service — multilingual chatbot
├── EduKids_IOT/           Arduino + Python serial bridge
├── START_ALL.ps1          PowerShell launcher for local development
└── README.md
```

### Service Map

| Service | URL | Stack | Purpose |
|---|---|---|---|
| Frontend | http://localhost:3000 | React 19 + Vite | Main application UI |
| Backend API | http://localhost:5000 | Node.js + Express + MongoDB | Auth, classes, materials, sessions, quizzes, IoT events |
| AI Tutor API | http://localhost:5001 | FastAPI (Python) | Explanations, audio, video, quiz & PDF tools |
| Chatbot API | http://localhost:8000 | FastAPI (Python) | Buddy chatbot with voice support |
| IoT Serial Bridge | local process | Python + PySerial | Reads Arduino button presses and forwards them to backend |

### Frontend Proxy Routes

During development, the Vite dev server proxies the following paths:

| Proxy Path | Target |
|---|---|
| `/api` | Backend API |
| `/uploads` | Backend uploaded files |
| `/ai-api` | AI Tutor API |
| `/ai-health` | AI Tutor health endpoint |
| `/files` | AI Tutor generated media |
| `/chatbot-api` | Chatbot API |
| `/chatbot-audio` | Chatbot audio files |

---

## 🛠️ Tech Stack

- **Frontend** — React, Vite, React Router, Socket.IO Client, Recharts
- **Backend** — Node.js, Express, MongoDB + Mongoose, Socket.IO, Multer, JWT, Natural
- **Python Services** — FastAPI, Uvicorn, gTTS, Whisper, Sentence Transformers, FAISS, PyMuPDF, MoviePy
- **IoT Bridge** — Python, PySerial, Requests
- **Hardware** — Arduino / ESP32 with 4 feedback buttons

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed before proceeding:

**Required**
- Node.js 18+ and npm 9+
- Python 3.11+
- MongoDB (local instance or remote URI)

**Optional but recommended**
- `ffmpeg` — required for AI video generation
- API keys for AI providers used by the Python services
- Arduino IDE — for uploading the classroom device firmware

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd EduKids
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
npm install natural
cd ..
```

### 4. Install Python Dependencies

**AI Tutor API**
```bash
cd aiTutorial-api
python -m venv .venv
.venv\Scripts\activate       # On Windows
# source .venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
cd ..
```

**Chatbot API**
```bash
cd chatbot-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**IoT Serial Bridge**
```bash
cd EduKids_IOT
python -m venv .venv
.venv\Scripts\activate
pip install pyserial requests
cd ..
```

### 5. Configure Environment Variables

**`backend/.env`**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/edukids
JWT_SECRET=change_me
```

**`aiTutorial-api/.env`**
```env
OPENROUTER_API_KEY=your_key_here
LLM_MODEL=openai/gpt-4o-mini
SERVICE_PORT=5001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=edukids
```

**`chatbot-api/.env`**
```env
GROQ_API_KEY=your_key_here
CHATBOT_PORT=8000
```

**Optional IoT bridge configuration**
```env
SERIAL_PORT=COM3
BAUD_RATE=115200
API_BASE=http://localhost:5000/api
```

### 6. Run the Project

**Option A — Start everything at once (Windows)**
```powershell
.\START_ALL.ps1
```
This starts all main services on their respective ports.

**Option B — Start services individually**
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# AI Tutor API
cd aiTutorial-api && python main.py

# Chatbot API
cd chatbot-api && python main.py
```

**Option C — Start the IoT serial bridge**

After the backend is running and the Arduino is connected:
```bash
cd EduKids_IOT
.venv\Scripts\activate
python serial_bridge.py
```
This command listens to the serial port and forwards hardware button events to the backend.

---

## 🔴 Live Data

EduKids supports real-time classroom monitoring through Socket.IO and IoT classroom events.

### How live data works

1. A teacher starts a live classroom session
2. A student uses the classroom interface or the physical IoT device
3. Events are sent to the backend
4. The backend broadcasts updates through Socket.IO
5. The teacher dashboard receives live classroom data instantly

### Live event examples

- Student pressed **understand**
- Student pressed **confused**
- Student pressed **overwhelmed**
- Student pressed **help**
- Student joined a live session
- Classroom activity updated in real time

### Why live data matters

Live data helps teachers:
- detect classroom difficulties faster
- monitor engagement in real time
- identify students who may need support
- react immediately during lessons

---

## 🎛️ IoT Classroom Device

EduKids includes an optional classroom IoT device made of 4 physical buttons, usually connected to an Arduino or ESP32.

### Button meanings

| Button | Meaning |
|---|---|
| `understand` | The student understands the lesson |
| `confused` | The student is confused |
| `overwhelmed` | The student feels overloaded |
| `help` | The student needs help |

### IoT flow

```
Student presses button
        ↓
Arduino sends serial message
        ↓
Python serial_bridge.py reads the message
        ↓
Bridge resolves student and active session
        ↓
Bridge sends event to backend API
        ↓
Backend stores event and emits live update via Socket.IO
        ↓
Teacher dashboard displays the new classroom state
```

### Expected serial format

The Arduino sends lines like:
```
STU-2DTT,understand
STU-2DTT,confused
STU-2DTT,help
```

Where:
- `STU-2DTT` is the fixed student code installed in the device
- the second value is the pressed button type

### Serial bridge role

The Python bridge:
- reads button events from the serial port
- validates the button type
- resolves the student from the student code
- fetches the active classroom session
- sends the event to the backend API

### Run the IoT bridge

```bash
cd EduKids_IOT
.venv\Scripts\activate
python serial_bridge.py
```

### Requirements for IoT to work

Before using the IoT device:
- Backend must be running
- Teacher must create or start a live classroom session
- Arduino must be connected by USB
- The correct student code must be hardcoded in the Arduino firmware
- The serial bridge must be running

---

## 👥 User Flows

### 👩‍🏫 Teachers
1. Log in
2. Create and manage classes
3. Upload PDF lesson materials
4. Host live classroom sessions
5. Review classroom activity
6. Monitor live student signals from the dashboard

### 👦 Students
1. Log in
2. Open classroom materials
3. Read uploaded PDF lessons
4. Use AI tools: text explanation, audio, video, quiz
5. Chat with the multilingual buddy chatbot
6. Send live feedback through the UI or IoT device

### 👨‍👩‍👦 Parents
1. Log in
2. View their children's profiles
3. Review AI-generated daily summaries

---

## 📁 File Storage

| Type | Location |
|---|---|
| Uploaded lesson PDFs | `backend/uploads/materials/` |
| AI-generated audio & video | `aiTutorial-api/files/` |
| IoT scripts | `EduKids_IOT/` |

---

## 🧰 Useful Commands

```bash
# Build frontend for production
cd frontend && npm run build

# Lint frontend code
cd frontend && npm run lint

# Run backend in dev mode
cd backend && npm run dev

# Run backend summary job
cd backend && npm run job:summaries

# Install backend NLP dependency
cd backend && npm install natural

# Run IoT serial bridge
cd EduKids_IOT && python serial_bridge.py
```

---

## 🔧 Troubleshooting

<details>
<summary><strong>📄 PDF does not open</strong></summary>

- Make sure the backend is running on port 5000
- Check that the file exists in `backend/uploads/materials/`
- If a material record exists but the file is missing on disk, re-upload the PDF
</details>

<details>
<summary><strong>🤖 AI Tutor endpoints fail</strong></summary>

- Make sure `aiTutorial-api` is running on port 5001
- Verify `aiTutorial-api/.env` is correctly configured
- Confirm all Python dependencies are installed
- Install `ffmpeg` if video generation fails
</details>

<details>
<summary><strong>💬 Chatbot does not respond</strong></summary>

- Make sure `chatbot-api` is running on port 8000
- Verify `GROQ_API_KEY` is set in `chatbot-api/.env`
- Confirm Whisper and all Python dependencies are installed
</details>

<details>
<summary><strong>🌐 Frontend cannot reach APIs</strong></summary>

- Confirm the frontend dev server is running on port 3000
- Confirm all backend and Python services are on their expected ports
- Restart the frontend dev server after any proxy configuration change
</details>

<details>
<summary><strong>🎛️ IoT device does not send events</strong></summary>

- Confirm the Arduino is connected to the correct serial port
- Verify the serial port value such as `COM3`
- Make sure the baud rate matches the Arduino code
- Ensure `serial_bridge.py` is running
- Ensure the student code exists in the platform
- Ensure an active classroom session exists
- Check that the backend API is reachable at `http://localhost:5000/api`
</details>

<details>
<summary><strong>🔴 Live data does not appear on teacher dashboard</strong></summary>

- Confirm a live session is active
- Make sure the backend Socket.IO server is running
- Verify the frontend is connected to the correct backend URL
- Check whether button events are reaching the backend successfully
- Restart backend and frontend if socket connection was interrupted
</details>

---

## 📝 Notes

- All main services must be running simultaneously during local development
- The AI Tutor and Chatbot are fully independent services
- The frontend proxies all services during local development
- Uploaded PDFs must remain on disk at their stored path for lessons to display correctly
- The IoT bridge is an optional local process used only for physical classroom devices
- Each IoT device can be associated with one student code in its firmware

---

## 🤝 Contributing

1. Fork the repository and create a feature branch
2. Make your changes and test all affected services
3. Commit with a clear, descriptive message
4. Open a pull request

---

## 📄 License

This project is licensed under the terms specified in the `LICENSE` file.
