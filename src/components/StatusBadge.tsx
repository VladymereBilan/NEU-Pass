import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#e0f2fe', text: '#0369a1' },
  Completed: { bg: '#dcfce7', text: '#166534' },
  Surrendered: { bg: '#fee2e2', text: '#991b1b' },
  Returned: { bg: '#fef9c3', text: '#854d0e' },
  Matched: { bg: '#dcfce7', text: '#166534' },
  'Not Matched': { bg: '#fee2e2', text: '#991b1b' },
  'Manual Review': { bg: '#e0f2fe', text: '#0369a1' },
  Pending: { bg: '#fef9c3', text: '#854d0e' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = statusColors[status] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}> 
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
