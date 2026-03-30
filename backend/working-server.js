const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'BlockLearn API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Simple chatbot endpoint (no database required)
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, conversation_id } = req.body;

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
      feedback: "After completing a session, you can provide feedback using our rating system to help improve future matches.",
      react: "React is a great framework! I can help you learn React through structured lessons, projects, and connecting you with experienced mentors.",
      javascript: "JavaScript is the foundation of web development. Start with basics like variables, functions, and DOM manipulation, then move to ES6+ features.",
      python: "Python is excellent for beginners and experts alike. Focus on data structures, algorithms, and libraries like pandas, numpy for data science.",
      "thank you": "You're welcome! Feel free to ask if you need help with anything else.",
      "thanks": "Happy to help! Let me know if you have any other questions."
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
    } else if (lowerMessage.includes('react')) {
      response = responses.react;
    } else if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
      response = responses.javascript;
    } else if (lowerMessage.includes('python')) {
      response = responses.python;
    } else if (lowerMessage.includes('thank')) {
      response = responses["thank you"];
    }

    // Simulate some delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: {
        id: Date.now(),
        conversation_id: conversation_id || 'demo-conversation',
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

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
});

// Default root route
app.get('/', (req, res) => {
  res.send(`
    <h1>BlockLearn Backend is running!</h1>
    <p>API available at: <a href="/api/health">/api/health</a></p>
    <p>Frontend should be at: <a href="http://localhost:5174">http://localhost:5174</a></p>
    <p>Server running on port: ${PORT}</p>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 BlockLearn Backend running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend should be at: http://localhost:5174`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});
