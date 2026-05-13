import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { AuthService } from '../../src/services/AuthService';
import { StatusBadge } from '../../src/components/StatusBadge';

export default function AccountsScreen() {
  const [guards, setGuards] = useState<any[]>([]);

  const loadGuards = async () => {
    const data = await AuthService.listGuardAccounts();
    setGuards(data);
  };

  useEffect(() => {
    loadGuards();
  }, []);

  const toggleStatus = async (guard: any) => {
    const nextStatus = guard.account_status === 'Active' ? 'Blocked' : 'Active';
    await AuthService.updateAccountStatus(guard.user_id, nextStatus);
    loadGuards();
  };

  const deleteAccount = async (guard: any) => {
    Alert.alert('Delete account', 'Are you sure you want to delete this guard?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await AuthService.deleteAccount(guard.user_id);
          loadGuards();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Guard Accounts</Text>
      {guards.map((guard) => (
        <View key={guard.user_id} style={styles.card}>
          <Text style={styles.name}>{guard.username}</Text>
          <StatusBadge status={guard.account_status} />
          <View style={styles.actions}>
            <Button
              title={guard.account_status === 'Active' ? 'Block' : 'Unblock'}
              onPress={() => toggleStatus(guard)}
              variant="secondary"
            />
            <Button title="Delete" onPress={() => deleteAccount(guard)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 18,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  name: {
    fontWeight: '700',
    color: '#1f2937',
  },
  actions: {
    gap: 8,
  },
});
