import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ onMenuPress }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="ios-menu" size={24} color="white" />
      </TouchableOpacity>
      <Text style={[styles.navbarText, { marginLeft: 80 }]}>SimpleCash</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    marginRight: 10,
  },
  navbar: {
    backgroundColor: '#365486',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Set width to 100% to span the entire width
  },  
  navbarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Navbar;
