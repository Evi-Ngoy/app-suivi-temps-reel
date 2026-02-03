
import { GoogleGenAI } from "@google/genai";

export const getBusinessInsights = async (sales, inventory, userMessage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    Tu es l'assistant personnel d'un entrepreneur prospère. 
    Tu as accès à ses données en temps réel :
    Ventes récentes : ${JSON.stringify(sales.slice(0, 5))}
    Inventaire actuel : ${JSON.stringify(inventory)}
    
    Réponds de manière concise, professionnelle et donne des conseils stratégiques basés sur ces chiffres.
    Ton ton doit être encourageant mais réaliste.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "Désolé, je ne peux pas analyser cela pour le moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Une erreur est survenue lors de la consultation de l'IA.";
  }
};
