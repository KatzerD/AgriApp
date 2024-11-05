import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        sendEmailVerification(user)
          .then(() => {
            setMessage('Registro exitoso. Revisa tu correo para verificar tu cuenta.');
            navigation.replace('Login');
          })
          .catch(() => setError('Error al enviar el correo de verificación.'));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {error ? (
        <View style={styles.messageContainer}>
          <AlertCircle color="#ff6b6b" size={24} style={styles.messageIcon} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
      {message ? (
        <View style={styles.messageContainer}>
          <CheckCircle color="#4a9f4d" size={24} style={styles.messageIcon} />
          <Text style={styles.message}>{message}</Text>
        </View>
      ) : null}
      <View style={styles.inputContainer}>
        <Mail color="#4a9f4d" size={24} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Lock color="#4a9f4d" size={24} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Lock color="#4a9f4d" size={24} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <UserPlus color="#fff" size={24} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a9f4d',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  messageIcon: {
    marginRight: 10,
  },
  error: {
    color: '#ff6b6b',
    flex: 1,
  },
  message: {
    color: '#4a9f4d',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4a9f4d',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a9f4d',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#4a9f4d',
    fontSize: 16,
  },
});

export default Register;
