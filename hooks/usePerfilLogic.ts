import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { auth, db } from '../firebase';
import { doc, getDoc,  updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  updatePassword, verifyBeforeUpdateEmail, sendEmailVerification, EmailAuthProvider, 
  reauthenticateWithCredential, deleteUser, onAuthStateChanged,signOut
} from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

type PerfilScreenProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

export function usePerfilLogic() {
  const navigation = useNavigation<PerfilScreenProp>();
  
  // Estados dos campos
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [senhaExclusao, setSenhaExclusao] = useState('');
  const [user, setUser] = useState<any>(null);

  // Verificar usuário logado e carregar dados
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmailOriginal(currentUser.email || '');
        
        // Buscar dados do usuário no Firestore
        try {
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNome(userData.nome || '');
            setSobrenome(userData.sobrenome || '');
            setEmail(userData.email || currentUser.email || '');
            setFotoPerfil(userData.fotoPerfil || '');
          } else {
            // Se não existir documento, usa email do auth
            setEmail(currentUser.email || '');
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          Alert.alert('Erro', 'Não foi possível carregar seus dados.');
        }
      } else {
        // Se não tiver usuário, redireciona para login
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Função para selecionar imagem
  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  // Função para salvar alterações
  const salvarAlteracoes = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    // Verificar se precisa de senha para alterações sensíveis
    const emailFoiAlterado = email !== emailOriginal && email.trim() !== '';
    const senhaSeraAlterada = novaSenha !== '' || confirmarSenha !== '';

    if ((emailFoiAlterado || senhaSeraAlterada) && !senhaAtual) {
      Alert.alert('Erro', 'Para alterar email ou senha, digite sua senha atual.');
      return;
    }

    setCarregando(true);

    try {
      // Se o email foi alterado, usar verifyBeforeUpdateEmail
      if (emailFoiAlterado) {
        try {
          // Reautenticar usuário
          const credential = EmailAuthProvider.credential(user.email!, senhaAtual);
          await reauthenticateWithCredential(user, credential);
          
          // Usar verifyBeforeUpdateEmail que envia email de verificação
          await verifyBeforeUpdateEmail(user, email);
          
          // Atualizar email no Firestore (será efetivado após verificação)
          const userRef = doc(db, 'usuarios', user.uid);
          await updateDoc(userRef, {
            email, // Salva o novo email no Firestore
            emailPendente: true, // Flag para indicar que está pendente de verificação
            atualizadoEm: new Date().toISOString(),
          });
          
          Alert.alert(
            'Verificação de Email',
            'Um email de verificação foi enviado para o novo endereço. Por favor, verifique seu email para completar a alteração.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Fazer logout para forçar reautenticação
                  signOut(auth);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }
              }
            ]
          );
          
          setCarregando(false);
          return;
        } catch (error: any) {
          console.error('Erro ao atualizar email:', error);
          
          if (error.code === 'auth/wrong-password') {
            Alert.alert('Erro', 'Senha atual incorreta.');
          } else if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Erro', 'Este email já está em uso por outra conta.');
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Erro', 'Formato de email inválido.');
          } else if (error.code === 'auth/requires-recent-login') {
            Alert.alert('Erro', 'Por segurança, faça login novamente antes de alterar o email.');
          } else if (error.code === 'auth/operation-not-allowed') {
            Alert.alert('Erro', 'Operação não permitida. Verifique as configurações do Firebase.');
          } else {
            Alert.alert('Erro', 'Não foi possível atualizar o email. Tente novamente.');
          }
          setCarregando(false);
          return;
        }
      }

      // Se a senha foi preenchida, atualizar senha
      if (senhaSeraAlterada) {
        if (novaSenha !== confirmarSenha) {
          Alert.alert('Erro', 'As senhas não conferem.');
          setCarregando(false);
          return;
        }

        if (novaSenha.length < 6) {
          Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
          setCarregando(false);
          return;
        }

        try {
          // Reautenticar usuário
          const credential = EmailAuthProvider.credential(user.email!, senhaAtual);
          await reauthenticateWithCredential(user, credential);
          
          // Atualizar senha
          await updatePassword(user, novaSenha);
          
          Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
        } catch (error: any) {
          console.error('Erro ao atualizar senha:', error);
          
          if (error.code === 'auth/wrong-password') {
            Alert.alert('Erro', 'Senha atual incorreta.');
          } else if (error.code === 'auth/weak-password') {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
          } else {
            Alert.alert('Erro', 'Não foi possível alterar a senha. Tente novamente.');
          }
          setCarregando(false);
          return;
        }
      }

      // Atualizar dados no Firestore (se não houve alteração de email)
      if (!emailFoiAlterado) {
        const userRef = doc(db, 'usuarios', user.uid);
        await updateDoc(userRef, {
          nome,
          sobrenome,
          fotoPerfil,
          atualizadoEm: new Date().toISOString(),
        });
      }

      // Limpar campos de senha
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      if (!emailFoiAlterado && !senhaSeraAlterada) {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar
  const cancelar = () => {
    // Recarregar dados do Firestore para resetar campos
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      getDoc(userDocRef).then((userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNome(userData.nome || '');
          setSobrenome(userData.sobrenome || '');
          setEmail(userData.email || user.email || '');
          setFotoPerfil(userData.fotoPerfil || '');
        }
      }).catch((error) => {
        console.error('Erro ao recarregar dados:', error);
      });
    }
    
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    
    Alert.alert('Cancelado', 'As alterações foram descartadas.');
  };

  // Função para excluir conta
  const excluirConta = async () => {
    if (!user || !senhaExclusao) {
      Alert.alert('Erro', 'Digite sua senha para confirmar a exclusão.');
      return;
    }

    setCarregando(true);

    try {
      // Reautenticar usuário antes de excluir
      const credential = EmailAuthProvider.credential(user.email!, senhaExclusao);
      await reauthenticateWithCredential(user, credential);

      // Excluir dados do Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      await deleteDoc(userRef);

      // Excluir conta de autenticação
      await deleteUser(user);

      Alert.alert(
        'Conta Excluída',
        'Sua conta foi excluída permanentemente.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar para tela de login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error);
      
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro', 'Senha incorreta.');
      } else if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Erro',
          'Por segurança, faça login novamente antes de excluir a conta.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Fazer logout e redirecionar
                signOut(auth);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
      }
    } finally {
      setCarregando(false);
      setShowDeleteModal(false);
      setSenhaExclusao('');
    }
  };

  return {
    // Estados
    nome,
    sobrenome,
    email,
    fotoPerfil,
    senhaAtual,
    novaSenha,
    confirmarSenha,
    carregando,
    modalVisible,
    showDeleteModal,
    senhaExclusao,
    user,
    
    // Setters
    setNome,
    setSobrenome,
    setEmail,
    setSenhaAtual,
    setNovaSenha,
    setConfirmarSenha,
    setModalVisible,
    setShowDeleteModal,
    setSenhaExclusao,
    
    // Funções
    selecionarImagem,
    salvarAlteracoes,
    cancelar,
    excluirConta,
  };
}