import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react-native';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage('Revisa tu correo para restablecer la contraseña.');
        setIsError(false);
      })
      .catch(error => {
        setMessage(error.message);
        setIsError(true);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      {message ? (
        <View style={styles.messageContainer}>
          {isError ? (
            <AlertCircle color="#ff6b6b" size={24} style={styles.messageIcon} />
          ) : (
            <CheckCircle color="#4a9f4d" size={24} style={styles.messageIcon} />
          )}
          <Text style={[styles.message, isError && styles.errorMessage]}>{message}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Send color="#fff" size={24} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Enviar Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>Volver al inicio de sesión</Text>
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
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  messageIcon: {
    marginRight: 10,
  },
  message: {
    color: '#4a9f4d',
    flex: 1,
  },
  errorMessage: {
    color: '#ff6b6b',
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

export default ForgotPassword;
