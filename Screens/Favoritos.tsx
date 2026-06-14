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
    navigation.navigate('Inicio');
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4">

        {/* Barra superior */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">

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
              onPress={() => navigation.navigate('Inicio')}
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