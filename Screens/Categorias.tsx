import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons, } from '@expo/vector-icons';
import { ReceitaCard } from '../components/ReceitaCard';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2; 

type CategoriasScreenProp = NativeStackNavigationProp<RootStackParamList, 'Categorias'>;

// Dados das categorias
const categoriasData = [
  { id: '1', nome: 'Bebidas', imagem: require('../assets/bebidas.jpg') },
  { id: '2', nome: 'Bolos e tortas', imagem: require('../assets/bolos-tortas.jpg') },
  { id: '3', nome: 'Carnes', imagem: require('../assets/carnes.jpg') },
  { id: '4', nome: 'Massas', imagem: require('../assets/massas.jpg') },
  { id: '5', nome: 'Peixes e frutos do mar', imagem: require('../assets/frutos do mar.jpg') },
  { id: '6', nome: 'Acompanhamentos', imagem: require('../assets/acompanhamentos.jpg') },
  { id: '7', nome: 'Lanches', imagem: require('../assets/lanche.jpg') },
  { id: '8', nome: 'Alimentação Saudável', imagem: require('../assets/saudavel.jpg') },
];

export default function Categorias() {
  const navigation = useNavigation<CategoriasScreenProp>();
  const { favoritos, toggleFavorito, fotoUsuario } = useHomeLogic();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [receitasCategoria, setReceitasCategoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // RESETAR CATEGORIA QUANDO A TELA RECEBER FOCO
  useFocusEffect(
    React.useCallback(() => {
      // Sempre volta para a grade de categorias quando a tela é focada
      setCategoriaSelecionada('');

      return () => {
        // Cleanup
      };
    }, [])
  );

  // Buscar receitas da categoria selecionada
  useEffect(() => {
    if (!categoriaSelecionada) {
      setReceitasCategoria([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'receitas'),
      where('categoria', '==', categoriaSelecionada)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const receitas: any[] = [];

       for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      let fotoPerfil = data.fotoPerfil || null;

      if (data.uid) {
        try {
          const userDocRef = doc(db, 'usuarios', data.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            fotoPerfil = userDoc.data().fotoPerfil || null;
          }
        } catch (error) {
          console.error('Erro ao buscar foto do autor:', error);
        }
      }

      receitas.push({
        id: docSnapshot.id,
        ...data,
        fotoPerfil,
      });
    }


      setReceitasCategoria(receitas);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas:', error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível carregar as receitas');
    });

    return () => unsubscribe();
  }, [categoriaSelecionada]);

  

  const voltarParaHome = () => {
    setCategoriaSelecionada(''); // Reseta antes de navegar
    navigation.goBack();
  };


  // Tela de grid de categorias
  if (!categoriaSelecionada) {
    return (
      <SafeAreaView style={styles.container}>
        <YStack flex={1} padding="$4">

          {/* Barra superior */}
          <XStack alignItems="center" marginBottom="$4" gap="$3">
            <Text fontSize={20} fontWeight="bold" color="black">
              Categorias
            </Text>
          </XStack>

          {/* Grid de categorias */}
          <FlatList
            data={categoriasData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: CARD_GAP }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setCategoriaSelecionada(item.nome)}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={item.imagem}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 12 }}
                >
                  {/* Overlay escuro */}
                  <YStack
                    flex={1}
                    backgroundColor="rgba(0,0,0,0.4)"
                    borderRadius={12}
                    justifyContent="flex-end"
                    padding="$3"
                    paddingHorizontal="$2"
                  >
                    <Text
                      color="white"
                      fontSize={16}
                      fontWeight="bold"
                      textAlign="center"
                    >
                      {item.nome}
                    </Text>
                  </YStack>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </YStack>
      </SafeAreaView>
    );
  }


  // Tela de receitas da categoria selecionada
  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4">

        {/* Barra superior btn volta para todas as categorias */}
        <XStack alignItems="center" marginBottom="$4" gap="$3">

          <TouchableOpacity
            onPress={() => setCategoriaSelecionada('')}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <YStack>
            <Text fontSize={20} fontWeight="bold" color="black">
              {categoriaSelecionada}
            </Text>
            <Text fontSize={12} color="gray">
              {receitasCategoria.length} receitas
            </Text>
          </YStack>
        </XStack>

        {/* Lista de receitas */}
        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color="orange" />
            <Text marginTop="$2" color="gray">Carregando receitas...</Text>
          </YStack>
        ) : receitasCategoria.length === 0 ? (
          <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
            <Ionicons name="restaurant-outline" size={80} color="#ddd" />
            <Text fontSize={18} color="gray" textAlign="center">
              Nenhuma receita em {'\n'}{categoriaSelecionada}
            </Text>
            <Button
              backgroundColor="orange"
              color="white"
              onPress={() => setCategoriaSelecionada('')}
            >
              Voltar para Categorias
            </Button>
          </YStack>
        ) : (

          <FlatList
            data={receitasCategoria}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ReceitaCard
                item={item}
                favoritado={favoritos.includes(item.id)}
                toggleFavorito={toggleFavorito}
              fotoUsuarioLogado={fotoUsuario}
              />
            )}
          />
        )}
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
  card: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',

  },
});