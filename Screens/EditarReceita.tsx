import React from 'react';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useEditarReceita } from '../hooks/useEditarReceita';

export default function EditarReceita() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as { item: any };

  const {
    texto,
    setTexto,
    imagemPreview,
    fazendoUpload,
    salvando,
    escolherOpcaoImagem,
    salvar,
  } = useEditarReceita(item);

  const handleSalvar = async () => {
    const sucesso = await salvar();
    if (sucesso) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1} padding={20} gap={20}>
          {/* Cabeçalho */}
          <Text fontSize={24} fontWeight="bold" marginBottom="$2">
            Editar Receita
          </Text>

          {/* Campo de Imagem */}
          <YStack gap="$3">
            <XStack gap="$3" justifyContent="space-between">
              <Button
                icon={<Ionicons name="image" size={20} color="white" />}
                backgroundColor="$blue10"
                flex={1}
                onPress={escolherOpcaoImagem}
                disabled={fazendoUpload}
              >
                {imagemPreview ? 'Trocar Imagem' : 'Adicionar Imagem'}
              </Button>

              <Button
                icon={<Ionicons name="save" size={20} color="white" />}
                backgroundColor="$green10"
                flex={1}
                disabled={fazendoUpload || salvando}
                onPress={handleSalvar}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </Button>
            </XStack>

            {imagemPreview && (
              <Image
                source={{ uri: imagemPreview }}
                style={{ 
                  width: '100%', 
                  height: 200, 
                  borderRadius: 12, 
                  marginTop: 8 
                }}
                resizeMode="cover"
              />
            )}

            {fazendoUpload && (
              <Text color="$blue10" textAlign="center" fontSize={14}>
                Enviando imagem...
              </Text>
            )}
          </YStack>

          {/* Campo de Texto */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="bold">
              Texto da Receita
            </Text>
            <Input
              placeholder="Descreva sua receita..."
              value={texto}
              onChangeText={setTexto}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              minHeight={200}
              padding={12}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius={8}
            />
          </YStack>

          {/* Botão Cancelar */}
          <Button
            backgroundColor="$gray5"
            color="$gray12"
            onPress={() => navigation.goBack()}
            icon={<Ionicons name="close-circle" size={20} color="$gray12" />}
          >
            Cancelar
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
