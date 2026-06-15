import { useState } from "react";
import { perguntarIA } from "../services/gemini";

type Message = {
  role: "user" | "ai";
  text: string;
};

export function useChatIA() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviarPergunta() {
    if (!input.trim()) return;

    const pergunta = input;

    // adiciona msg usuário
    setMessages((prev) => [
      ...prev,
      { role: "user", text: pergunta },
    ]);

    setInput("");
    setCarregando(true);

    try {
      const resposta = await perguntarIA(pergunta);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: resposta },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Erro ao gerar resposta" },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return {
    messages,
    input,
    setInput,
    carregando,
    enviarPergunta,
  };
}