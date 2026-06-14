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
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { ReceitaCard } from '../components/ReceitaCard';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2; // 2 colunas com padding

type CategoriasScreenProp = NativeStackNavigationProp<RootStackParamList, 'Categorias'>;

// Dados das categorias
const categoriasData = [
  { id: '1', nome: 'Bebidas', imagem: require('../assets/bebidas.jpg') },
  { id: '2', nome: 'Bolos e tortas', imagem: require('../assets/bolos-tortas.jpg') },
  { id: '3', nome: 'Carnes', imagem: require('../assets/carnes.jpg') },
  { id: '4', nome: 'Massas', imagem: require('../assets/massas.jpg') },
];

export default function Categorias() {
  const navigation = useNavigation<CategoriasScreenProp>();
  const { favoritos, toggleFavorito } = useHomeLogic();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [receitasCategoria, setReceitasCategoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar receitas da categoria selecionada
  useEffect(() => {
    if (!categoriaSelecionada) return;

    setLoading(true);
    const q = query(
      collection(db, 'receitas'),
      where('categoria', '==', categoriaSelecionada)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const receitas: any[] = [];
      snapshot.forEach((doc) => {
        receitas.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setReceitasCategoria(receitas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoriaSelecionada]);

  const voltarParaHome = () => {
    navigation.goBack();
  };

  const voltarParaCategorias = () => {
    setCategoriaSelecionada('');
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
            numColumns={2}
            contentContainerStyle={{ gap: CARD_GAP }}
            columnWrapperStyle={{ gap: CARD_GAP }}
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
        
        {/* Barra superior */}
        <XStack alignItems="center" marginBottom="$4" gap="$3">
         
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
              onPress={() => navigation.navigate('Categorias')}>
            
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
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});