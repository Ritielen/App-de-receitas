import { useState } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigation } from '@react-navigation/native';

export function useRegisterLogic() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState<string>('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const cadastrar = async () => {
    if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
      return Alert.alert("Atenção", "Preencha todos os campos!");
    }

    setCarregando(true);
    
    try {
      // Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Criar documento na coleção "usuarios" com o UID do usuário
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        criadoEm: new Date(),
        dataNascimento: dataNascimento,
      });
      
      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      navigation.replace('Login');
      
    } catch (erro: any) {
      Alert.alert("Erro ao cadastrar", erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    email,
    setEmail,
    senha,
    setSenha,
    cadastrar,
    carregando,
    dataNascimento,
    setDataNascimento
  };
}