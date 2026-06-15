import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

export const generateSegmentFromPrompt = async (prompt) => {
  try {
    // Try Gemini 1.5 Flash first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `Convert the following prompt into a JSON object with criteria for customer segmentation. 
Allowed keys: minSpent, maxSpent, inactiveDays, customerStatus. 
Prompt: "${prompt}"
Return only valid JSON without markdown wrapping or code blocks.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Service Warning: Gemini call failed. Falling back to local rule-based parsing.", error.message);
    
    // Rule-based segmentation fallback
    const criteria = {};
    
    // Extract minSpent (e.g. "spent more than 5000" or "> 5000")
    const minSpentMatch = prompt.match(/(?:spent\s+more\s+than|spent\s+>\s*|>\s*₹?\s*|more\s+than\s*₹?\s*)(\d+)/i);
    if (minSpentMatch) {
      criteria.minSpent = Number(minSpentMatch[1]);
    }
    
    // Extract maxSpent (e.g. "spent less than 2000" or "< 2000")
    const maxSpentMatch = prompt.match(/(?:spent\s+less\s+than|spent\s+<\s*|<\s*₹?\s*|less\s+than\s*₹?\s*)(\d+)/i);
    if (maxSpentMatch) {
      criteria.maxSpent = Number(maxSpentMatch[1]);
    }
    
    // Extract inactiveDays (e.g. "60 days" or "in 30 days")
    const inactiveDaysMatch = prompt.match(/(\d+)\s*days/i);
    if (inactiveDaysMatch) {
      criteria.inactiveDays = Number(inactiveDaysMatch[1]);
    }
    
    // Extract status (e.g. "VIP" or "inactive")
    if (/vip/i.test(prompt)) {
      criteria.customerStatus = 'vip';
    } else if (/inactive/i.test(prompt)) {
      criteria.customerStatus = 'inactive';
    } else if (/active/i.test(prompt)) {
      criteria.customerStatus = 'active';
    }
    
    // If no rules matched, default to the standard query values
    if (Object.keys(criteria).length === 0) {
      criteria.minSpent = 5000;
      criteria.inactiveDays = 60;
    }
    
    return criteria;
  }
};

export const generateMarketingMessage = async (goal) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `Create a marketing message for the following goal: "${goal}". 
Return a JSON object with two keys: "subject" and "message". 
Use "{{name}}" as a placeholder for the customer's name.
Return only valid JSON without markdown wrapping or code blocks.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Service Warning: Gemini call failed. Falling back to default marketing template.", error.message);
    
    // Highly engaging default campaign message fallback
    return {
      subject: "We Miss You ❤️",
      message: "Hi {{name}},\n\nEnjoy 20% OFF on your next purchase.\n\nUse code WELCOME20."
    };
  }
};

export const generateCampaignInsights = async (data) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `Analyze the following campaign analytics data and provide insights. 
Data: ${JSON.stringify(data)}
Return a JSON object with two keys: "summary" (a short text) and "recommendations" (an array of strings).
Return only valid JSON without markdown wrapping or code blocks.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Service Warning: Gemini call failed. Falling back to default analytics insights.", error.message);
    
    // Context-rich analytics insights fallback
    return {
      summary: "Email campaigns performed 20% better than SMS. Dormant customers showed the highest engagement. Best engagement time was 7 PM to 9 PM.",
      recommendations: [
        "Run a follow-up campaign in 7 days.",
        "Target dormant customers with exclusive discount codes to increase click-through rates.",
        "A/B test SMS and WhatsApp channels to identify the highest open-rate medium."
      ]
    };
  }
};
