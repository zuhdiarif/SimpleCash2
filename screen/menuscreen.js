import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShoppingCart from '../component/shoppingcart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const Navbar = ({ onMenuPress, selectedProductsCount }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="ios-menu" size={24} color="white" />
      </TouchableOpacity>
      <Text style={[styles.navbarText, { marginLeft: 80 }]}>SimpleCash</Text>
    </View>
  );
};

const ProductItem = ({ item, onChoose, dataFromDatabase }) => {
  const [showActions, setShowActions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProductAdded, setIsProductAdded] = useState(false);

  useEffect(() => {
    setIsProductAdded(false); // Reset isProductAdded when component mounts or data is refreshed
  }, [dataFromDatabase]);

  const handleChoose = () => {
    const selectedProduct = {
      id_produk: item.id_produk,
      nama_produk: item.nama_produk,
      harga: item.harga,
      quantity: quantity,
      link_gambar: item.link_gambar.replace('127.0.0.1', '10.0.2.2'), // Pass the modified image link
    };

    onChoose(selectedProduct);
    setShowActions(false);
  };

  const handleAddQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleSubtractQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddProduct = () => {
    setIsProductAdded(true);
    setShowActions(true);
  };

  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => setShowActions(!showActions)}
    >
      <Image
        source={{ uri: item.link_gambar.replace('127.0.0.1', '10.0.2.2') }}
        style={styles.productImage}
        resizeMode="cover"
        onError={(error) =>
          console.log('Error loading image:', error.nativeEvent.error)
        }
        onLoadStart={() => console.log('Image loading started')}
        onLoadEnd={() => console.log('Image loading finished')}
      />
      <Text style={styles.productName}>{item.nama_produk}</Text>
      <Text style={styles.productPrice}>Rp.{item.harga.toFixed(0)}</Text>

      {!isProductAdded && (
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={handleAddProduct}
        >
          <Text style={styles.addProductButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}

      {showActions && (
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.productActionButton}
            onPress={handleChoose}
          >
            <Ionicons name="ios-checkmark-circle" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleSubtractQuantity}
            >
              <Ionicons name="ios-remove" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleAddQuantity}
            >
              <Ionicons name="ios-add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const MenuScreen = ({ navigation }) => {
  const [isShoppingCartVisible, setShoppingCartVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataFromDatabase, setDataFromDatabase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isArrowRightModalVisible, setArrowRightModalVisible] = useState(false);
  const route = useRoute();
  const { name, userEmail, phoneNumber, userAddress } = route.params;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [totalStok, setTotalStok] = useState(0);

  const fetchData = async () => {
    try {
      setRefreshing(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.warn('No token found.');
        return;
      }

      const { data } = await axios.get(
        'http://10.0.2.2:8080/petugas/list_produk',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Data from server:', data);

      const listProduk = data.data.listProduk || [];
      const totalStok = data.data.total_stok || 0;

      setDataFromDatabase(listProduk);
      setTotalStok(totalStok);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);

      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    console.log('Image URL:', item.link_gambar);
    return (
      <ProductItem
        item={item}
        onChoose={(selectedProduct) =>
          setSelectedProducts([...selectedProducts, selectedProduct])
        }
        dataFromDatabase={dataFromDatabase} // Pass the prop here
      />
    );
  };

  const handleProceed = () => {
    navigation.navigate('OrderSummary');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!dataFromDatabase) {
      return; // Return early if data is not available yet
    }

    // Filter data based on the search query
    const filteredProducts = dataFromDatabase.filter((product) =>
      product.nama_produk.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

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

  const handleArrowRightPress = () => {
    if (selectedProducts.length > 0) {
      setArrowRightModalVisible(true);

      // Set the image of the first selected product
      setSelectedProductImage(selectedProducts[0].link_gambar);
    }
  };

  const handleArrowRightModalClose = () => {
    setArrowRightModalVisible(false);
    // Do not clear selected products when closing the modal
    // setSelectedProducts([]);
  };

  const handleSearchArrowPress = () => {
    // Handle the press event for the arrow icon next to the search input
    setArrowRightModalVisible(true);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true); // Set refreshing to true to show the loading indicator
      await fetchData(); // Trigger data fetch when the user pulls to refresh
    } finally {
      // Set refreshing to false when data fetching is completed
      setRefreshing(false);
      // Clear selected products and hide actions
      setSelectedProducts([]);
    }
  };

  const handlePaymentPress = () => {
    // Prepare data for payment
    const paymentData = {
      email: userEmail,
      nama: name,
      no_telp: phoneNumber,
      alamat: userAddress,
      data_pesanan: selectedProducts.map((product) => ({
        id_produk: product.id_produk,
        nama_produk: product.nama_produk,
        jumlah_produk: product.quantity,
        sub_total: product.harga * product.quantity,
      })),
      pembayaran: {
        amount: subtotal,
        biaya_admin: adminFee,
        grandtotal: total,
      },
    };

    // Navigate to PaymentScreen and pass paymentData as a parameter
    navigation.navigate('Payment', { paymentData });
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce(
      (subtotal, product) => subtotal + product.harga * product.quantity,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const adminFee = 500;
  const total = subtotal + adminFee;

  return (
    <View style={styles.container}>
      <Navbar
        onMenuPress={handleMenuPress}
        onArrowRightPress={handleArrowRightPress}
      />
      <View style={styles.searchContainer}>
        <Ionicons
          name="ios-search"
          size={24}
          color="#000000"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
        <TouchableOpacity
          onPress={handleSearchArrowPress}
          style={styles.arrowIconContainer}
        >
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchQuery.length > 0 ? filteredData : dataFromDatabase}
        keyExtractor={(item) => item.id_produk.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.productList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      {isShoppingCartVisible && (
        <ShoppingCart onCheckout={() => setShoppingCartVisible(false)} />
      )}
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
              onPress={() =>
                console.log('Selesaikan Transaksi anda terlebih dahulu')
              }
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
      </Modal>
      <Modal
        transparent={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        visible={isArrowRightModalVisible}
        onRequestClose={handleArrowRightModalClose}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[styles.modalContent1]}>
              {selectedProducts.map((product, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderEndColor: 'black',
                  }}
                >
                  <Image
                    source={{
                      uri: product.link_gambar.replace('127.0.0.1', '10.0.2.2'),
                    }}
                    style={styles.productImage1}
                    resizeMode="cover"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text>{`ID: ${product.id_produk}`}</Text>
                    <Text>{`Name: ${product.nama_produk}`}</Text>
                    <Text>{`Price: Rp.${product.harga.toFixed(0)}`}</Text>
                    <Text>{`Quantity: ${product.quantity}`}</Text>
                    <Text>{`Subtotal: Rp.${(
                      product.harga * product.quantity
                    ).toFixed(0)}`}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))}

              {/* Display Subtotal, Admin Fee, and Total */}
              <View style={styles.paymentDetailsBox}>
                <Text style={styles.paymentDetailsText}>
                  Subtotal: Rp.{subtotal.toFixed(0)}
                </Text>
                <Text style={styles.paymentDetailsText}>Admin fee: Rp.500</Text>
                <Text style={styles.paymentDetailsText}>
                  Total: Rp.{(subtotal + 500).toFixed(0)}
                </Text>
              </View>

              {/* Payment Button */}
              <TouchableOpacity
                onPress={handlePaymentPress}
                style={styles.paymentButton}
              >
                <Ionicons name="ios-card" size={24} color="white" />
                <Text style={styles.modalText1}>Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleArrowRightModalClose}
                style={styles.closeButton}
              >
                <Ionicons name="ios-close" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  productList: {
    flexGrow: 1,
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
  productItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#C9D7DD',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  productImage1: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#365486',
  },
  productPrice: {
    fontSize: 14,
    color: '#365486',
  },
  proceedButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 37,
  },
  modalContent: {
    backgroundColor: '#565555',
    padding: 20,
  },
  modalContent1: {
    backgroundColor: 'white',
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
    color: 'white',
  },
  modalText1: {
    fontSize: 18,
    marginLeft: 10,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    width: '80%',
    marginLeft: 10,
    marginRight: 'auto',
    marginTop: 20,
    backgroundColor: '#C9D7DD',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 5,
  },
  arrowIconContainer: {
    position: 'absolute',
    top: 7,
    right: -40,
    zIndex: 1,
  },
  arrowIcon: {
    marginRight: 'auto',
  },
  addProductButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    width: '120%',
  },
  productActionButton: {
    backgroundColor: '#365486',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#365486',
  },
  quantityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addProductButtonText: {
    color: '#365486',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Align horizontally in the center
    marginVertical: 10,
    backgroundColor: '#365486', // Set background color
    padding: 16, // Set padding
    borderRadius: 8, // Set border radius
    marginTop: 20,
  },
  paymentDetailsContainer: {
    marginTop: 10,
    alignItems: 'center', // Center-align text
  },
  paymentDetailsBox: {
    backgroundColor: '#ecf0f1', // Background color for the box
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center', // Center-align content
  },
  paymentDetailsText: {
    fontSize: 16,
    textAlign: 'center', // Center-align text
  },
});

export default MenuScreen;
