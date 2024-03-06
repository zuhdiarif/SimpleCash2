import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

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

const Transaksionscreen = ({ route }) => {
  const { apiResponseData } = route.params;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [transactionsReset, setTransactionsReset] = useState(false);

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

  const resetTransactions = () => {
    setTransactionsReset(true);
    console.log('Resetting transactions...');
  };

  const resetTransactionsAndNavigateToRegis = () => {
    resetTransactions();
    navigation.navigate('Regis');
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

  return (
    <View style={styles.container}>
      <Navbar/>
      <View style={styles.receipt}>
        <View style={styles.receiptHeader}>
          <Text style={styles.storeName}>Simple Cash</Text>
          <Text style={styles.address}>Jl. Tanimbar No.22 Malang</Text>
          <Text style={styles.transactionId}>
            {apiResponseData.data.tanggal_transaksi}/
            {apiResponseData.data.id_transaksi}/
            {apiResponseData.data.nama_kasir}
          </Text>
        </View>
        <View style={styles.receiptProducts}>
          {apiResponseData.data.data_pesanan &&
            apiResponseData.data.data_pesanan.map((product, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productName}>{product.nama_produk}</Text>
                <Text style={styles.productQuantity}>
                  x{product.jumlah_produk}
                </Text>
                <Text style={styles.productPrice}>Rp. {product.sub_total}</Text>
              </View>
            ))}
        </View>
        <View style={styles.receiptTotals}>
          <View style={styles.totalLine}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>
              Rp. {apiResponseData.data.total_transaksi}
            </Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.adminFeesLabel}>Admin fees:</Text>
            <Text style={styles.adminFeesValue}>Rp. 500</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>
              Rp. {apiResponseData.data.total_transaksi}
            </Text>
          </View>
        </View>
        <Text style={styles.receiptFooter}>Thank you for shopping here!</Text>
      </View>
        <TouchableOpacity
          style={styles.doneButtonContainer}
          onPress={resetTransactionsAndNavigateToRegis}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
  arrowRightButton: {
    marginLeft: 'auto',
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
  receipt: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    paddingTop: 8, // Add this line
    borderRadius: 4, // Add this line
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
    marginTop: '35%',
  },
  receiptHeader: {
    marginBottom: 16, // Increase marginBottom to 16
  },
  storeName: {
    fontSize: 20, // Decrease fontSize to 20
    fontWeight: 'bold',
    textAlign: 'center', // Add this line
  },
  address: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center', // Add this line
  },
  transactionId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center', // Add this line
    fontWeight: 'bold', // Add this line to make the text bold
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  receiptProducts: {
    marginBottom: 16,
    borderBottomWidth: 1, // Add this line
    borderColor: '#ccc', // Add this line
    paddingBottom: 12, // Add this line
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
  },
  productQuantity: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  receiptTotalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  receiptTotals: {
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right', // Add this line
  },
  adminFeesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminFeesValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right', // Add this line
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right', // Add this line
  },
  receiptFooter: {
    fontSize: 14,
    textAlign: 'center',
  },
  receiptTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  doneButtonContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#365486', // Change background color to #365486
    padding: 10, // Add padding for better appearance
    alignSelf: 'center', // Center the button horizontally
    width: '30%',
  },
  doneButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Transaksionscreen;
