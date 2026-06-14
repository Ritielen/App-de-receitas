import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

import Home from '../Screens/Home';
import Categorias from '../Screens/Categorias';
import Favoritos from '../Screens/Favoritos';
// import Publicadas from '../Screens/Publicadas'; 
// import IA from '../Screens/IA';                 

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // o header já vem do Stack pai
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          paddingBottom: 2,
          height: 95,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={Categorias}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bread-slice" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}