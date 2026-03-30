const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const { authenticateToken } = require('../middleware/auth');
const { getDB } = require('../config/database');

// Initialize AI Client (OpenAI, Groq, OpenRouter, etc.)
let openai = null;
const aiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const aiBaseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";

if (aiKey) {
  openai = new OpenAI({
    apiKey: aiKey,
    baseURL: aiBaseUrl,
  });
}

// This route serves as a proxy for AI services (OpenAI, Gemini, etc.)
// It prevents exposing API keys on the mobile client.
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, history, context } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        console.log(`AI Chat Request: "${message}"`);

        if (!openai) {
            // MOCK RESPONSE for development if no API key is provided
            console.warn("No AI API key found. Returning mock AI response.");
            
            let mockResponse = "I've analyzed your goal. Based on your current progress, I suggest focusing on mastering foundational concepts before moving to advanced frameworks.";
            
            if (message.toLowerCase().includes("blockchain") || message.toLowerCase().includes("web3")) {
                mockResponse = "Web3 is a great choice. You should start with Solidity and understanding the Ethereum Virtual Machine (EVM). I can help you build your first smart contract!";
            } else if (message.toLowerCase().includes("roadmap")) {
                mockResponse = "Based on your career goals, I recommend focusing on System Design and advanced Architecture patterns to become more job-ready.";
            } else if (message.toLowerCase().includes("hey") || message.toLowerCase().includes("hello")) {
                mockResponse = "Hello! I'm your MentorX AI Assistant. I can help you with career goals, learning roadmaps, and skill development. What's on your mind today?";
            }

            return res.json({
                success: true,
                answer: mockResponse,
                source: 'mock-assistant'
            });
        }

        // REAL INTEGRATION
        const tools = [
            {
                type: "function",
                function: {
                    name: "update_user_roadmap",
                    description: "Update the user's career goal, roadmap steps, and recommended skills.",
                    parameters: {
                        type: "object",
                        properties: {
                            goal: { type: "string", description: "The career goal (e.g., 'Fullstack Developer')" },
                            roadmap: {
                                type: "array",
                                description: "Detailed 5-8 step-by-step roadmap to achieve the goal.",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        title: { type: "string" },
                                        description: { type: "string", description: "Detailed explanation of what to learn in this step." },
                                        status: { type: "string", enum: ["completed", "current", "upcoming"] }
                                    }
                                }
                            },
                            skills: { type: "array", items: { type: "string" }, description: "Specific technical skills recommended." }
                        },
                        required: ["goal", "roadmap"]
                    }
                }
            }
        ];

        const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert career architect for MentorX. When generating a roadmap, always provide a COMPREHENSIVE 5-8 step plan. Each step must have a clear title and a detailed description of what exactly the user needs to learn or achieve. Ensure the roadmap is educational and actionable." },
                ...(history || []).map(h => ({ 
                    role: h.sender === 'user' ? 'user' : 'assistant', 
                    content: h.text || h.message || "" 
                })),
                { role: "user", content: message }
            ],
            tools: tools,
            tool_choice: "auto",
            max_tokens: 1500,
            temperature: 0.7,
        });

        const responseMessage = completion.choices[0].message;

        if (responseMessage.tool_calls) {
            const toolCall = responseMessage.tool_calls[0];
            if (toolCall.function.name === "update_user_roadmap") {
                const args = JSON.parse(toolCall.function.arguments);
                const userId = req.user.id;
                
                // Persist to database
                const db = await getDB();
                await db.collection('user_roadmaps').updateOne(
                    { user_id: userId },
                    { 
                        $set: { 
                            user_id: userId,
                            goal: args.goal,
                            roadmap: args.roadmap,
                            skills: args.skills || [],
                            updated_at: new Date()
                        } 
                    },
                    { upsert: true }
                );

                return res.json({ 
                    success: true, 
                    answer: `Roadmap for "${args.goal}" has been integrated into your account successfully! You can see it in your Roadmap tab.`,
                    source: 'ai-assistant',
                    action: 'roadmap_updated',
                    data: args
                });
            }
        }

        return res.json({ 
            success: true, 
            answer: responseMessage.content,
            source: 'ai-assistant'
        });

    } catch (error) {
        console.error("AI Route Error:", error);
        res.status(500).json({ success: false, message: "AI processing error: " + error.message });
    }
});

module.exports = router;
