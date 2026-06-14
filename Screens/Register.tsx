import React, { useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Importando o nosso novo Hook!
import { useRegisterLogic } from '../hooks/useRegisterLogic';

// Importações do Tamagui
import { YStack, Text, Input, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Importação do DateTimePicker
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const navigation = useNavigation<RegisterScreenProp>();
  
  const { 
    nome, 
    sobrenome, 
    email, 
    setNome, 
    setSobrenome, 
    setEmail, 
    senha, 
    setSenha, 
    cadastrar, 
    carregando,
    dataNascimento,      
    setDataNascimento    
  } = useRegisterLogic();

  // Estados para o DatePicker
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = () => {
    cadastrar(); 
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate);
      
      // Formatação da data para o Firestore
      const dia = selectedDate.getDate().toString().padStart(2, '0');
      const mes = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const ano = selectedDate.getFullYear();
      
      // Atualizar o estado dataNascimento do hook
      setDataNascimento(`${dia}/${mes}/${ano}`);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };


  const formatarDataExibicao = () => {
    if (!dataNascimento) return 'Data de Nascimento';
    return dataNascimento;
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

            {/* Campo de Data de Nascimento */}
            <YStack>
              <Button
                backgroundColor="#f9f9f9"
                borderColor={dataNascimento ? "#007BFF" : "#ccc"}
                borderWidth={1}
                color={dataNascimento ? "#333" : "#999"}
                onPress={showDatepicker}
                icon={<Ionicons name="calendar" size={18} color="#666" />}
                justifyContent="flex-start"
              >
                {formatarDataExibicao()}
              </Button>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDate}
                  maximumDate={new Date()} // Não permite datas futuras
                  minimumDate={new Date(1900, 0, 1)} // Data mínima
                />
              )}
            </YStack>

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
              backgroundColor="#007BFF"
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