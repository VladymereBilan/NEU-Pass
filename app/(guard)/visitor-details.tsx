import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VisitorService } from '../../src/services/VisitorService';
import { StatusBadge } from '../../src/components/StatusBadge';
import { formatDate, formatTime } from '../../src/utils/date';

export default function GuardVisitorDetails() {
  const { logId } = useLocalSearchParams();
  const [details, setDetails] = useState<any | null>(null);

  useEffect(() => {
    if (!logId) return;
    VisitorService.getLogDetails(Number(logId)).then(setDetails);
  }, [logId]);

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading visitor details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{details.fullName}</Text>
      <StatusBadge status={details.logStatus} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visitor Info</Text>
        <Text style={styles.meta}>Address: {details.address}</Text>
        <Text style={styles.meta}>ID Type: {details.idType}</Text>
        <Text style={styles.meta}>ID Number: {details.idNumber}</Text>
        <Text style={styles.meta}>Purpose: {details.purposeOfVisit}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log Info</Text>
        <Text style={styles.meta}>Time-in: {formatTime(details.timeIn)}</Text>
        <Text style={styles.meta}>Time-out: {formatTime(details.timeOut)}</Text>
        <Text style={styles.meta}>Date: {formatDate(details.timeIn)}</Text>
        <Text style={styles.meta}>Pass: {details.passNumber}</Text>
        <Text style={styles.meta}>ID Status: {details.surrenderedIdStatus}</Text>
        <Text style={styles.meta}>Pass Return: {details.passReturnStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Face Verification</Text>
        <StatusBadge status={details.faceVerificationStatus} />
        {details.checkinFaceUri ? (
          <Image source={{ uri: details.checkinFaceUri }} style={styles.face} />
        ) : null}
        {details.checkoutFaceUri ? (
          <Image source={{ uri: details.checkoutFaceUri }} style={styles.face} />
        ) : null}
      </View>
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
    color: '#0b3d91',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1f2937',
  },
  meta: {
    color: '#374151',
  },
  face: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 8,
  },
});
