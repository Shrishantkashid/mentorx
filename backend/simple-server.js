const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'BlockLearn API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Simple chatbot endpoint (no database required)
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty"
      });
    }

    // Simple rule-based responses for basic functionality
    const responses = {
      hello: "Hello! Welcome to BlockLearn. I can help you with learning sessions, skills, and more!",
      help: "I can help you with: scheduling sessions, finding mentors, managing skills, providing feedback, and learning new topics.",
      session: "To schedule a session, go to the Match page and find a mentor who offers the skills you want to learn.",
      skill: "You can manage your skills in the Skills page. Add skills you want to learn or skills you can teach others.",
      mentor: "To become a mentor, add skills you excel at to your 'Skills Offered' section in your profile.",
      feedback: "After completing a session, you can provide feedback using our rating system to help improve future matches."
    };

    const lowerMessage = message.toLowerCase();
    let response = "I'm here to help! Ask me about sessions, skills, mentors, or any BlockLearn features.";

    // Simple keyword matching
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = responses.hello;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what')) {
      response = responses.help;
    } else if (lowerMessage.includes('session') || lowerMessage.includes('schedule')) {
      response = responses.session;
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      response = responses.skill;
    } else if (lowerMessage.includes('mentor') || lowerMessage.includes('teach')) {
      response = responses.mentor;
    } else if (lowerMessage.includes('feedback') || lowerMessage.includes('rate')) {
      response = responses.feedback;
    }

    // Simulate some delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: {
        id: Date.now(),
        conversation_id: 'demo-conversation',
        messages: [
          {
            id: Date.now() - 1000,
            sender_type: 'user',
            message: message,
            timestamp: new Date(Date.now() - 1000).toISOString()
          },
          {
            id: Date.now(),
            sender_type: 'bot',
            message: response,
            timestamp: new Date().toISOString()
          }
        ]
      }
    });

  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Default root route
app.get('/', (req, res) => {
  res.send('BlockLearn Backend is running! Visit the frontend at http://localhost:5173');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 BlockLearn Backend running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend should be at: http://localhost:5173`);
});
