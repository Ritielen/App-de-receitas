import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Nosso novo Hook!
import { useRecuperaSenhaLogic } from '../hooks/useRecuperarSenhaLogic';

// Importações do Tamagui
import { YStack, Text, Input, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

type RecoverScreenProp = NativeStackNavigationProp<RootStackParamList, 'RecuperaSenha'>;

export default function RecuperaSenha() {
  const navigation = useNavigation<RecoverScreenProp>();
  
  const { email, setEmail, recuperar, carregando } = useRecuperaSenhaLogic();

  const handleRecuperar = () => {
    recuperar(() => navigation.goBack());
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
            <Text fontSize={28} fontWeight="bold" textAlign="center" color="#333" marginBottom={5}>
              Recuperar Senha
            </Text>

            <Text fontSize={14} color="#666" textAlign="center" marginBottom={10}>
              Digite o seu e-mail abaixo. Enviaremos um link para você redefinir sua senha.
            </Text>

            <Input 
              placeholder="E-mail cadastrado" 
              autoCapitalize="none"
              keyboardType="email-address"
              value={email} 
              onChangeText={(text) => setEmail(text)} 
              color="#333"
              placeholderTextColor="#999"
              backgroundColor="#f9f9f9"
              borderColor="#ccc"
            />

            <Button 
              backgroundColor="#FF9500" // Cor laranja para combinar com o botão do Login
              color="#fff" 
              onPress={handleRecuperar}
              disabled={carregando}
              opacity={carregando ? 0.6 : 1}
              marginTop={10}
            >
              {carregando ? 'Enviando Link...' : 'Enviar Link de Recuperação'}
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