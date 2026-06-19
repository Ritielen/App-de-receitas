import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF', 
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Ícone de utensílios */}
      <FontAwesome5 name="utensils" size={80} color="#FFB300" />

      {/* Receitas */}
      <Text
        style={{
          color: '#FF6B35',
          fontSize: 36,
          fontWeight: 'bold',
          fontFamily: 'cursive',
          marginTop: 20,
        }}
      >
        Receitas
      </Text>

      {/* de */}
      <Text
        style={{
          color: '#D84315',
          fontSize: 24,
          fontStyle: 'italic',
          marginTop: 4,
        }}
      >
        de
      </Text>

      {/* Família */}
      <Text
        style={{
          color: '#FF6B35',
          fontSize: 36,
          fontWeight: 'bold',
          fontFamily: 'cursive',
          marginTop: 4,
        }}
      >
        Família
      </Text>
    </View>
  );
}