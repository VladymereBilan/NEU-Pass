import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { QRDisplay } from '../../src/components/QRDisplay';
import { CameraCaptureModal } from '../../src/components/CameraCaptureModal';
import { OCRService } from '../../src/services/OCRService';
import { VisitorService } from '../../src/services/VisitorService';
import { QRService } from '../../src/services/QRService';
import { validateVisitorForm } from '../../src/utils/validation';

export default function RegisterVisitorScreen() {
  const [idImageUri, setIdImageUri] = useState<string | null>(null);
  const [faceUri, setFaceUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [passNumber, setPassNumber] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIdCamera, setShowIdCamera] = useState(false);
  const [showFaceCamera, setShowFaceCamera] = useState(false);

  const handleRunOcr = async () => {
    if (!idImageUri) {
      Alert.alert('Missing ID image', 'Capture the ID image first.');
      return;
    }
    const result = await OCRService.extract(idImageUri, false);
    setFullName(result.fullName);
    setAddress(result.address);
    setIdType(result.idType);
    setIdNumber(result.idNumber);
  };

  const handleAssignPass = async () => {
    const nextPass = await VisitorService.getNextPassNumber();
    setPassNumber(nextPass);
    setQrValue(QRService.generateQrValue(nextPass, 0));
  };

  const handleSave = async () => {
    const missing = validateVisitorForm({
      fullName,
      address,
      idType,
      idNumber,
      purposeOfVisit,
    });
    if (missing.length > 0) {
      Alert.alert('Missing fields', `Please fill: ${missing.join(', ')}`);
      return;
    }
    if (!passNumber) {
      Alert.alert('Assign pass', 'Assign a Visitor Pass before saving.');
      return;
    }

    setLoading(true);
    try {
      const result = await VisitorService.registerVisitor({
        fullName,
        address,
        idType,
        idNumber,
        idImageUri,
        purposeOfVisit,
        checkinFaceUri: faceUri,
      });

      Alert.alert(
        'Visitor checked in',
        `Pass ${result.passNumber} assigned. Time-in recorded.`
      );

      setIdImageUri(null);
      setFaceUri(null);
      setFullName('');
      setAddress('');
      setIdType('');
      setIdNumber('');
      setPurposeOfVisit('');
      setPassNumber('');
      setQrValue('');
    } catch (error) {
      Alert.alert('Save failed', 'Unable to save visitor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Register Visitor</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ID Capture & OCR</Text>
        <Button title="Scan / Capture ID" onPress={() => setShowIdCamera(true)} />
        {idImageUri ? (
          <Image source={{ uri: idImageUri }} style={styles.preview} />
        ) : null}
        <Button title="Run OCR / Extract Info" onPress={handleRunOcr} />
      </View>

      <Input label="Full Name" value={fullName} onChangeText={setFullName} />
      <Input label="Address" value={address} onChangeText={setAddress} />
      <Input label="ID Type" value={idType} onChangeText={setIdType} />
      <Input label="ID Number" value={idNumber} onChangeText={setIdNumber} />
      <Input
        label="Purpose of Visit"
        value={purposeOfVisit}
        onChangeText={setPurposeOfVisit}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facial Recognition (Check-in)</Text>
        <Button
          title="Capture Facial Image"
          onPress={() => setShowFaceCamera(true)}
        />
        {faceUri ? (
          <Image source={{ uri: faceUri }} style={styles.facePreview} />
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visitor Pass Assignment</Text>
        <Button title="Assign Visitor Pass" onPress={handleAssignPass} />
        {passNumber ? (
          <View style={styles.passBox}>
            <Text style={styles.passText}>Pass Number: {passNumber}</Text>
            {qrValue ? <QRDisplay value={qrValue} label="Pass QR" /> : null}
          </View>
        ) : null}
      </View>

      <Button
        title={loading ? 'Saving...' : 'Save and Time-In'}
        onPress={handleSave}
        disabled={loading}
      />

      <CameraCaptureModal
        visible={showIdCamera}
        title="Capture Visitor ID"
        onClose={() => setShowIdCamera(false)}
        onCaptured={setIdImageUri}
      />

      <CameraCaptureModal
        visible={showFaceCamera}
        title="Capture Check-in Face"
        onClose={() => setShowFaceCamera(false)}
        onCaptured={setFaceUri}
      />
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0b3d91',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1f2937',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },
  facePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 8,
  },
  passBox: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  passText: {
    fontWeight: '600',
  },
});
