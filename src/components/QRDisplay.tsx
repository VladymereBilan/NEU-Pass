import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRDisplayProps {
  value: string;
  label?: string;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ value, label }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.qrBox}>
        <QRCode value={value} size={160} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  qrBox: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  value: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
});
