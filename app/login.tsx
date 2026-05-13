import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const user = await login(username.trim(), password);
    setLoading(false);

    if (!user) {
      Alert.alert('Login failed', 'Invalid credentials or blocked account.');
      return;
    }

    router.replace(user.role === 'Admin' ? '/(admin)/home' : '/(guard)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEU-Pass</Text>
      <Text style={styles.subtitle}>Visitor Management System</Text>

      <View style={styles.card}>
        <Input label="Username" value={username} onChangeText={setUsername} />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Demo Credentials</Text>
        <Text style={styles.demoText}>Guard: guard01 / guard123</Text>
        <Text style={styles.demoText}>Admin: admin01 / admin123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b3d91',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#475569',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  demoBox: {
    marginTop: 20,
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 10,
  },
  demoTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  demoText: {
    color: '#1f2937',
  },
});
