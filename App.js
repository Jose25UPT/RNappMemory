import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [item, setItem] = useState('');
  const [historial, setHistorial] = useState([]);

  // Cargar la lista al abrir
  useEffect(() => {
    cargarHistorial();
  }, []);

  const guardarEnHistorial = async () => {
    if (item.trim() === '') return;

    const nuevaLista = [...historial, { id: Date.now().toString(), nombre: item }];
    setHistorial(nuevaLista);
    setItem('');

    try {
      // TRUCO NIVEL 3: Convertimos el ARRAY a STRING para poder guardarlo
      await AsyncStorage.setItem('@mi_historial', JSON.stringify(nuevaLista));
    } catch (e) {
      console.error("Error guardando lista");
    }
  };

  const cargarHistorial = async () => {
    try {
      const datosCargados = await AsyncStorage.getItem('@mi_historial');
      if (datosCargados !== null) {
        // TRUCO NIVEL 3: Convertimos el STRING de vuelta a ARRAY
        setHistorial(JSON.parse(datosCargados));
      }
    } catch (e) {
      console.error("Error cargando lista");
    }
  };

  const limpiarTodo = async () => {
    await AsyncStorage.clear();
    setHistorial([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Mi Diario Estelar 🚀</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Tatooine, Luke..."
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity style={styles.boton} onPress={guardarEnHistorial}>
          <Text style={styles.botonTexto}>AÑADIR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTexto}>• {item.nombre}</Text>
          </View>
        )}
        style={{ width: '100%' }}
      />

      <TouchableOpacity onPress={limpiarTodo} style={{ marginTop: 20 }}>
        <Text style={{ color: 'gray' }}>Limpiar memoria completa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', padding: 20, paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  boton: { backgroundColor: '#FFD700', padding: 15, borderRadius: 10, marginLeft: 10, justifyContent: 'center' },
  botonTexto: { fontWeight: 'bold' },
  item: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, width: '100%', elevation: 1 },
  itemTexto: { fontSize: 16, color: '#444' }
});
