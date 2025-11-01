/**
 * Index Screen (Splash / Auth Check)
 * 
 * This screen is shown when the app first loads.
 * It checks if the user is authenticated and redirects accordingly.
 */

import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '@stores/appStore';

export default function IndexScreen() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const userEmail = await SecureStore.getItemAsync('userEmail');

      if (accessToken && userEmail) {
        // User is authenticated
        setAuthenticated(true, userEmail);
        router.replace('/(tabs)/inbox');
      } else {
        // User is not authenticated, navigate to login
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FridayOS</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});
