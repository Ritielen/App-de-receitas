import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";

import {
  XStack,
  Text,
  Button,
  TextArea,
} from "tamagui";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { useChatIA } from "../hooks/useChatIA";

type Historico = {
  id: string;
  pergunta: string;
  resposta: string;
};

export default function IA() {
  const {
    input,
    setInput,
    carregando,
    enviarPergunta,
    mensagensFiltradas,
  } = useChatIA();

  const [modalVisible, setModalVisible] = useState(false);
  const [historico, setHistorico] = useState<Historico[]>([]);

  const listRef = useRef<FlatList>(null);

  async function carregarHistorico() {
    try {
      const q = query(
        collection(db, "perguntas_respostas"),
        orderBy("criadoEm", "desc")
      );

      const snapshot = await getDocs(q);

      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Historico[];

      setHistorico(dados);
    } catch (error) {
      console.log("Erro ao carregar histórico:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titulo}>
              IA Confeiteira 🍰
            </Text>

            <Text style={styles.subtitulo}>
              Receitas, dicas e inspirações para sua cozinha
            </Text>
          </View>

          {/* BOTÃO HISTÓRICO */}
          <TouchableOpacity
            style={styles.busca}
            onPress={() => {
              carregarHistorico();
              setModalVisible(true);
            }}
          >
            <Text>🔍 Conversas anteriores</Text>
          </TouchableOpacity>

          {/* CHAT */}
          <FlatList
            ref={listRef}
            data={mensagensFiltradas}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                style={
                  item.role === "user"
                    ? styles.mensagemUsuario
                    : styles.mensagemIA
                }
              >
                <Text style={styles.textoMensagem}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          {carregando && (
            <Text style={styles.digitando}>
              IA digitando...
            </Text>
          )}

          {/* INPUT */}
          <XStack style={styles.footer} gap="$2">
            <TextArea
              flex={1}
              value={input}
              onChangeText={setInput}
              placeholder="Pergunte uma receita..."
              style={styles.input}
            />

            <Button
              disabled={carregando}
              style={styles.botaoEnviar}
              onPress={enviarPergunta}
              icon={
                <Ionicons
                  name="send"
                  size={20}
                  color="white"
                />
              }
            />
          </XStack>

          {/* MODAL HISTÓRICO */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Conversas Anteriores
                </Text>

                <Button
                  onPress={() => setModalVisible(false)}
                >
                  Fechar
                </Button>
              </View>

              <FlatList
                data={historico}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: "#FFF",
                      marginHorizontal: 15,
                      marginVertical: 6,
                      padding: 15,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      Pergunta:
                    </Text>

                    <Text style={{ marginBottom: "$3" }}>
                      {item.pergunta}
                    </Text>

                    <Text style={{ fontWeight: "bold" }}>
                      Resposta:
                    </Text>

                    <Text>
                      {item.resposta}
                    </Text>
                  </View>
                )}
              />
            </SafeAreaView>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight
        : 0,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#5A3825",
  },

  subtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: "#8C6A56",
  },

  busca: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  lista: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },

  mensagemUsuario: {
    alignSelf: "flex-end",
    backgroundColor: "#D9A679",
    padding: 14,
    borderRadius: 22,
    marginVertical: 5,
    maxWidth: "80%",
  },

  mensagemIA: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 22,
    marginVertical: 5,
    maxWidth: "80%",
  },

  textoMensagem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3A2B23",
  },

  digitando: {
    textAlign: "center",
    color: "#8C6A56",
    marginBottom: 8,
  },

  footer: {
    padding: 12,
    backgroundColor: "#FFFDFB",
    borderTopWidth: 1,
    borderTopColor: "#F1E5DA",
    alignItems: "flex-end",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    minHeight: 50,
  },

  botaoEnviar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C97B42",
  },
});

