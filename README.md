# MentorX 🚀

**Empowering the Next Generation of Tech Leaders through Seamless Mentorship.**

MentorX (BlockLearn) is a cutting-edge, mobile-first mentorship platform designed to bridge the gap between aspiring learners and industry experts. Built with a scalable architecture, it integrates real-time communication, AI-driven roadmaps, and secure credentialing.

---

## ✨ Key Features

### 📱 Mobile Experience (Frontend)
- **Seamless Authentication**: Secure login, registration, and OTP-based verification for peace of mind.
- **Smart Mentor Discovery**: Advanced matching algorithms to find the perfect mentor based on skills and career goals.
- **Interactive Dashboard**: A centralized hub for tracking your learning progress, upcoming sessions, and mentorship requests.
- **Real-time Chat**: Direct communication channel with mentors powered by Socket.io.
- **Theme Support**: Seamless switching between Light and Dark modes for a comfortable experience.
- **Atomic UI**: A consistent, high-performance UI built with Atomic Design principles.

### ⚙️ Powerhouse Backend
- **Robust API Layer**: A scalable Express.js backend managing everything from auth to complex matching logic.
- **AI-Powered Roadmaps**: Integration with OpenAI to generate personalized career roadmaps for students.
- **Skill Matching Engine**: Sophisticated logic to calculate skill transfers and find compatible mentors.
- **Real-time Signaling**: Optimized signaling for live communication and notifications.
- **Automated Feedback**: Comprehensive session tracking and feedback loops to ensure quality mentorship.
- **Database Resilience**: Intelligent MongoDB connection with automated fallbacks to memory servers for development.

---

## 🛠️ Technology Stack

| Component | Tech Used |
| :--- | :--- |
| **Frontend** | React Native, Expo, TypeScript, Expo Router, Reanimated |
| **State Management** | React Context API (Auth, Career) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose/MongoClient) |
| **Real-time** | Socket.io |
| **Security** | JWT, Helmet, CORS |
| **Integrations** | OpenAI (AI Roadmaps), Blockchain (Credentials) |

---

## 🏗️ Architecture

MentorX follows an industry-standard, modular architecture. 

- **Frontend**: Follows Atomic Design for components and a service-based pattern for API communication.
- **Backend**: Implements a clean separation of concerns with dedicated routes, controllers, and models.

For a deep dive into the folder structure and design patterns, check out the [Architecture Guide](./ARCHITECTURE.md).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) (for mobile testing)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mentorx
```

### 2. Setup the Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm run dev
```

### 3. Setup the Mobile App
```bash
# Return to root directory
npm install
npx expo start
```

---

## 📁 Project Structure

```text
mentorx/
├── app/               # Expo Router screens & layouts
├── backend/           # Node.js/Express server logic
├── components/        # Reusable UI components (Atomic Design)
├── context/           # Global React Context providers
├── services/          # API communication layer
├── hooks/             # Custom React hooks
├── utils/             # Helper functions & validators
└── constants/         # Theme, colors & global config
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
