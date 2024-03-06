import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const WelcomeText = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTextDesk}>
        Please make payment by scanning the QR code !!
      </Text>
    </View>
  );
};

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

const Paymentscreen = ({ navigation, route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [apiResponseData, setApiResponseData] = useState(null);

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        await AsyncStorage.removeItem('token');
        console.log('Token removed successfully.');
        navigation.navigate('Login');
      } else {
        console.warn('No token found. User is already logged out.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, []);

  const handleNextPress = async () => {
    try {
      const { paymentData } = route.params;

      // Prepare data for the API request
      const apiData = {
        email: paymentData.email,
        nama: paymentData.nama,
        no_telp: paymentData.no_telp,
        alamat: paymentData.alamat,
        data_pesanan: paymentData.data_pesanan,
        pembayaran: paymentData.pembayaran,
      };

      // Make a POST request to the API
      const response = await axios.post(
        'http://10.0.2.2:8080/petugas/add_penjualan',
        apiData,
      );

      // Handle the response from the API as needed
      console.log('API response:', response.data);

      // Store the API response data
      setApiResponseData(response.data);

      // Now navigate to the 'Transaksion' screen
      navigation.navigate('Transaksion', { apiResponseData: response.data });
    } catch (error) {
      console.error('Error making API request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Navbar/>
      </View>
      <WelcomeText />
      {/* QR Code Image */}
      <Image
        source={require('../assets/qrcode.jpg')}
        style={styles.qrCodeImage}
      />
      {/* Next Button */}
      <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        visible={isModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.closeButton}
            >
              <Ionicons name="ios-close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Go to Home')}
              style={styles.modalItem}
            >
              <Ionicons name="ios-home" size={24} color="black" />
              <Text style={styles.modalText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Regis')}
              style={styles.modalItem}
            >
              <AntDesign name="menufold" size={24} color="black" />
              <Text style={styles.modalText}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Product')}
              style={styles.modalItem}
            >
              <Ionicons name="ios-cog" size={24} color="black" />
              <Text style={styles.modalText}>Manage Product</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.modalItem}>
              <Ionicons name="ios-log-out" size={24} color="black" />
              <Text style={styles.modalText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#C9D7DD',
  },
  menuButton: {
    marginRight: 10,
  },
  navbar: {
    backgroundColor: '#365486',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginLeft: 10,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20, // Ubah nilai ini sesuai kebutuhan Anda
  },
  nextButton: {
    backgroundColor: '#365486',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Ubah nilai ini sesuai kebutuhan Anda
    width: '50%',
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeTextDesk: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center', 
    marginLeft: 5,
  },
  welcomeSection: {
    alignItems: 'center', // Align to the center
    marginTop: '40%',
  },
  welcomeTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left', // Align to the left
    marginLeft: 5,
  },
});

export default Paymentscreen;
