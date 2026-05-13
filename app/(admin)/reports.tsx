import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { DatePickerField } from '../../src/components/DatePickerField';
import { ReportService } from '../../src/services/ReportService';

export default function ReportsScreen() {
  const [counts, setCounts] = useState<any[]>([]);
  const [dailyDate, setDailyDate] = useState('');
  const [monthlyKey, setMonthlyKey] = useState('');
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);
  const [monthlyLogs, setMonthlyLogs] = useState<any[]>([]);

  useEffect(() => {
    ReportService.getCountsByStatus().then(setCounts);
  }, []);

  const loadDaily = async () => {
    const data = await ReportService.getDailyLogs(dailyDate);
    setDailyLogs(data);
  };

  const loadMonthly = async () => {
    const data = await ReportService.getMonthlyLogs(monthlyKey);
    setMonthlyLogs(data);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reports</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Summary</Text>
        {counts.map((item) => (
          <Text key={item.log_status} style={styles.meta}>
            {item.log_status}: {item.count}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Logs</Text>
        <DatePickerField
          label="Date"
          value={dailyDate}
          mode="date"
          onChange={setDailyDate}
          placeholder="Select date"
        />
        <Button title="Load Daily Logs" onPress={loadDaily} />
        {dailyLogs.map((log) => (
          <Text key={log.logId} style={styles.meta}>
            {log.fullName} - {log.purposeOfVisit} ({log.logStatus})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Logs</Text>
        <DatePickerField
          label="Month"
          value={monthlyKey}
          mode="month"
          onChange={setMonthlyKey}
          placeholder="Select month"
        />
        <Button title="Load Monthly Logs" onPress={loadMonthly} />
        {monthlyLogs.map((log) => (
          <Text key={log.logId} style={styles.meta}>
            {log.fullName} - {log.purposeOfVisit} ({log.logStatus})
          </Text>
        ))}
      </View>

      <Text style={styles.note}>
        Exportable reports will be added in Capstone 2.
      </Text>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1f2937',
  },
  meta: {
    color: '#374151',
  },
  note: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
