import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const MenuModal = ({ isVisible, onClose, navigation }) => {
  const handleLogout = async () => {
    try {
      // Check if the token exists
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // Token exists, so remove it from AsyncStorage
        await AsyncStorage.removeItem('token');
        console.log('Token removed successfully.');

        // Navigate to the login screen
        navigation.navigate('Login');
      } else {
        console.warn('No token found. User is already logged out.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // Use effect to monitor changes in token
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // Token deleted, navigate to login screen
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="ios-close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('Go to Home')}
          style={styles.modalItem}
        >
          <Ionicons name="ios-home" size={24} color="white" />
          <Text style={styles.modalText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Regis')}
          style={styles.modalItem}
        >
          <AntDesign name="menufold" size={24} color="white" />
          <Text style={styles.modalText}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Product')}
          style={styles.modalItem}
        >
          <Ionicons name="ios-cog" size={24} color="white" />
          <Text style={styles.modalText}>Manage Product</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.modalItem}>
          <Ionicons name="ios-log-out" size={24} color="white" />
          <Text style={styles.modalText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 26,
  },
  modalContent: {
    backgroundColor: '#565555',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FFFFFF',
  },
});

export default MenuModal;
