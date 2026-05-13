import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { StatusBadge } from '../../src/components/StatusBadge';
import { CameraCaptureModal } from '../../src/components/CameraCaptureModal';
import { VisitorService } from '../../src/services/VisitorService';
import { FaceVerificationService } from '../../src/services/FaceVerificationService';

const verificationOptions = ['Matched', 'Not Matched', 'Manual Review'] as const;

export default function CheckoutScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [checkoutFaceUri, setCheckoutFaceUri] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('Manual Review');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState('Name Search');
  const [showFaceCamera, setShowFaceCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if ((scannerOpen || showFaceCamera) && !permission?.granted) {
      requestPermission();
    }
  }, [scannerOpen, showFaceCamera, permission, requestPermission]);

  const handleSearch = async () => {
    const list = await VisitorService.searchActiveByName(query);
    setResults(list);
  };

  const handleSelect = async (logId: number) => {
    const detail = await VisitorService.getLogDetails(logId);
    setSelected(detail);
    setResults([]);
    setCheckoutMethod('Name Search');
  };

  const handleQrScanned = async (data: string) => {
    const record = await VisitorService.getActiveByQrValue(data);
    if (!record) {
      Alert.alert('Not found', 'No active visitor with this pass.');
      return;
    }
    setSelected(record);
    setCheckoutMethod('QR Scan');
    setScannerOpen(false);
  };

  const handleComplete = async () => {
    if (!selected) {
      Alert.alert('Select visitor', 'Search or scan to select a visitor.');
      return;
    }
    if (!checkoutFaceUri) {
      Alert.alert('Capture face', 'Capture checkout face image first.');
      return;
    }

    const compare = await FaceVerificationService.compareFaces(
      selected.checkinFaceUri,
      checkoutFaceUri,
      verificationStatus as any
    );

    await VisitorService.completeCheckout({
      logId: selected.logId,
      visitorId: selected.visitorId,
      checkoutFaceUri,
      faceVerificationStatus: compare.status,
      checkoutMethod,
      verificationNotes: verificationNotes || compare.notes,
    });

    Alert.alert('Checkout complete', 'Visitor log has been completed.');
    setSelected(null);
    setCheckoutFaceUri(null);
    setVerificationNotes('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Checkout Visitor</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Visitor</Text>
        <Button title="Scan Visitor Pass QR" onPress={() => setScannerOpen(true)} />
        <Input
          label="Search by Name"
          value={query}
          onChangeText={setQuery}
          placeholder="Enter visitor name"
        />
        <Button title="Search" onPress={handleSearch} variant="secondary" />
        {results.map((item) => (
          <Button
            key={item.logId}
            title={`${item.fullName} - ${item.passNumber || 'No Pass'}`}
            onPress={() => handleSelect(item.logId)}
            variant="secondary"
          />
        ))}
      </View>

      {selected ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visitor Details</Text>
          <Text style={styles.meta}>Name: {selected.fullName}</Text>
          <Text style={styles.meta}>Address: {selected.address}</Text>
          <Text style={styles.meta}>ID: {selected.idNumber}</Text>
          <Text style={styles.meta}>Purpose: {selected.purposeOfVisit}</Text>
          <Text style={styles.meta}>Time-in: {selected.timeIn}</Text>
          <Text style={styles.meta}>Pass: {selected.passNumber}</Text>
          <StatusBadge status="Active" />
          {selected.checkinFaceUri ? (
            <Image source={{ uri: selected.checkinFaceUri }} style={styles.face} />
          ) : null}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Face Verification</Text>
        <Button
          title="Capture Checkout Face"
          onPress={() => setShowFaceCamera(true)}
          variant="secondary"
        />
        <CameraCaptureModal
          visible={showFaceCamera}
          title="Capture Checkout Face"
          onClose={() => setShowFaceCamera(false)}
          onCaptured={setCheckoutFaceUri}
        />
        {checkoutFaceUri ? (
          <Image source={{ uri: checkoutFaceUri }} style={styles.face} />
        ) : null}
        <Text style={styles.meta}>Verification Result</Text>
        <View style={styles.optionRow}>
          {verificationOptions.map((option) => (
            <Button
              key={option}
              title={option}
              onPress={() => setVerificationStatus(option)}
              variant={verificationStatus === option ? 'primary' : 'secondary'}
            />
          ))}
        </View>
        <Input
          label="Verification Notes"
          value={verificationNotes}
          onChangeText={setVerificationNotes}
          placeholder="Optional"
        />
      </View>

      <Button title="Complete Checkout" onPress={handleComplete} />

      <Modal visible={scannerOpen} animationType="slide">
        <View style={styles.scannerContainer}>
          <Text style={styles.scannerTitle}>Scan Visitor Pass</Text>
          {!permission?.granted ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>
                Camera permission is required for QR scanning. You can use name
                search if permission is denied.
              </Text>
              <Button title="Request Permission" onPress={requestPermission} />
            </View>
          ) : (
            <CameraView
              style={styles.scanner}
              onBarcodeScanned={(scan) => handleQrScanned(scan.data)}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          )}
          <Button title="Close" onPress={() => setScannerOpen(false)} />
        </View>
      </Modal>
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
    gap: 14,
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
    gap: 10,
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
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scannerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  scannerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  scanner: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  permissionBox: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  permissionText: {
    color: '#e5e7eb',
  },
});
