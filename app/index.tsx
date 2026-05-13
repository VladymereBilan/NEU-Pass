import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    if (role === 'Admin') {
      router.replace('/(admin)/home');
      return;
    }
    router.replace('/(guard)/home');
  }, [user, role, router]);

  return null;
}
