import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Produto from './produto';
import ListaRegistros from './ListaRegistros';

export default function Storage() {
    const [registros, setRegistros] = useState([]);
    const [telaAtual, setTelaAtual] = useState('produto'); // Estado para controlar a tela 

    const salvarNoAsyncStorage = async (qtd, produto, valor) => {
        try {
            const registro = { qtd, produto, valor };
            // Recupera os registros anteriores do AsyncStorage 
            const registrosExistentes = await AsyncStorage.getItem('registros');
            const registrosAnteriores = registrosExistentes ? JSON.parse(registrosExistentes) : [];
            // Adiciona o novo registro
            const novosRegistros = [...registrosAnteriores, registro];
            // Armazena novamente no AsyncStorage 
            await AsyncStorage.setItem('registros', JSON.stringify(novosRegistros));
            setRegistros(novosRegistros);
            Alert.alert('Sucesso', 'Registro salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar no AsyncStorage:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
        }
    };

    const carregarRegistros = async () => {
        try {
            const registrosExistentes = await AsyncStorage.getItem('registros');
            const registrosCarregados = registrosExistentes ? JSON.parse(registrosExistentes) : [];
            setRegistros(registrosCarregados);
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
        }
    };

    const apagarNoAsyncStorage = async() => {
        try{
            await AsyncStorage.clear();
            Alert.alert('Sucesso', 'Todos os dados foram removidos!');
            carregarRegistros();
        } catch (error) {
            Alert.alert('Erro', 'Erro ao limpar os dados');
        }
    };
    
    const apagarRegistroEspecifico = async (index) => {
        try{
            const registrosExistente = [...registros];
            registrosExistente.splice(index, 1); //Remove o item pelo índice

            await AsyncStorage.setItem('registro', JSON.stringify(registrosExistente));
            setRegistros(registrosExistente); //Atualiza o estado local
            Alert.alert('Sucesso', 'Registro apagado com sucesso!');
        } catch (error) {
            console.error('Erro ao apagar o registro', error);
            Alert.alert('Erro', 'Ocorreu um erro ao apagar o registro.')
        }
    };

    useEffect(() => {
        carregarRegistros();
    }, []);

    return (
        <View style={styles.container}>
            {telaAtual === 'produto' ? (
                <Produto onSalvarDados={salvarNoAsyncStorage} setTelaAtual={setTelaAtual} onApagarDados={apagarNoAsyncStorage} />
            ) : (
                <>
                    <Text style={styles.titulo}>Registros Salvos:</Text>
                    <ListaRegistros propRegistro={registros}
                    onApagar={apagarRegistroEspecifico} />
                    <Button
                        title='Voltar para o cadastro'
                        onPress={() => setTelaAtual('produto')}></Button>
                    <FlatList 
                        data={registros}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text>Quantidade: {item.qtd}</Text>
                                <Text>Produto: {item.produto}</Text>
                                <Text>Valor: {item.valor}</Text>
                            </View>
                        )}
                    />
                    <Button title='Voltar para Cadastro' onPress={() => setTelaAtual('produto')} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});