import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminLayout() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.replace('/login');
      return;
    }
    if (role !== 'Admin') {
      router.replace('/(guard)/home');
    }
  }, [role, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
      }}
    />
  );
}
