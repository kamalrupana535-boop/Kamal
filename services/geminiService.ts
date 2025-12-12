import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GroundingChunk, LocationCoordinates } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Sends a message to the medical assistant chatbot.
 * Uses a system instruction to tailor the persona for rural Indian context.
 */
export const createMedicalChat = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `You are GraminHealth, a helpful and empathetic medical assistant designed for people living in rural India, specifically farmers. 
      
      Your goals:
      1. Provide clear, simple, and accurate medical guidance in English (but tailored for non-native speakers if needed).
      2. If a situation sounds like an emergency (heart attack, snake bite, severe injury), immediately advise calling an ambulance (102/108) or going to the nearest hospital.
      3. Be culturally aware of rural Indian settings (farms, distance to clinics).
      4. Do not provide definitive diagnoses; always suggest consulting a doctor.
      5. Keep responses concise and easy to read on mobile phones.`,
      temperature: 0.7,
    },
  });
};

/**
 * Finds nearby hospitals using Google Maps Grounding.
 */
export const findNearbyHospitals = async (
  location: LocationCoordinates
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Find the nearest hospitals, health centers, and emergency clinics. Sort them by distance and mention if they are open 24/7.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text || "I found some locations nearby.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { text, chunks };
  } catch (error) {
    console.error("Error finding hospitals:", error);
    throw error;
  }
};
