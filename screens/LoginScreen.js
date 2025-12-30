import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  gold: '#d4af37',
  black: '#000000',
  white: '#ffffff',
  background: '#f4f4f4',
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
        setError('Por favor ingrese usuario y contraseña');
        return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      }
      // If success, AuthContext acts and App.js switches stack automatically
    } catch (e) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
             <Image
                source={require('../assets/homeLogo4.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>

        <Surface style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          <TextInput
            label="Usuario / Correo"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={COLORS.gold}
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={COLORS.gold}
            secureTextEntry={secureTextEntry}
            right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
            left={<TextInput.Icon icon="lock" />}
          />

          {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={{ height: 50 }}
          >
            INGRESAR
          </Button>

          <Button 
            mode="text" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            labelStyle={{ color: COLORS.black }}
          >
            Volver al inicio
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 120,
  },
  card: {
    padding: 30,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.gold,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  backButton: {
    marginTop: 15,
  }
});
