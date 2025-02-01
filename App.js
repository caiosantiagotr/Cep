import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

export default function App() {
  const [cep, setCep] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarCep = async () => {
    try {
      // Usando o CEP digitado pelo usuário
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErro('CEP não encontrado.');
        setResultado(null);
      } else {
        setErro(null);
        setResultado(data);
      }
    } catch (error) {
      setErro('Erro ao buscar CEP.');
      setResultado(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
      />
      <Button title="Digite" onPress={buscarCep} />

      {erro && <Text style={styles.error}>{erro}</Text>}

      {resultado && (
        <View style={styles.resultado}>
          <Text><strong>Endereço:</strong> {resultado.logradouro}</Text>
          <Text><strong>Bairro:</strong> {resultado.bairro}</Text>
          <Text><strong>Cidade:</strong> {resultado.localidade}</Text>
          <Text><strong>Estado:</strong> {resultado.uf}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0676de',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#fdfdfd',
    borderWidth: 1,
    marginBottom: 20,
    width: '50%', // Alterei para que a largura seja menor
    paddingHorizontal: 10,
  },
  resultado: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffbc1f',
    width: '30%', // Alterei para que a largura seja Maior
  },
  error: {
    color: '#red',
    marginTop: 10,
  },
});
