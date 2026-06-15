import React, { useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  View,
  FlatList,
} from "react-native";

import { YStack, XStack, Text, Button, TextArea } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

import { useChatIA } from "../hooks/useChatIA";

export default function IA() {
  const { messages, input, setInput, carregando, enviarPergunta } =
    useChatIA();

  const listRef = useRef<FlatList>(null);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1 }}>
          
          {/* HEADER */}
          <Text fontSize={20} fontWeight="bold" padding="$4">
            IA Confeiteira 🍰
          </Text>

          {/* CHAT */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 10,
            }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <YStack
                alignSelf={item.role === "user" ? "flex-end" : "flex-start"}
                backgroundColor={
                  item.role === "user" ? "#DCF8C6" : "white"
                }
                padding="$3"
                marginVertical={5}
                borderRadius={12}
                maxWidth="80%"
              >
                <Text color="black">{item.text}</Text>
              </YStack>
            )}
          />

          {carregando && (
            <Text padding="$2" color="#999">
              IA digitando...
            </Text>
          )}

          {/* INPUT */}
          <XStack
            gap="$2"
            alignItems="center"
            padding="$3"
            backgroundColor="#f5f5f5"
          >
            <TextArea
              flex={1}
              value={input}
              onChangeText={setInput}
              placeholder="Pergunte uma receita..."
              backgroundColor="white"
              borderRadius={10}
            />

            <Button
              onPress={enviarPergunta}
              backgroundColor="$green10"
              icon={<Ionicons name="send" size={18} color="white" />}
            />
          </XStack>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop:
      Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});