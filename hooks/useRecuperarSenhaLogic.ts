import { useState } from 'react';
import { Alert } from 'react-native';
import { auth } from '../firebase'; 
import { sendPasswordResetEmail } from 'firebase/auth'; 

export function useRecuperaSenhaLogic() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const recuperar = async (onSuccess: () => void) => {
    if (email.trim() === '') {
      return Alert.alert("Atenção", "Por favor, digite seu e-mail.");
    }

    setCarregando(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Sucesso!", "Link enviado! Verifique sua caixa de entrada e o Spam.");
      onSuccess(); // Volta para a tela anterior
    } catch (erro: any) {
      Alert.alert("Erro", erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    email,
    setEmail,
    recuperar,
    carregando
  };
}