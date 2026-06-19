import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Image } from 'react-native';
import { YStack, Text, Input, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { usePerfilLogic } from '../hooks/usePerfilLogic';

export default function PerfilScreen() {
  const {
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
    setNome,
    setSobrenome,
    setEmail,
    setSenhaAtual,
    setNovaSenha,
    setConfirmarSenha,
    setModalVisible,
    setShowDeleteModal,
    setSenhaExclusao,
    selecionarImagem,
    salvarAlteracoes,
    cancelar,
    excluirConta,
  } = usePerfilLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <YStack flex={1} padding={20} gap={20}>
            <Card
              elevate
              size="$4"
              bordered
              padding={24}
              width="100%"
              maxWidth={500}
              alignSelf="center"
              backgroundColor="#fff"
              borderRadius={12}
              gap={16}
            >
              {/* Campo de Foto */}
              <YStack alignItems="center" gap={12}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  {fotoPerfil ? (
                    <Image
                      source={{ uri: fotoPerfil }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        borderWidth: 3,
                        borderColor: '#007BFF',
                      }}
                    />
                  ) : (
                    <YStack
                      width={120}
                      height={120}
                      borderRadius={60}
                      backgroundColor="#f0f0f0"
                      justifyContent="center"
                      alignItems="center"
                      borderWidth={3}
                      borderColor="#ccc"
                    >
                      <Ionicons name="person" size={60} color="#999" />
                    </YStack>
                  )}
                </TouchableOpacity>

                <Button
                  backgroundColor="#007BFF"
                  color="#fff"
                  icon={<Ionicons name="camera" size={18} color="#fff" />}
                  onPress={selecionarImagem}
                  size="$3"
                >
                  Alterar Foto
                </Button>
              </YStack>

              {/* Campos do formulário */}
              <Input
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                color="#333"
                placeholderTextColor="#999"
                backgroundColor="#f9f9f9"
                borderColor="#ccc"
              />

              <Input
                placeholder="Sobrenome"
                value={sobrenome}
                onChangeText={setSobrenome}
                color="#333"
                placeholderTextColor="#999"
                backgroundColor="#f9f9f9"
                borderColor="#ccc"
              />

              <Input
                placeholder="E-mail"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                color="#333"
                placeholderTextColor="#999"
                backgroundColor="#f9f9f9"
                borderColor="#ccc"
              />

              {/* Seção de Alteração de Senha */}
              <YStack gap={8}>
                <Text fontSize={16} fontWeight="bold" color="#333">
                  Alterar Senha
                </Text>

                <Input
                  placeholder="Senha Atual"
                  secureTextEntry
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  color="#333"
                  placeholderTextColor="#999"
                  backgroundColor="#f9f9f9"
                  borderColor="#ccc"
                />

                <Input
                  placeholder="Nova Senha"
                  secureTextEntry
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  color="#333"
                  placeholderTextColor="#999"
                  backgroundColor="#f9f9f9"
                  borderColor="#ccc"
                />

                <Input
                  placeholder="Confirmar Nova Senha"
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  color="#333"
                  placeholderTextColor="#999"
                  backgroundColor="#f9f9f9"
                  borderColor="#ccc"
                />
              </YStack>

              {/* Botões de Ação */}
              <YStack gap={12} marginTop={10}>
                <Button
                  backgroundColor="#007BFF"
                  color="#fff"
                  onPress={salvarAlteracoes}
                  disabled={carregando}
                  opacity={carregando ? 0.6 : 1}
                  size="$4"
                >
                  {carregando ? 'Salvando...' : 'Salvar Alterações'}
                </Button>

                <Button
                  variant="outlined"
                  borderColor="#dc3545"
                  color="#dc3545"
                  onPress={cancelar}
                  disabled={carregando}
                  size="$4"
                >
                  Cancelar
                </Button>

                {/* Botão Excluir Conta */}
                <Button
                  backgroundColor="#dc3545"
                  color="#fff"
                  icon={<Ionicons name="trash-outline" size={18} color="#fff" />}
                  onPress={() => setShowDeleteModal(true)}
                  disabled={carregando}
                  opacity={carregando ? 0.6 : 1}
                  size="$4"
                  marginTop={20}
                >
                  Excluir Conta
                </Button>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>

        {/* Modal para visualizar a imagem em tamanho maior */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.9)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={{
                  width: '100%',
                  height: 300,
                  borderRadius: 12,
                  marginBottom: 20,
                  backgroundColor: '#f0f0f0',
                }}
                resizeMode="cover"
              />
            ) : (
              <YStack
                width="100%"
                height={300}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="person" size={100} color="#fff" />
                <Text color="#fff" marginTop={10}>
                  Nenhuma foto disponível
                </Text>
              </YStack>
            )}

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 50,
                right: 20,
                padding: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal de Exclusão de Conta */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPress={() => setShowDeleteModal(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}}
                style={{ width: '85%' }}
              >
                <Card
                  elevate
                  bordered
                  padding={24}
                  backgroundColor="#fff"
                  borderRadius={12}
                  gap={16}
                >
                  <YStack alignItems="center" gap={12}>
                    <Ionicons name="warning" size={48} color="#dc3545" />
                    <Text fontSize={20} fontWeight="bold" color="#dc3545" textAlign="center">
                      Excluir Conta
                    </Text>
                    <Text fontSize={14} color="#666" textAlign="center">
                      Esta ação é irreversível! Todos os seus dados serão permanentemente excluídos.
                    </Text>
                  </YStack>

                  <Input
                    placeholder="Digite sua senha para confirmar"
                    secureTextEntry
                    value={senhaExclusao}
                    onChangeText={setSenhaExclusao}
                    color="#333"
                    placeholderTextColor="#999"
                    backgroundColor="#f9f9f9"
                    borderColor="#dc3545"
                    borderWidth={1}
                  />

                  <YStack gap={8}>
                    <Button
                      backgroundColor="#dc3545"
                      color="#fff"
                      onPress={excluirConta}
                      disabled={carregando}
                      opacity={carregando ? 0.6 : 1}
                    >
                      {carregando ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </Button>

                    <Button
                      variant="outlined"
                      borderColor="#ccc"
                      color="#666"
                      onPress={() => {
                        setShowDeleteModal(false);
                        setSenhaExclusao('');
                      }}
                      disabled={carregando}
                    >
                      Cancelar
                    </Button>
                  </YStack>
                </Card>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}