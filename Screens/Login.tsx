import React from 'react';

import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';


import { YStack, XStack, Text, Input, Button, Card } from 'tamagui';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginScreenProp>();
  

  const { email, setEmail, senha, setSenha, logar, carregando } = useLoginLogic();

  const handleLogin = () => {
    
    logar(() => navigation.replace('MainTabs'));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
          
       
          <Card 
            elevate 
            size="$4" 
            bordered 
            padding={24} 
            width="100%" 
            maxWidth={400} 
            backgroundColor="#fff" 
            borderRadius={12} 
            gap={16}
          >
            <Text fontSize={28} fontWeight="bold" textAlign="center" color="#333" marginBottom={10}>
              Login
            </Text>

            
            <Input 
              placeholder="E-mail" 
              autoCapitalize="none"
              keyboardType="email-address"
              value={email} 
              onChangeText={(text) => setEmail(text)} 
              color="#333"
              placeholderTextColor="#999"
              backgroundColor="#f9f9f9"
              borderColor="#ccc"
            />

            <Input 
              placeholder="Senha" 
              secureTextEntry 
              value={senha} 
              onChangeText={(text) => setSenha(text)} 
              color="#333"
              placeholderTextColor="#999"
              backgroundColor="#f9f9f9"
              borderColor="#ccc"
            />

            <Button 
              backgroundColor="#28A745" 
              color="#fff" 
              onPress={handleLogin}
              disabled={carregando}
              opacity={carregando ? 0.6 : 1}
              marginTop={10}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>

            <YStack gap={10} marginTop={10}>
              <Button 
                variant="outlined" 
                borderColor="#007BFF" 
                color="#007BFF" 
                onPress={() => navigation.navigate('Register')}
              >
                Criar conta
              </Button>
              
              <Button 
                variant="outlined" 
                borderColor="#FF9500" 
                color="#FF9500" 
                onPress={() => navigation.navigate('RecuperaSenha')}
              >
                Esqueceu a senha?
              </Button>
            </YStack>
            
          </Card>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}