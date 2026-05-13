import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from '../src/context/AuthContext';
import { initDatabase } from '../src/database/db';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDatabase();
        setReady(true);
      } catch (err) {
        setError('Failed to initialize database.');
      }
    };
    bootstrap();
  }, []);

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>NEU-Pass</Text>
        <Text style={styles.subtitle}>Loading secure visitor system...</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b3d91',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 8,
    color: '#e0f2fe',
  },
  error: {
    marginTop: 12,
    color: '#fee2e2',
  },
});
