
import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface ReceitaCardProps {
  item: any;
   favoritado: boolean;
  toggleFavorito: (receitaId: string) => void;
}


export function ReceitaCard({ item, favoritado, toggleFavorito  }: ReceitaCardProps) {
  const [expandido, setExpandido] = useState(false);
  const [ setFavoritado ] = useState(false);

  return (
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
            {item.criadoPor || 'Usuário Desconecido'} {/* ← MOSTRA O NOME DO AUTOR */}
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
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: '#f0f0f0'
          }}
          resizeMode="cover"
        />
      ) : null}

      {/* Texto expansível */}
      <TouchableOpacity onPress={() => setExpandido(!expandido)} activeOpacity={0.7}>
        <Text 
          fontSize={14} 
          color="black" 
          numberOfLines={expandido ? undefined : 3}
          marginBottom="$1"
        >
          {item.texto}
        </Text>
        {item.texto && item.texto.length > 150 && (
          <Text fontSize={12} color="#2196F3" marginBottom="$2" fontWeight="bold">
            {expandido ? '▲ Ver menos' : '▼ Ver mais...'}
          </Text>
        )}
      </TouchableOpacity>

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
          
          onPress={() => toggleFavorito(item.id)}
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
        >
          <Ionicons name="share-outline" size={20} color="gray" />
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
}