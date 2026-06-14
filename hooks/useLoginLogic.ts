import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLoginLogic() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Efeito que roda assim que a tela abre: Tenta carregar o último e-mail
  useEffect(() => {
    const carregarUltimoEmail = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem('@ultimo_email');
        if (emailSalvo) {
          setEmail(emailSalvo);
        }
      } catch (error) {
        console.log("Erro ao carregar o e-mail salvo", error);
      }
    };
    carregarUltimoEmail();
  }, []);


  const logar = async (onSuccess: () => void) => {
    if (!email || !senha) {
      return Alert.alert("Ops", "Preencha e-mail e senha!");
    }
    setCarregando(true); 
    try {
      await signInWithEmailAndPassword(auth, email, senha);  
      await AsyncStorage.setItem('@ultimo_email', email);
      onSuccess();
    } catch (erro: any) {
      Alert.alert("Erro ao logar", erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    logar,
    carregando
  };
}