import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { useAuth } from '../src/context/AuthContext';
import { validateSignUp } from '../src/utils/validation';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const missing = validateSignUp({ username, password, confirmPassword });
    if (missing.length > 0) {
      Alert.alert('Check fields', missing.join(', '));
      return;
    }

    setLoading(true);
    const user = await signUp(username.trim(), password);
    setLoading(false);

    if (!user) {
      Alert.alert('Sign up failed', 'Username already exists.');
      return;
    }

    router.replace('/(guard)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Guard Account</Text>
      <Text style={styles.subtitle}>Sign up for a guard login</Text>

      <View style={styles.card}>
        <Input label="Username" value={username} onChangeText={setUsername} />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button
          title={loading ? 'Creating...' : 'Sign Up'}
          onPress={handleSignUp}
          disabled={loading}
        />
        <Button
          title="Back to Login"
          onPress={() => router.replace('/login')}
          variant="secondary"
        />
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
    fontSize: 26,
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
});
