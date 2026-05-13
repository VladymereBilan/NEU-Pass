import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from './Button';

interface CameraCaptureModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onCaptured: (uri: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  visible,
  title,
  onClose,
  onCaptured,
}) => {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) {
        onCaptured(result.uri);
        onClose();
      }
    } catch (error) {
      setStatusMessage('Unable to capture image. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {!permission?.granted ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>
              Camera permission is required to capture images. You can proceed with
              manual entry if permission is denied.
            </Text>
            <Button title="Request Permission" onPress={requestPermission} />
            <Button title="Close" onPress={onClose} variant="secondary" />
          </View>
        ) : (
          <>
            <CameraView ref={cameraRef} style={styles.camera} />
            {statusMessage ? (
              <Text style={styles.status}>{statusMessage}</Text>
            ) : null}
            <View style={styles.actions}>
              <Button title="Capture" onPress={handleCapture} />
              <Button title="Close" onPress={onClose} variant="secondary" />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  camera: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 12,
    gap: 10,
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
  status: {
    color: '#fef3c7',
    marginTop: 8,
  },
});
