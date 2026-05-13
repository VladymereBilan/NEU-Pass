import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { VisitorService } from '../../src/services/VisitorService';
import { VisitorCard } from '../../src/components/VisitorCard';
import { formatTime } from '../../src/utils/date';

export default function CompletedLogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);

  const loadLogs = async () => {
    const result = await VisitorService.listCompletedLogs();
    setLogs(result);
  };

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Completed Logs</Text>
      {logs.length === 0 ? (
        <Text style={styles.empty}>No completed logs yet.</Text>
      ) : (
        logs.map((log) => (
          <VisitorCard
            key={log.logId}
            name={log.fullName}
            purpose={log.purposeOfVisit}
            timeIn={formatTime(log.timeIn)}
            status={log.logStatus}
            passNumber={log.passNumber}
            onPress={() =>
              router.push({
                pathname: '/(guard)/visitor-details',
                params: { logId: String(log.logId) },
              })
            }
          />
        ))
      )}
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
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0b3d91',
    marginBottom: 12,
  },
  empty: {
    color: '#6b7280',
  },
});
