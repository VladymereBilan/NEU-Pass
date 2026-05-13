import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from './StatusBadge';

interface VisitorCardProps {
  name: string;
  purpose: string;
  timeIn: string;
  status: string;
  passNumber?: string | null;
  onPress?: () => void;
}

export const VisitorCard: React.FC<VisitorCardProps> = ({
  name,
  purpose,
  timeIn,
  status,
  passNumber,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.meta}>Purpose: {purpose}</Text>
      <Text style={styles.meta}>Time-in: {timeIn}</Text>
      {passNumber ? <Text style={styles.meta}>Pass: {passNumber}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#374151',
  },
});
