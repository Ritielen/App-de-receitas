import React from "react";
import { Image, TouchableOpacity, Text } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider, XStack } from "tamagui";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import tamaguiConfig from "./tamagui.config";

import Login from "./Screens/Login";
import MainTabs from "./navigation/MainTabs";
import Register from "./Screens/Register";
import RecuperaSenha from "./Screens/RecuperaSenha";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined; //substitui home, categorias, favoritos, publicadas e IA
  Register: undefined;
  RecuperaSenha: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = React.useRef<any>(null);

  const deslogar = () => {
    signOut(auth).then(() => {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  return (
    <TamaguiProvider defaultConfig={tamaguiConfig}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={({ route, navigation }) => ({
            headerStyle: {
              backgroundColor: "#FFffff",
            },
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerTitle: () => (
              <XStack alignItems="center" gap="$2">
                <FontAwesome5 name="utensils" size={18} color="#FFB300" />

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#FF6B35",
                    fontFamily: "cursive",
                  }}
                >
                  Receitas
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#D84315",
                    fontStyle: "italic",
                  }}
                >
                  de
                </Text>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#FF6B35",
                    fontFamily: "cursive",
                  }}
                >
                  Família
                </Text>

                <FontAwesome5 name="utensils" size={18} color="#FFB300" />
              </XStack>
            ),
            // Botão da direita - Perfil e Sair
            headerRight: () => (
              <XStack gap={16} alignItems="center">
                <TouchableOpacity onPress={() => console.log("Perfil")}>
                  <Ionicons
                    name="person-circle-outline"
                    size={28}
                    color="#F6B35"
                  />
                </TouchableOpacity>

                {/* Só mostra botão sair se não estiver no Login/Register/RecuperaSenha */}
                {!["Login", "Register", "RecuperaSenha"].includes(
                  route.name,
                ) && (
                  <TouchableOpacity onPress={deslogar}>
                    <Ionicons name="exit-outline" size={24} color="#F6B35" />
                  </TouchableOpacity>
                )}
              </XStack>
            ),
            // Botão da esquerda - Voltar automático (some na Home)
            headerLeft: () => {
              if (route.name === "MainTabs") return null;

              return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              );
            },
          })}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="RecuperaSenha" component={RecuperaSenha} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}
