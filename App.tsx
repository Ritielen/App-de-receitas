
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TamaguiProvider, XStack } from 'tamagui';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import tamaguiConfig from './tamagui.config';

import Login from './Screens/Login';
import Home from './Screens/Home';
import Register from './Screens/Register';
import RecuperaSenha from './Screens/RecuperaSenha';
import Favoritos from './Screens/Favoritos';
import Categorias from './Screens/Categorias';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  RecuperaSenha: undefined;
  Favoritos: undefined;
  Categorias: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = React.useRef<any>(null);

  const deslogar = () => {
    signOut(auth).then(() => {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
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
              backgroundColor: '#FF6B6B',

            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Image
                source={require('./assets/logo.jpeg')}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,  
                  borderWidth: 2,
                  borderColor: 'white'

                }}
                resizeMode="contain"
              />
            ),
            // Botão da direita - Perfil e Sair
            headerRight: () => (
              <XStack gap={16} alignItems="center">
                <TouchableOpacity onPress={() => console.log('Perfil')}>
                  <Ionicons name="person-circle-outline" size={28} color="white" />
                </TouchableOpacity>

                {/* Só mostra botão sair se não estiver no Login/Register/RecuperaSenha */}
                {!['Login', 'Register', 'RecuperaSenha'].includes(route.name) && (
                  <TouchableOpacity onPress={deslogar}>
                    <Ionicons name="exit-outline" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </XStack>
            ),
            // Botão da esquerda - Voltar automático (some na Home)
            headerLeft: () => {
              if (route.name === 'Home') return null;

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
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="RecuperaSenha" component={RecuperaSenha} />
          <Stack.Screen name="Favoritos" component={Favoritos} />
          <Stack.Screen name="Categorias" component={Categorias} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}