import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Keyboard } from 'react-native';

export default function App() {
  const [cep, setCep] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Formata o CEP enquanto o usuário digita (99999-999)
  const formatarCep = (texto) => {
    // Remove qualquer caractere que não seja número
    const numeros = texto.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const cepLimitado = numeros.slice(0, 8);
    
    // Formata com hífen após os 5 primeiros dígitos
    if (cepLimitado.length > 5) {
      return `${cepLimitado.slice(0, 5)}-${cepLimitado.slice(5)}`;
    }
    
    return cepLimitado;
  };

  const handleChangeCep = (texto) => {
    setCep(formatarCep(texto));
    // Limpa resultados anteriores quando o usuário começa a digitar novamente
    if (resultado) {
      setResultado(null);
      setErro(null);
    }
  };

  const validarCep = () => {
    // Remove o hífen para validação
    const cepNumerico = cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) {
      Alert.alert('Erro', 'CEP deve conter 8 dígitos');
      return false;
    }
    
    return true;
  };

  const buscarCep = async () => {
    // Fecha o teclado
    Keyboard.dismiss();
    
    // Validação básica
    if (!validarCep()) return;
    
    setCarregando(true);
    setErro(null);
    
    try {
      // Remove o hífen para fazer a consulta
      const cepNumerico = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      if (!response.ok) {
        throw new Error('Falha na conexão com o servidor');
      }
      
      const data = await response.json();

      if (data.erro) {
        setErro('CEP não encontrado. Verifique se o número está correto.');
        setResultado(null);
      } else {
        setErro(null);
        setResultado(data);
      }
    } catch (error) {
      setErro(`Erro ao buscar CEP: ${error.message}`);
      setResultado(null);
    } finally {
      setCarregando(false);
    }
  };

  // Para demonstrar o formato esperado para o usuário
  useEffect(() => {
    if (cep === '') {
      // Limpa resultados quando o campo é esvaziado
      setResultado(null);
      setErro(null);
    }
  }, [cep]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de CEP</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o CEP (99999-999)"
          placeholderTextColor="#999"
          value={cep}
          onChangeText={handleChangeCep}
          keyboardType="numeric"
          maxLength={9} // 8 dígitos + 1 hífen
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={buscarCep}
          disabled={carregando || cep.replace(/\D/g, '').length < 8}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Buscar</Text>
          )}
        </TouchableOpacity>
      </View>

      {erro && <Text style={styles.error}>{erro}</Text>}

      {resultado && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTitulo}>Endereço Encontrado</Text>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>CEP:</Text>
            <Text style={styles.resultadoValor}>{resultado.cep}</Text>
          </View>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Logradouro:</Text>
            <Text style={styles.resultadoValor}>{resultado.logradouro || 'Não informado'}</Text>
          </View>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Complemento:</Text>
            <Text style={styles.resultadoValor}>{resultado.complemento || 'Não informado'}</Text>
          </View>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Bairro:</Text>
            <Text style={styles.resultadoValor}>{resultado.bairro || 'Não informado'}</Text>
          </View>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Cidade:</Text>
            <Text style={styles.resultadoValor}>{resultado.localidade}</Text>
          </View>
          
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Estado:</Text>
            <Text style={styles.resultadoValor}>{resultado.uf}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0676de',
    textAlign: 'center',
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#0676de',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultadoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultadoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0676de',
    textAlign: 'center',
  },
  resultadoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultadoLabel: {
    fontWeight: 'bold',
    width: '35%',
    fontSize: 15,
  },
  resultadoValor: {
    flex: 1,
    fontSize: 15,
  },
  error: {
    color: '#ff3b30',
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 10,
  },
});