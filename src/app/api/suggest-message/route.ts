//!remember that if error happens over here then dont worry the only thing thats holding back is paisa nothing else
//here we will be using the ai feature of gemini to just make a api call to gemini to get the message suggestions
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Define the prompt for message suggestions
        const prompt = `Create 3 engaging and thoughtful anonymous feedback messages for a feedback platform. The messages should be:
        - Constructive and positive
        - Suitable for anonymous feedback
        - Encouraging personal growth
        - Professional yet friendly
        - Between 20-100 characters each
        
        Format the response as a simple array of strings. No numbering, no extra formatting.
        
        Example format:
        ["Your presentation skills have improved tremendously!", "Keep up the great work on your coding projects!", "Your teamwork makes a real difference!"]`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse the response as JSON array
        let suggestions: string[];
        try {
            suggestions = JSON.parse(text);
        } catch (parseError) {
            // If parsing fails, split by lines and clean up
            suggestions = text
                .split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
                .filter(line => line.length > 10)
                .slice(0, 3);
        }

        // Ensure we have exactly 3 suggestions
        if (suggestions.length < 3) {
            suggestions = [
                "Your positive attitude brightens everyone's day!",
                "Keep pushing boundaries and exploring new ideas!",
                "Your dedication to excellence is truly inspiring!"
            ];
        }

        return Response.json({
            success: true,
            messages: suggestions.slice(0, 3)
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating suggestions:', error);
        
        // Fallback suggestions if API fails
        const fallbackSuggestions = [
            "Your creativity and innovation stand out in everything you do!",
            "Your communication skills make complex topics easy to understand!",
            "Your reliability and consistency are truly appreciated!"
        ];

        return Response.json({
            success: true,
            messages: fallbackSuggestions,
            note: "Using fallback suggestions due to API limitation"
        }, { status: 200 });
    }
}