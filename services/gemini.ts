import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "@env";

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export async function perguntarIA(pergunta: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // rápido e barato
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Você é um assistente simples e educado.

REGRAS IMPORTANTES:
- Se o usuário disser "oi", "olá", "bom dia", responda de forma curta e amigável (1 frase).
- NÃO gere receitas completas quando for apenas saudação.
- Só dê receitas quando o usuário pedir claramente.
- Se não for sobre comida, responda de forma leve e direcione para culinária.

Pergunta do usuário:
${pergunta}
              `,
            },
          ],
        },
      ],
    });

    const text = response.text;

    return text ?? "Não consegui gerar resposta.";
  } catch (error) {
    console.log("Erro IA:", error);
    return "Erro ao conectar com a IA";
  }
}