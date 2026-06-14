import React, { useState } from 'react';
import { TouchableOpacity, Image, Modal, ScrollView, Dimensions } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface ReceitaCardProps {
  item: any;
  favoritado: boolean;
  toggleFavorito: (receitaId: string) => void;
}

export function ReceitaCard({ item, favoritado, toggleFavorito }: ReceitaCardProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const screenHeight = Dimensions.get('window').height;

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
            <YStack>
              <Text fontSize={14} color="$gray10" fontWeight="bold">
                {item.criadoPor || 'Usuário Desconhecido'}
              </Text>
            </YStack>
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

            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#f0f0f0',
              }}
              onPress={(e) => {
                e.stopPropagation();
                //  lógica para compartilhar
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
              <YStack>
                <Text fontSize={14} color="$gray10" fontWeight="bold">
                  {item.criadoPor || 'Usuário Desconhecido'}
                </Text>
              </YStack>
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