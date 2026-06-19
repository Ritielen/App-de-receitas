import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { IMGBB_API_KEY } from '@env';

interface ReceitaItem {
  id: string;
  texto?: string;
  imagem?: string | null;
}

export function useEditarReceita(item: ReceitaItem) {
  const [texto, setTexto] = useState(item.texto || '');
  const [imagemPreview, setImagemPreview] = useState<string | null>(item.imagem || null);
  const [imagemBase64, setImagemBase64] = useState<string>(''); // base64 temporário
  const [fazendoUpload, setFazendoUpload] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const escolherOpcaoImagem = () => {
    Alert.alert(
      'Imagem da Receita',
      'Escolha uma opção',
      [
        {
          text: 'Galeria',
          onPress: () => processarImagem('galeria'),
        },
        {
          text: 'Câmera',
          onPress: () => processarImagem('camera'),
        },
        {
          text: imagemPreview ? 'Remover Imagem' : 'Cancelar',
          style: imagemPreview ? 'destructive' : 'cancel',
          onPress: () => {
            if (imagemPreview) {
              Alert.alert(
                'Remover Imagem',
                'Tem certeza que deseja remover a imagem?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Remover', 
                    style: 'destructive',
                    onPress: () => {
                      setImagemPreview(null);
                      setImagemBase64('');
                    }
                  }
                ]
              );
            }
          },
        },
      ]
    );
  };

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
        if (!permissao.granted) {
          return Alert.alert('Atenção', 'O aplicativo precisa de permissão para usar a câmera.');
        }
        result = await ImagePicker.launchCameraAsync(opcoes);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(opcoes);
      }

      if (!result.canceled && result.assets[0]?.base64) {
        setImagemBase64(result.assets[0].base64);
        setImagemPreview(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert('Erro', 'Falha ao selecionar imagem.');
    }
  };

  const uploadImagem = async (): Promise<string> => {
    if (!imagemBase64) {
      // Se não tem nova imagem, retorna a imagem atual
      return imagemPreview || '';
    }

    try {
      const formData = new FormData();
      formData.append('image', imagemBase64);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Upload ImgBB concluído:', data.data.url);
        return data.data.url;
      } else {
        throw new Error('Falha no upload para ImgBB');
      }
    } catch (error) {
      console.error('Erro no upload ImgBB:', error);
      throw new Error('Não foi possível fazer upload da imagem');
    }
  };

  const salvar = async () => {
    if (!texto.trim()) {
      Alert.alert('Atenção', 'O texto da receita não pode estar vazio.');
      return;
    }

    setSalvando(true);
    setFazendoUpload(true);

    try {
      let imagemUrl = imagemPreview; // Mantém a imagem atual por padrão

      // Se tem uma nova imagem para upload (base64 preenchido)
      if (imagemBase64) {
        console.log('Fazendo upload da nova imagem...');
        imagemUrl = await uploadImagem();
      }

      const receitaRef = doc(db, 'receitas', item.id);
      const dadosAtualizados = {
        texto,
        imagem: imagemUrl,
        atualizadoEm: new Date().toISOString(),
      };

      console.log('Atualizando receita:', dadosAtualizados);
      await updateDoc(receitaRef, dadosAtualizados);

      Alert.alert('Sucesso', 'Receita atualizada com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      
      let mensagem = 'Não foi possível atualizar a receita.';
      if (error.message) {
        mensagem = error.message;
      }
      
      Alert.alert('Erro', mensagem);
      return false;
    } finally {
      setSalvando(false);
      setFazendoUpload(false);
    }
  };

  return {
    texto,
    setTexto,
    imagemPreview,
    fazendoUpload,
    salvando,
    escolherOpcaoImagem,
    salvar,
  };
}