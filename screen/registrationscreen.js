import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import MenuModal from '../component/MenuModal1';
import { RefreshControl } from 'react-native';

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

// ... (existing imports)

const WelcomeText = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeText}>Hello,welcome to our store!</Text>
      <Text style={styles.welcomeText}>Please Complete the personal data</Text>
    </View>
  );
};

const InnerContainer = ({ children }) => {
  return <View style={styles.innerContainer}>{children}</View>;
};

const RegistrationScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');

  const handleRegistration = async () => {
    if (Name && email && number && Address) {
      // Registration successful, navigate to the menu page with the user data
      navigation.navigate('Menu', {
        name: Name,
        userEmail: email,
        phoneNumber: number,
        userAddress: Address,
      });
    } else {
      // Handle registration failure or show an error message
      console.log('Please fill in all the fields');
    }
  };

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

  const handleMenuPress = () => {
    // Close the modal if it's already open
    if (isMenuModalVisible) {
      setMenuModalVisible(false);
    } else {
      // Open the menu modal
      setMenuModalVisible(true);
    }
  };
  const handleModalClose = () => {
    setMenuModalVisible(false);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
  
      // Fetch the updated data or perform any necessary actions
      // ...
  
      // Clear the form fields
      setName('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
  
      console.log('Data refreshed successfully.');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar onMenuPress={handleMenuPress} />
      <MenuModal
        isVisible={isMenuModalVisible}
        onClose={handleModalClose}
        navigation={navigation}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']} // Set the color of the loading indicator
          />
        }
      >
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        {/* Section 1: Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, welcome to our store!</Text>
          <Text style={styles.welcomeText}>
            Please Complete the personal data
          </Text>
        </View>

        {/* Section 2: Registration Form */}
        <View style={styles.innerContainer}>
          <Text style={styles.innerText}>Customer data</Text>
          <View style={styles.registrationForm}>
            {/* Registration Form Inputs */}
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Name"
              value={Name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Address"
              value={Address}
              onChangeText={(text) => setAddress(text)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Phone number"
              value={number}
              onChangeText={(text) => setPhoneNumber(text)}
            />

            {/* Registration Button */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegistration}
            >
              <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      </ScrollView>
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
  outerContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Untuk memberikan efek transparansi
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
    borderRadius: 30,
    padding: 20,
    marginTop: 20,
    position: 'relative',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderEndColor: 'black',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
  innerTransparentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  innerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registrationForm: {
    width: '100%',
    marginTop: 20,
  },
  inputText: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderEndColor: 'black',
  },
  registerBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '26%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default RegistrationScreen;
