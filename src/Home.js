import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cloud, Calendar, Package } from 'lucide-react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a AgriApp</Text>
      <Text style={styles.subtitle}>Gestión organizativa para su negocio agricultor</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Monitor_Clima')}
        >
          <Cloud color="#fff" size={24} />
          <Text style={styles.buttonText}>Monitoreo del Clima</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Calendario')}
        >
          <Calendar color="#ffff" size={24} />
          <Text style={styles.buttonText}>Calendario de Siembra</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Inventario')}
        >
          <Package color="#fff" size={24} />
          <Text style={styles.buttonText}>Inventario de Granos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a9f4d',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#4a9f4d',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
