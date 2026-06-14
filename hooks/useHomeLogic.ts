// @ts-nocheck
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { addDoc, collection, getDocs, query, orderBy, onSnapshot,  where, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebase';
import { IMGBB_API_KEY } from '@env';

export function useHomeLogic() {
   const [novaReceita, setNovaReceita] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [imagemBase64, setImagemBase64] = useState(''); // ← base64 temporário
  const [imagemPreview, setImagemPreview] = useState(''); // URI para mostrar preview
  const [fazendoUpload, setFazendoUpload] = useState(false);

  const [receitas, setReceitas] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [nomeUsuario, setNomeUsuario] = useState(''); 
  const [sobrenomeUsuario, setSobrenomeUsuario] = useState(''); 

  const usuariosRef = collection(db, "usuarios");

  // estados
const [favoritos, setFavoritos] = useState<string[]>([]);
const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  // BUSCAR NOME E SOBRENOME DO USUÁRIO LOGADO
useEffect(() => {
  buscarNomeUsuario();
}, []);

const buscarNomeUsuario = async () => {
  try {
    if (!auth.currentUser) {
      console.log('Usuário não logado');
      return;
    }
    
    const q = query(
      collection(db, "usuarios"),
      where("uid", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);
    console.log('Docs encontrados:', snapshot.size); 

    if (!snapshot.empty) {
      const usuario = snapshot.docs[0].data();
      console.log('Dados do usuário:', usuario); 
      setNomeUsuario(usuario.nome || '');
      setSobrenomeUsuario(usuario.sobrenome || '');
    } else {
      console.log('Nenhum usuário encontrado com uid:', auth.currentUser.uid);
    }
  } catch (error) {
    console.log("Erro ao buscar nome do usuário:", error); 
  }
};


// Buscar favoritos do usuário
useEffect(() => {
  if (!auth.currentUser) return;
  
  const q = query(
    collection(db, 'favoritos'),
    where('userId', '==', auth.currentUser.uid)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const ids: string[] = [];
    snapshot.forEach((doc) => {
      ids.push(doc.data().receitaId);
    });
    setFavoritos(ids);
  });
  
  return () => unsubscribe();
}, []);

// Função para favoritar/desfavoritar
const toggleFavorito = async (receitaId: string) => {
  try {
    if (!auth.currentUser) {
      console.log('Usuário não logado');
      return;
    }
    
    console.log('Toggle favorito - Usuário:', auth.currentUser.uid, 'Receita:', receitaId);
    
    const q = query(
      collection(db, 'favoritos'),
      where('userId', '==', auth.currentUser.uid),
      where('receitaId', '==', receitaId)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Remover favorito
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        Alert.alert('Sucesso', 'Receita removida dos favoritos!');
        console.log('Favorito removido');
      });
    } else {
      // Adicionar favorito
      await addDoc(collection(db, 'favoritos'), {
        userId: auth.currentUser.uid,
        receitaId: receitaId,
        criadoEm: new Date(),
      });
      Alert.alert('Sucesso', 'Receita adicionada aos favoritos!');
      console.log('Favorito adicionado');
    }
  } catch (error) {
    console.error('Erro ao favoritar:', error);
  }
};



//buscar categorias para dropdown
  useEffect(() => {
    const fetchCategorias = async () => {
      const snapshot = await getDocs(collection(db, 'Categorias'));
      const lista: string[] = [];
      snapshot.forEach((doc) => {
        Object.keys(doc.data()).forEach((key) => lista.push(key));
      });
      setCategorias(lista);
    };
    fetchCategorias();
  }, []);


  // Buscar TODAS as receitas em tempo real 
  useEffect(() => {
    const q = query(collection(db, 'receitas'), orderBy('criadoEm', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaReceitas: any[] = [];
      snapshot.forEach((doc) => {
        listaReceitas.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setReceitas(listaReceitas);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas:', error);
      setLoading(false);
    });

    //  remove listener quando componente desmontar
    return () => unsubscribe();
  }, []);




  // Seleciona imagem e guarda base64 localmente (sem fazer upload ainda)
  const processarImagem = async (origem: 'camera' | 'galeria') => {
    try {
      let result;
      const opcoes: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      };

      if (origem === 'camera') {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted)
          return Alert.alert('Atenção', 'O aplicativo precisa de permissão para usar a câmera.');
        result = await ImagePicker.launchCameraAsync(opcoes);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(opcoes);
      }

      if (!result.canceled && result.assets[0].base64) {
        setImagemBase64(result.assets[0].base64);
        setImagemPreview(result.assets[0].uri); // para mostrar thumbnail na tela
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar imagem.');
    }
  };

  const escolherOpcaoImagem = () => {
    Alert.alert('Anexar Imagem', 'De onde você quer pegar a foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tirar Foto (Câmera)', onPress: () => processarImagem('camera') },
      { text: 'Abrir Galeria', onPress: () => processarImagem('galeria') },
    ]);
  };

  // Faz upload da imagem para imgbb e retorna a URL
  const uploadImagem = async (): Promise<string> => {
    if (!imagemBase64) return '';
    const formData = new FormData();
    formData.append('image', imagemBase64);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.success ? data.data.url : '';
  };

  // Posta receita: faz upload da imagem (se houver) e salva no Firestore
   const postarReceita = async () => {
    if (!novaReceita || !categoriaSelecionada) {  
      Alert.alert('Atenção', 'Preencha a receita e selecione uma categoria');
      return;
    }
    try {
      setFazendoUpload(true);
      const imagemUrl = await uploadImagem();

  console.log('Nome:', nomeUsuario);
console.log('Sobrenome:', sobrenomeUsuario);

      await addDoc(collection(db, 'receitas'), {
        texto: novaReceita,           
        categoria: categoriaSelecionada,
        imagem: imagemUrl,
         criadoPor: nomeUsuario + ' ' + sobrenomeUsuario,          
        autor: auth.currentUser?.email,
        uid: auth.currentUser?.uid,  
        criadoEm: new Date(),
      });
      Alert.alert('Sucesso', 'Receita publicada!');
      setNovaReceita('');            
      setCategoriaSelecionada('');
      setImagemBase64('');
      setImagemPreview('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a receita');
    } finally {
      setFazendoUpload(false);
    }
  };

  return {
    novaReceita,           
    setNovaReceita,        
    categorias,
    categoriaSelecionada,
    setCategoriaSelecionada,
    imagemPreview,
    escolherOpcaoImagem,
    postarReceita,
    fazendoUpload,
     receitas,      
    loading, 
    nomeUsuario,  
   sobrenomeUsuario,  
    favoritos,
  toggleFavorito,
  loadingFavoritos,
    
  };

}