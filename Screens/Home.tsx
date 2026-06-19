import React, { useState } from 'react';
import {
  FlatList, SafeAreaView, Platform, Image,
  StatusBar, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHomeLogic } from '../hooks/useHomeLogic';
import { YStack, XStack, Text, Button, TextArea, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ReceitaCard } from '../components/ReceitaCard';

export default function Home() {
  const insets = useSafeAreaInsets();

  const {
    novaReceita, setNovaReceita, receitas,
    categorias, categoriaSelecionada, setCategoriaSelecionada,
    escolherOpcaoImagem, imagemPreview, fazendoUpload,
    postarReceita, favoritos, toggleFavorito, busca, setBusca, receitasFiltradas
  } = useHomeLogic();

  const [showBox, setShowBox] = useState(false);

  const handleCancelar = () => {
    setShowBox(false);
  };

  const handlePostar = async () => {
    await postarReceita();
    setShowBox(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4">

        <YStack>
          <Text fontSize={20} fontWeight="bold" marginBottom="$4" color="black">
            Bem-vindo ao Receita de Família. Onde a tradição ganha vida na cozinha.
          </Text>
        </YStack>

        <YStack flex={1} alignItems="center" gap="$4">

          {/* Botão publicar / cancelar */}
          <TouchableOpacity
            style={[styles.publishBox, showBox && styles.cancelBox]}
            onPress={showBox ? handleCancelar : () => setShowBox(true)}
          >
            <XStack gap="$2" alignItems="center">
              <Ionicons
                name={showBox ? 'close-circle-outline' : 'add-circle-outline'}
                size={22}
                color="white"
              />
              <Text style={styles.publishText}>
                {showBox ? 'Cancelar publicação' : 'Publique sua receita!'}
              </Text>
            </XStack>
          </TouchableOpacity>

          {/* Formulário de publicação */}
          {showBox && (
            <YStack
              width="100%"
              backgroundColor="white"
              padding="$4"
              gap="$3"
              borderRadius={12}
            >
              <TextArea
                placeholder="Guarde e compartilhe suas melhores memórias ao redor da mesa. Poste sua receita de família."
                value={novaReceita}
                onChangeText={setNovaReceita}
                minHeight={200}
                maxHeight={400}
                backgroundColor="white"
                borderWidth={1}
                borderColor="$gray5"
                padding="$3"
                color="black"
                scrollEnabled
              />

              <Picker
                selectedValue={categoriaSelecionada}
                onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
                style={{ backgroundColor: 'white', marginBottom: 12 }}
              >
                <Picker.Item
                  label="Selecione uma categoria..."
                  value=""
                  color="#999"
                />
                {categorias.map((cat, index) => (
                  <Picker.Item key={index} label={cat} value={cat} />
                ))}
              </Picker>

              <XStack gap="$3" justifyContent="space-between">
                <Button
                  icon={<Ionicons name="image" size={20} color="white" />}
                  backgroundColor="$blue10"
                  flex={1}
                  onPress={escolherOpcaoImagem}
                >
                  {imagemPreview ? 'Trocar Imagem' : 'Imagem'}
                </Button>

                <Button
                  icon={<Ionicons name="send" size={20} color="white" />}
                  backgroundColor="$green10"
                  flex={1}
                  disabled={fazendoUpload}
                  onPress={handlePostar}
                >
                  {fazendoUpload ? 'Enviando...' : 'Postar'}
                </Button>
              </XStack>

              {imagemPreview && (
                <Image
                  source={{ uri: imagemPreview }}
                  style={{ width: '100%', height: 150, borderRadius: 8, marginTop: 8 }}
                />
              )}
            </YStack>
          )}

          <Input
            placeholder="Buscar receita..."
            value={busca}
            onChangeText={setBusca}
            width="100%"
            backgroundColor="white"
            borderWidth={1}
            borderColor="$gray5"
            marginBottom="$3"
          />

          {/* Lista de receitas */}
          <FlatList
            data={receitasFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            style={{ flex: 1, width: '100%' }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ReceitaCard
                item={item}
                favoritado={favoritos.includes(item.id)}
                toggleFavorito={toggleFavorito}
              />
            )}
          />

        </YStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  publishBox: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cancelBox: {
    backgroundColor: '#999',
  },
  publishText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});