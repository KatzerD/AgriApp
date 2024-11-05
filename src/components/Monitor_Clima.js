/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, Sunrise, Sunset } from 'lucide-react-native';

// Tu clave de API de OpenWeather
const API_KEY = '8b1c8c90459663ba5fbf6846676c1cbc';
const DEFAULT_LOCATION = 'Ciudad del Este, Paraguay';

const InputLocation = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  const handleSubmit = () => {
    if (location.trim() === '') {
      alert('Por favor, ingresa una ubicación válida.');
      return;
    }
    onLocationSubmit(location);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su ubicación"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          Buscar
          <MapPin color="#fff" size={20} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const WeatherIcon = ({ condition }) => {
  switch (condition) {
    case 'Clear':
      return <Sun color="#FFD700" size={50} />;
    case 'Clouds':
      return <Cloud color="#A9A9A9" size={50} />;
    case 'Rain':
      return <CloudRain color="#4682B4" size={50} />;
    default:
      return <Sun color="#FFD700" size={50} />;
  }
};

const WeatherData = ({ data }) => {
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('es-ES');
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('es-ES');

  return (
    <ScrollView style={styles.weatherContainer}>
      <View style={styles.currentWeather}>
        <WeatherIcon condition={data.weather[0].main} />
        <Text style={styles.temperature}>{Math.round(data.main.temp)}°C</Text>
        <Text style={styles.description}>{data.weather[0].description}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Thermometer color="#4a9f4d" size={24} />
          <Text style={styles.detailText}>Sensación térmica: {Math.round(data.main.feels_like)}°C</Text>
        </View>
        <View style={styles.detailItem}>
          <Droplets color="#4a9f4d" size={24} />
          <Text style={styles.detailText}>Humedad: {data.main.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Wind color="#4a9f4d" size={24} />
          <Text style={styles.detailText}>Viento: {data.wind.speed} m/s, {data.wind.deg}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Sunrise color="#4a9f4d" size={24} />
          <Text style={styles.detailText}>Salida del sol: {sunrise}</Text>
        </View>
        <View style={styles.detailItem}>
          <Sunset color="#4a9f4d" size={24} />
          <Text style={styles.detailText}>Puesta del sol: {sunset}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default function ClimateScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeatherData = async (location) => {
    try {
      const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
      const geocodeResponse = await axios.get(geocodingUrl);

      // Verifica si la respuesta está vacía
      if (geocodeResponse.data.length === 0) {
        setErrorMessage('No se encontró la ubicación. Por favor, verifica el nombre de la ciudad.');
        return;
      }

      const { lat, lon } = geocodeResponse.data[0];

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
      const weatherResponse = await axios.get(weatherUrl);

      setWeatherData(weatherResponse.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener datos del clima:', error);
      setErrorMessage('Ocurrió un error al obtener los datos del clima. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    fetchWeatherData(DEFAULT_LOCATION);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoreo del Clima</Text>
      <InputLocation onLocationSubmit={fetchWeatherData} />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        weatherData ? <WeatherData data={weatherData} /> : <Text>Cargando datos del clima...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a9f4d',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#4a9f4d',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherContainer: {
    flex: 1,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 18,
    color: '#666',
  },
  details: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
