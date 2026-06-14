// @ts-nocheck
import React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Platform, Image, Modal, StatusBar, TouchableOpacity, StyleSheet, } from 'react-native';

import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { YStack, XStack, Text, Button, Input, TextArea,  } from 'tamagui';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { ReceitaCard } from '../components/ReceitaCard'; // componente do card de receita

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  console.log('Categorias:', categorias);
  const navigation = useNavigation<HomeScreenProp>();

  const {
    novaReceita, setNovaReceita, receitas, receitaSelecionada, setReceitaSelecionada, 
    adicionarReceita, categorias, categoriaSelecionada, setCategoriaSelecionada, 
    modalVisible, setModalVisible, escolherOpcaoImagem, imagemPreview, fazendoUpload, 
    postarReceita,favoritos, toggleFavorito
  } = useHomeLogic();

  const deslogar = () => {
    signOut(auth).then(() => navigation.replace('Login'));
  };

  // Estados
  const [activeTab, setActiveTab] = useState('Inicio');
  const [showBox, setShowBox] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4">

        

        {/* Título */}
        <YStack>
          <Text fontSize={20} fontWeight="bold" marginBottom="$4" color="black">Bem-vindo ao Receita de Família. Onde a tradição ganha vida na cozinha.</Text>
        </YStack>

        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$4">
          {/* Caixa de publicação */}
          <TouchableOpacity
            style={styles.publishBox}
            onPress={() => setShowBox(true)}
          >
            <Text style={styles.publishText}>Publique sua receita!</Text>
          </TouchableOpacity>

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
                scrollEnabled={true}  // scroll interno
              />

              <Picker
                selectedValue={categoriaSelecionada}
                onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
                style={{ backgroundColor: 'white', marginBottom: 12 }}
              >
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
                  onPress={async () => {
                    await postarReceita();
                    setShowBox(false);
                  }}
                >
                  {fazendoUpload ? 'Enviando...' : 'Postar'}
                </Button>
              </XStack>

              {/* Preview da imagem selecionada antes de postar */}
              {imagemPreview ? (
                <Image
                  source={{ uri: imagemPreview }}
                  style={{ width: '100%', height: 150, borderRadius: 8, marginTop: 8 }}
                />
              ) : null}
            </YStack>
          )}

          {/* LISTA DE RECEITAS */}
          <FlatList
            data={receitas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ flex: 1, width: '100%' }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ReceitaCard
                item={item}
                favoritado={favoritos.includes(item.id)}
                toggleFavorito={toggleFavorito} />  // USANDO O COMPONENTE
            )}
          />

        </YStack>
      </YStack>


      <YStack
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="white"
        paddingVertical="$3"
        paddingBottom={Platform.OS === 'android' ? 60 : 60} // espaço extra no rodapé
      >

        <TouchableOpacity
          onPress={() => setActiveTab('Inicio')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="home" size={24} color={activeTab === 'Inicio' ? 'orange' : 'gray'} />
          <Text
            fontSize={12}
            color={activeTab === 'Inicio' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'Inicio' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Categorias')}
          style={{ alignItems: 'center' }}
        >
          <FontAwesome5 name="bread-slice" size={24} color={activeTab === 'Categorias' ? 'orange' : 'gray'} />
          <Text
            fontSize={12}
            color={activeTab === 'Categorias' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'Categorias' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            Categorias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Publicadas')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="bookmark-outline" size={24} color={activeTab === 'Publicadas' ? 'orange' : 'gray'} />

          <Text
            fontSize={12}
            color={activeTab === 'Publicadas' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'Publicadas' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            Publicadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Pesquisa')}
          style={{ alignItems: 'center' }}
        >
          <Feather name="search" size={24} color={activeTab === 'Pesquisa' ? 'orange' : 'gray'} />
          <Text
            fontSize={12}
            color={activeTab === 'Pesquisa' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'Pesquisa' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            Pesquisa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('IA')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="star" size={24} color={activeTab === 'IA' ? 'orange' : 'gray'} />
          <Text
            fontSize={12}
            color={activeTab === 'IA' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'IA' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            IA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Favoritos')}  // navegação
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} color={activeTab === 'Favoritos' ? 'orange' : 'gray'} />
          <Text
            fontSize={12}
            color={activeTab === 'Favoritos' ? 'orange' : 'gray'}
            fontWeight={activeTab === 'Favoritos' ? 'bold' : 'normal'}
            marginTop="$1"
          >
            Favoritos
          </Text>
        </TouchableOpacity>
      </YStack>


    </SafeAreaView>
  );
}

// Definição dos estilos
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  publishText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  button: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});