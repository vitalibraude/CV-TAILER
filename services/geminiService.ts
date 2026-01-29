
import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

export const tailorCV = async (originalCV: string, jobDescription: string): Promise<CVData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
              You are a world-class professional CV writer and career coach. 
              Below is an original CV and a Job Description. 
              Your task is to rewrite and tailor the CV to perfectly match the job requirements, highlighting relevant keywords and experience.
              The output MUST be in the same language as the input (Hebrer or English).
              
              Original CV:
              ${originalCV}

              Job Description:
              ${jobDescription}

              Please provide the tailored CV in the following JSON structure.
            `
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          linkedin: { type: Type.STRING },
          summary: { type: Type.STRING, description: "A tailored professional summary targeting the specific role." },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Tailored bullet points emphasizing relevant achievements."
                }
              },
              required: ["company", "role", "duration", "description"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                institution: { type: Type.STRING },
                degree: { type: Type.STRING },
                graduationYear: { type: Type.STRING }
              },
              required: ["institution", "degree", "graduationYear"]
            }
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant skills found in the job description."
          }
        },
        required: ["fullName", "email", "phone", "summary", "experience", "education", "skills"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text.trim()) as CVData;
};
