import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Importando o nosso novo Hook!
import { useRegisterLogic } from '../hooks/useRegisterLogic';

// Importações do Tamagui
import { YStack, Text, Input, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const navigation = useNavigation<RegisterScreenProp>();
  
  const { nome, sobrenome, email, setNome, setSobrenome, setEmail, senha, setSenha, cadastrar, carregando } = useRegisterLogic();

  const handleRegister = () => {
    cadastrar(() => navigation.replace('Home'));
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
              Cadastro
            </Text>

            <Input 
              placeholder="Nome" 
              value={nome} 
              onChangeText={(text) => setNome(text)} 
              color="#333"
              placeholderTextColor="#999"
              backgroundColor="#f9f9f9"
              borderColor="#ccc"
            />

            <Input 
              placeholder="Sobrenome" 
              value={sobrenome} 
              onChangeText={(text) => setSobrenome(text)} 
              color="#333"
              placeholderTextColor="#999"
              backgroundColor="#f9f9f9"
              borderColor="#ccc"
            />
            
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
              backgroundColor="#007BFF" // Azul para diferenciar da tela de login
              color="#fff" 
              onPress={handleRegister}
              disabled={carregando}
              opacity={carregando ? 0.6 : 1}
              marginTop={10}
            >
              {carregando ? 'Criando conta...' : 'Cadastrar'}
            </Button>

            <YStack marginTop={10}>
              <Button 
                variant="outlined" 
                borderColor="#ccc" 
                color="#666" 
                icon={<Ionicons name="arrow-back" size={18} color="#666" />}
                onPress={() => navigation.goBack()}
              >
                Voltar ao Login
              </Button>
            </YStack>
            
          </Card>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}