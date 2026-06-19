import React, { useState } from 'react';
import {
  TouchableOpacity, Image, Modal, ScrollView, Dimensions, Share, Alert, Linking, Platform
} from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface ReceitaCardProps {
  item: any;
  favoritado: boolean;
  toggleFavorito: (receitaId: string) => void;
  fotoUsuarioLogado?: string;
}

export function ReceitaCard({ item, favoritado, toggleFavorito }: ReceitaCardProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  // FUNÇÃO DE COMPARTILHAR RECEITA
  const compartilharReceita = async (receita) => {
    try {
      const dataCriacao = receita.criadoEm?.toDate
        ? receita.criadoEm.toDate().toLocaleDateString('pt-BR')
        : receita.criadoEm
          ? new Date(receita.criadoEm).toLocaleDateString('pt-BR')
          : 'Data não disponível';

      const mensagem = `🍽️ *Receitas de Família* 🍽️\n\n` +
        `📋 *${receita.texto?.substring(0, 100) || 'Receita Especial'}${receita.texto?.length > 100 ? '...' : ''}*\n\n` +
        `👨‍🍳 *Criado por:* ${receita.criadoPor || 'Família'}\n` +
        `📅 *Data:* ${dataCriacao}\n` +
        `📂 *Categoria:* ${receita.categoria || 'Geral'}\n\n` +
        `--------------------------------\n\n` +
        `📱 *Compartilhado do App Receitas de Família* 🍽️\n\n` +
        `Baixe o app e descubra mais receitas deliciosas! 🥘👩‍🍳`;

      const result = await Share.share({
        message: mensagem,
        title: `Receita de Família - ${receita.criadoPor || 'Família'}`,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('✅ Sucesso!', 'Receita compartilhada com sucesso!');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível compartilhar a receita');
      console.error('Erro ao compartilhar:', error);
    }
  };

  const compartilharWhatsApp = async (receita) => {
    try {
      const dataCriacao = receita.criadoEm?.toDate
        ? receita.criadoEm.toDate().toLocaleDateString('pt-BR')
        : receita.criadoEm
          ? new Date(receita.criadoEm).toLocaleDateString('pt-BR')
          : 'Data não disponível';

      const mensagem = encodeURIComponent(
        `🍽️ *Receitas de Família* 🍽️\n\n` +
        `📋 *${receita.texto?.substring(0, 100) || 'Receita Especial'}${receita.texto?.length > 100 ? '...' : ''}*\n\n` +
        `👨‍🍳 *Criado por:* ${receita.criadoPor || 'Família'}\n` +
        `📅 *Data:* ${dataCriacao}\n` +
        `📂 *Categoria:* ${receita.categoria || 'Geral'}\n\n` +
        `--------------------------------\n\n` +
        `📱 *Compartilhado do App Receitas de Família* 🍽️\n\n` +
        `Baixe o app e descubra mais receitas deliciosas! 🥘👩‍🍳`
      );

      const url = Platform.select({
        ios: `whatsapp://send?text=${mensagem}`,
        android: `whatsapp://send?text=${mensagem}`
      });

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await compartilharReceita(receita);
      }
    } catch (error) {
      console.error('Erro WhatsApp:', error);
      await compartilharReceita(receita);
    }
  };

  const compartilharComOpcoes = (receita) => {
    Alert.alert(
      '📤 Compartilhar Receita',
      'Escolha como compartilhar:',
      [
        {
          text: '📱 WhatsApp',
          onPress: () => compartilharWhatsApp(receita),
        },
        {
          text: '🔄 Outros Apps',
          onPress: () => compartilharReceita(receita),
        },
        {
          text: '❌ Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <>
      {/* Card Principal */}
      <TouchableOpacity
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.9}
      >
        <YStack
          backgroundColor="white"
          borderRadius={12}
          padding="$4"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$gray5"
          width="100%"
        >
          
          {/* Cabeçalho */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
            <XStack alignItems="center" gap={8}>
              <YStack
                width={30} height={30} borderRadius={15}
                backgroundColor="#f0f0f0"
                justifyContent="center" alignItems="center"
                overflow="hidden"
                borderWidth={2}
                borderColor={item.fotoPerfil ? '#007BFF' : '#ccc'}
              >
                {item.fotoPerfil ? (
                  <Image
                    source={{ uri: item.fotoPerfil }}
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={16} color="#999" />
                )}
              </YStack>
              <Text fontSize={14} color="$gray10" fontWeight="bold">
                {item.criadoPor || 'Usuário Desconhecido'}
              </Text>
            </XStack>
            <Text fontSize={12} color="$gray8">
              {item.criadoEm?.toDate
                ? item.criadoEm.toDate().toLocaleString('pt-BR')
                : item.criadoEm ? new Date(item.criadoEm).toLocaleString('pt-BR') : ''}
            </Text>
          </XStack>


          {/* Categoria */}
          <XStack backgroundColor="#FFF3E0" paddingHorizontal="$2" paddingVertical="$1" borderRadius={4} alignSelf="flex-start" marginBottom="$2">
            <Text fontSize={12} color="orange" fontWeight="bold">
              {item.categoria}
            </Text>
          </XStack>

          {/* Imagem */}
          {item.imagem ? (
            <Image
              source={{ uri: item.imagem }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
                marginBottom: 12,
                backgroundColor: '#f0f0f0'
              }}
              resizeMode="cover"
            />
          ) : null}

          {/* Texto resumido */}
          <Text
            fontSize={14}
            color="black"
            numberOfLines={3}
            marginBottom="$1"
          >
            {item.texto}
          </Text>

          {item.texto && item.texto.length > 150 && (
            <Text fontSize={12} color="#2196F3" marginBottom="$2" fontWeight="bold">
              Toque para ver mais...
            </Text>
          )}

          {/* Botões de ação */}
          <XStack gap="$2" justifyContent="flex-end" marginTop="$2">
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: favoritado ? '#FFE0E0' : '#f0f0f0',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorito(item.id);
              }}
            >
              <Ionicons
                name={favoritado ? "heart" : "heart-outline"}
                size={20}
                color={favoritado ? "red" : "gray"}
              />
            </TouchableOpacity>

            {/* Botão de compartilhar  */}
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#f0f0f0',
              }}
              onPress={(e) => {
                e.stopPropagation(); // Impede que o card inteiro seja clicado
                compartilharComOpcoes(item); // Passa o item completo
              }}
            >


              <Ionicons name="share-outline" size={20} color="gray" />
            </TouchableOpacity>
          </XStack>
        </YStack>
      </TouchableOpacity>

      {/* Modal para visualização completa */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <YStack flex={1} backgroundColor="white">
          {/* Header do Modal */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding="$4"
            borderBottomWidth={1}
            borderBottomColor="$gray5"
            backgroundColor="white"
          >
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <XStack alignItems="center" gap="$2">
                <Ionicons name="arrow-back" size={24} color="#2196F3" />
                <Text color="#2196F3" fontWeight="bold">Voltar</Text>
              </XStack>
            </TouchableOpacity>

            <Text fontSize={16} fontWeight="bold" numberOfLines={1} maxWidth={200}>
              {item.titulo || 'Receita'}
            </Text>

            <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
              <Ionicons
                name={favoritado ? "heart" : "heart-outline"}
                size={24}
                color={favoritado ? "red" : "gray"}
              />
            </TouchableOpacity>
          </XStack>

          {/* Conteúdo do Modal */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* Informações do autor e data */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <XStack alignItems="center" gap={8}>
                {/* Avatar da foto */}
                <YStack
                  width={30}
                  height={30}
                  borderRadius={15}
                  backgroundColor="#f0f0f0"
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                  borderWidth={2}
                  borderColor={item.fotoPerfil ? '#007BFF' : '#ccc'}
                >
                  {item.fotoPerfil ? (
                    <Image
                      source={{ uri: item.fotoPerfil }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="person" size={16} color="#999" />
                  )}
                </YStack>

                <YStack>
                  <Text fontSize={14} color="$gray10" fontWeight="bold">
                    {item.criadoPor || 'Usuário Desconhecido'}
                  </Text>
                </YStack>
              </XStack>

              <Text fontSize={12} color="$gray8">
                {item.criadoEm?.toDate
                  ? item.criadoEm.toDate().toLocaleString('pt-BR')
                  : item.criadoEm ? new Date(item.criadoEm).toLocaleString('pt-BR') : ''}
              </Text>
            </XStack>

            {/* Categoria no modal */}
            <XStack
              backgroundColor="#FFF3E0"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius={4}
              alignSelf="flex-start"
              marginBottom="$4"
            >
              <Text fontSize={14} color="orange" fontWeight="bold">
                {item.categoria}
              </Text>
            </XStack>

            {/* Imagem no modal (maior) */}
            {item.imagem ? (
              <Image
                source={{ uri: item.imagem }}
                style={{
                  width: '100%',
                  height: 300,
                  borderRadius: 12,
                  marginBottom: 20,
                  backgroundColor: '#f0f0f0'
                }}
                resizeMode="cover"
              />
            ) : null}

            {/* Texto completo */}
            <Text fontSize={16} color="black" lineHeight={24}>
              {item.texto}
            </Text>

            {/* Seção de ingredientes (opcional) */}
            {item.ingredientes && (
              <YStack marginTop="$4">
                <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$2">
                  Ingredientes:
                </Text>
                <Text fontSize={16} color="black" lineHeight={24}>
                  {item.ingredientes}
                </Text>
              </YStack>
            )}

            {/* Botão de compartilhar no modal */}
            <TouchableOpacity
              style={{
                backgroundColor: '#2196F3',
                padding: 16,
                borderRadius: 12,
                marginTop: 20,
                marginBottom: 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => compartilharComOpcoes(item)}
            >
              <Ionicons name="share-outline" size={20} color="white" />
              <Text color="white" fontWeight="bold" fontSize={16}>
                Compartilhar Receita
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </YStack>
      </Modal>
    </>
  );
}