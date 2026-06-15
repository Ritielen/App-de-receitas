import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function salvarPerguntaResposta(
  pergunta: string,
  resposta: string
) {
  try {
    if (!pergunta.trim() || !resposta.trim()) {
      console.log("Pergunta ou resposta vazia");
      return;
    }

    await addDoc(collection(db, "perguntas_respostas"), {
      pergunta,
      resposta,
      criadoEm: serverTimestamp(),
      tipo: "receita_bolo",
    });

    console.log("Pergunta e resposta salvas com sucesso");
  } catch (error) {
    console.log("Erro ao salvar no Firestore:", error);
  }
}