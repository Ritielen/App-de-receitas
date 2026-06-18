import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ReceitaCard } from '../components/ReceitaCard';
import { YStack, XStack, Text } from 'tamagui';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { Ionicons } from '@expo/vector-icons';

export default function Publicados() {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { favoritos, toggleFavorito } = useHomeLogic();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'receitas'),
      where('uid', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setReceitas(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const excluirReceita = async (id: string) => {
    Alert.alert(
      'Excluir Receita',
      'Tem certeza que deseja excluir esta receita?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'receitas', id));

              Alert.alert(
                'Sucesso',
                'Receita excluída com sucesso!'
              );
            } catch (error) {
              console.log(error);
              Alert.alert(
                'Erro',
                'Não foi possível excluir a receita.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color="orange" />
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4">
        <Text
          fontSize={24}
          fontWeight="bold"
          marginBottom="$4"
        >
          Minhas Receitas
        </Text>

        {receitas.length === 0 ? (
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons
              name="restaurant-outline"
              size={80}
              color="#ccc"
            />

            <Text
              fontSize={18}
              color="gray"
              marginTop="$3"
            >
              Você ainda não publicou receitas.
            </Text>
          </YStack>
        ) : (
          <FlatList
            data={receitas}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <YStack>
                <ReceitaCard
                  item={item}
                  favoritado={favoritos.includes(item.id)}
                  toggleFavorito={toggleFavorito}
                />

                <XStack
                  justifyContent="flex-end"
                  marginBottom="$4"
                  paddingRight="$2"
                >
                  <TouchableOpacity
                    onPress={() =>
                      excluirReceita(item.id)
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={26}
                      color="red"
                    />
                  </TouchableOpacity>
                </XStack>
              </YStack>
            )}
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}