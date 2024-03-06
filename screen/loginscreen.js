import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import bgImage from '../assets/c9d7dd.png';

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

const InnerContainer = () => {
  return (
    <View style={styles.innerContainer}>
      <Text style={styles.innerText}>Login</Text>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const jwtToken = await loginUser(email, password);
  
      if (jwtToken) {
        // Save the JWT token to AsyncStorage directly
        await AsyncStorage.setItem('token', jwtToken);
  
        // Attach the JWT token to the headers of axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  
        // Navigate to the main app screen
        navigation.navigate('Regis');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };
  
  

  const handleMenuPress = () => {
    // Logika menu
  };

  return (
    <View style={styles.container}>
      <Navbar onMenuPress={handleMenuPress} />
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        <View style={styles.outerContainer}>
          <InnerContainer />
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="email"
              value={email}
              onChangeText={(text) => setemail(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
  },
  navbar: {
    backgroundColor: '#365486',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 10,
  },
  navbarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderEndColor: 'black',
  },
  innerContainer: {
    // Gaya inner container
    marginBottom: 20,
  },
  innerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderEndColor: 'black',
  },
  inputText: {
    height: 30,
    color: 'black',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
    marginTop: 10,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;