import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function GuardLayout() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.replace('/login');
      return;
    }
    if (role !== 'Guard') {
      router.replace('/(admin)/home');
    }
  }, [role, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0b3d91' },
        headerTintColor: '#ffffff',
      }}
    />
  );
}
