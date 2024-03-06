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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';

const ProductCard = ({ item, onEdit, onDelete, handleProductSelection }) => {
  console.log('Item:', item);

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${item.nama_produk}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => onDelete(item.id),
        },
      ],
      { cancelable: false }
    );
  };
  
  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductSelection(item.id)}
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
      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{item.nama_produk}</Text>
        <Text style={styles.productPrice}>Rp.{item.harga.toFixed(0)}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, }}>
        <TouchableOpacity onPress={onEdit} style={[styles.editButton, { marginRight: 8 }]}>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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

const ProductScreen = ({ navigation }) => {
  const { navigate } = useNavigation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataFromDatabase, setDataFromDatabase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleEditProduct = (productId) => {
    // Navigate to the "EditProduct" screen and pass the product ID
    navigate('EditProduct', { productId });
  };

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

      const listProduk = data.data.listProduk || []; // Ensure listProduk is defined

      setDataFromDatabase(listProduk);
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

  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <ProductCard
        item={item}
        selectedProducts={selectedProducts}
        handleProductSelection={handleProductSelection}
        onEdit={() =>
          navigation.push('EditProduct', { productId: item.id_produk })
        }
        onDelete={() => handleDeleteProduct(item.id_produk)}
      />
    );
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

  const handleAddProduct = () => {
    // Navigate to the AddProductScreen
    navigation.navigate('AddProduct');
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(
        `http://10.0.2.2:8080/petugas/delete_produk/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // After successful deletion, you may want to refresh the data
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing to true to show loading indicator
    await fetchData(); // Trigger data fetch when the user pulls to refresh
    setRefreshing(false); // Set refreshing to false when data fetching is completed
  };

  return (
    <View style={styles.container}>
      <Navbar onMenuPress={handleMenuPress} />
      <View style={styles.searchContainer}>
        <Ionicons
          name="ios-search"
          size={24}
          color="#3498db"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Ionicons name="ios-add" size={32} color="#fff" />
      </TouchableOpacity>
      {/* Modal for Menu */}
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
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#FFFFFF', // Ganti warna latar belakang ke putih
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
    backgroundColor: '#C9D7DD', // Change background color to blue
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#0000FF',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#365486',
  },
  productPrice: {
    fontSize: 14,
    color: '#365486',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 25,
  },
  modalContent: {
    backgroundColor: '#565555',
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
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#365486',
    padding: 16,
    borderRadius: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#C9D7DD',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    backgroundColor: '#C9D7DD',
  },
  searchIcon: {
    marginLeft: 8,
    color: '#000000',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 5,
    color: '#565555',
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#198754',
    padding: 8,
    borderRadius: 5,
    marginRight: 15,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 5,
  },
});

export default ProductScreen;
