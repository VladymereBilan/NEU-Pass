import React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';

export default function GuardHome() {
  const router = useRouter();
  const { user, logout, updateProfileImage } = useAuth();

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to update profile.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        {user?.profileImageUri ? (
          <Image source={{ uri: user.profileImageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.username?.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.title}>Welcome, {user?.username}</Text>
          <Text style={styles.subtitle}>Guard Control Panel</Text>
          <Button
            title="Change Profile Photo"
            onPress={handleChangePhoto}
            variant="secondary"
          />
        </View>
      </View>

      <View style={styles.menu}>
        <Button
          title="Register Visitor"
          onPress={() => router.push('/(guard)/register-visitor')}
        />
        <Button
          title="Active Logs"
          onPress={() => router.push('/(guard)/active-logs')}
          variant="secondary"
        />
        <Button
          title="Checkout"
          onPress={() => router.push('/(guard)/checkout')}
        />
        <Button
          title="Completed Logs"
          onPress={() => router.push('/(guard)/completed-logs')}
          variant="secondary"
        />
        <Button title="Logout" onPress={logout} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  profileRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#0b3d91',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0b3d91',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b3d91',
  },
  subtitle: {
    color: '#475569',
  },
  menu: {
    gap: 12,
  },
});
