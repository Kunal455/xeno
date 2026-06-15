import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Warning: GEMINI_API_KEY is missing from the environment variables.');
}

// Initialize and export the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey || 'dummy_key_for_development');

export default genAI;
