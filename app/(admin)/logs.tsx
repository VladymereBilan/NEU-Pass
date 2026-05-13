import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { DatePickerField } from '../../src/components/DatePickerField';
import { VisitorCard } from '../../src/components/VisitorCard';
import { ReportService } from '../../src/services/ReportService';
import { formatTime } from '../../src/utils/date';

const statusOptions = ['Active', 'Completed', ''];

export default function AdminLogsScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  const handleSearch = async () => {
    const result = await ReportService.searchLogs({
      name: name.trim() || undefined,
      status: status || undefined,
      purpose: purpose.trim() || undefined,
      date: date.trim() || undefined,
      month: month.trim() || undefined,
    });
    setLogs(result);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>All Visitor Logs</Text>
      <Input label="Search Name" value={name} onChangeText={setName} />
      <Input label="Purpose" value={purpose} onChangeText={setPurpose} />
      <DatePickerField
        label="Date"
        value={date}
        mode="date"
        onChange={setDate}
        placeholder="Select date"
      />
      <DatePickerField
        label="Month"
        value={month}
        mode="month"
        onChange={setMonth}
        placeholder="Select month"
      />

      {statusOptions.map((option) => (
        <Button
          key={option || 'all'}
          title={option || 'All Status'}
          onPress={() => setStatus(option)}
          variant={status === option ? 'primary' : 'secondary'}
        />
      ))}

      <Button title="Apply Filters" onPress={handleSearch} />

      {logs.map((log) => (
        <VisitorCard
          key={log.logId}
          name={log.fullName}
          purpose={log.purposeOfVisit}
          timeIn={formatTime(log.timeIn)}
          status={log.logStatus}
          onPress={() =>
            router.push({
              pathname: '/(admin)/visitor-details',
              params: { logId: String(log.logId) },
            })
          }
        />
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
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
});
