import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerFieldProps {
  label: string;
  value: string;
  mode: 'date' | 'month';
  onChange: (value: string) => void;
  placeholder?: string;
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const formatMonth = (date: Date) => date.toISOString().slice(0, 7);

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  mode,
  onChange,
  placeholder,
}) => {
  const [show, setShow] = useState(false);
  const initialDate = useMemo(() => {
    if (value) {
      return new Date(`${value}-01`);
    }
    return new Date();
  }, [value]);

  const handleChange = (_event: any, selected?: Date) => {
    setShow(false);
    if (!selected) return;
    const formatted = mode === 'month' ? formatMonth(selected) : formatDate(selected);
    onChange(formatted);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setShow(true)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder || 'Select date'}
        </Text>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={initialDate}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
    color: '#1f2937',
  },
  field: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  value: {
    color: '#111827',
  },
  placeholder: {
    color: '#9ca3af',
  },
});
