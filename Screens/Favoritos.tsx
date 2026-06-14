// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { ReceitaCard } from '../components/ReceitaCard';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { TouchableOpacity } from 'react-native';

type FavoritosScreenProp = NativeStackNavigationProp<RootStackParamList, 'Favoritos'>;

export default function Favoritos() {
  const navigation = useNavigation<FavoritosScreenProp>();
  const { favoritos, toggleFavorito } = useHomeLogic();
  const [receitasFavoritas, setReceitasFavoritas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Favoritos');

  // Buscar receitas favoritadas
  useEffect(() => {
    if (!auth.currentUser || favoritos.length === 0) {
      setReceitasFavoritas([]);
      setLoading(false);
      return;
    }

    const receitasRef = collection(db, 'receitas');
    const q = query(receitasRef, where('__name__', 'in', favoritos));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const receitas: any[] = [];
      snapshot.forEach((doc) => {
        receitas.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setReceitasFavoritas(receitas);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar favoritos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [favoritos]);

  const voltarParaHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4">
        
        {/* Barra superior */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text fontSize={20} fontWeight="bold" color="black">
            Meus Favoritos
          </Text>
          <Text fontSize={12} color="gray">
            {receitasFavoritas.length} receitas
          </Text>
        </XStack>

        {/* Lista de receitas favoritas */}
        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color="orange" />
            <Text marginTop="$2" color="gray">Carregando favoritos...</Text>
          </YStack>
        ) : receitasFavoritas.length === 0 ? (
          <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
            <Ionicons name="heart-outline" size={80} color="#ddd" />
            <Text fontSize={18} color="gray" textAlign="center">
              Você ainda não tem receitas favoritas
            </Text>
            <Button
              backgroundColor="orange"
              color="white"
              onPress={() => navigation.navigate('Home')}
            >
              Explorar Receitas
            </Button>
          </YStack>
        ) : (
          <FlatList
            data={receitasFavoritas}
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

      {/* Menu inferior */}
      <YStack
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="white"
        paddingVertical="$3"
        paddingBottom={Platform.OS === 'android' ? 60 : 60}
        borderTopWidth={1}
        borderTopColor="#e0e0e0"
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="home" size={24} color="gray" />
          <Text fontSize={12} color="gray" marginTop="$1">
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Categorias')}
          style={{ alignItems: 'center' }}
        >
          <FontAwesome5 name="bread-slice" size={24} color="gray" />
          <Text fontSize={12} color="gray" marginTop="$1">
            Categorias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="bookmark-outline" size={24} color="gray" />
          <Text fontSize={12} color="gray" marginTop="$1">
            Publicadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Feather name="search" size={24} color="gray" />
          <Text fontSize={12} color="gray" marginTop="$1">
            Pesquisa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="star" size={24} color="gray" />
          <Text fontSize={12} color="gray" marginTop="$1">
            IA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} color="orange" />
          <Text fontSize={12} color="orange" fontWeight="bold" marginTop="$1">
            Favoritos
          </Text>
        </TouchableOpacity>
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
});