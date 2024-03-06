import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  Image,
  Button,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Navbar from '../component/Navbar';
import MenuModal from '../component/MenuModal';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const WelcomeText = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTextTitle}>Edit Product</Text>
      <Text style={styles.welcomeTextDesk}>
        Change the photo, item name, price, and item you want to edit.
      </Text>
    </View>
  );
};

const Productinformation = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTextTitle}>Product Information</Text>
      <Text style={styles.welcomeTextDesk}>
        Include mandatory information about the items you are selling such as
        the name of the item and price.
      </Text>
    </View>
  );
};

const EditProductScreen = ({ navigation }) => {
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [temporaryImage, setTemporaryImage] = useState('');
  const [form, setForm] = useState({
    nama_produk: '',
    harga: '',
    stok: '',
    file: null,
  });
  const route = useRoute();
  const productId = route.params.productId;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://10.0.2.2:8080/petugas/get_produk/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response.data.data;

        setTemporaryImage(data.link_gambar);

        setForm({
          nama_produk: data.nama_produk,
          harga: data.harga,
          stok: data.stok,
        });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchProductData();
  }, []);

  const handleMenuPress = () => {
    setMenuModalVisible(true);
  };

  const handleMenuModalClose = () => {
    setMenuModalVisible(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setMenuModalVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setTemporaryImage(result.assets[0].uri);
      setForm((prev) => ({
        ...prev,
        file: result.assets[0].uri,
      }));
      return true;
    }
  };

  const handleUpdate = async () => {
    if (!form.file) {
      console.log('Masukno gambar sek');
      return false;
    }
    const formData = new FormData();

    formData.append('nama_produk', form.nama_produk);
    formData.append('harga', parseInt(form.harga));
    formData.append('stok', parseInt(form.stok));
    formData.append('file', {
      uri: form.file,
      name: 'upload.jpg',
      type: 'image/jpeg',
    });

    const token = await AsyncStorage.getItem('token');

    const response = await axios({
      method: 'patch',
      url: `http://10.0.2.2:8080/petugas/edit_produk/${productId}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    navigation.navigate('Product');
    console.log(response);
  };
  const handleDelete = async () => {
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
      // Navigate back or do any other necessary actions after deletion
      navigation.navigate('Product');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Navbar onMenuPress={handleMenuPress} />
        <Modal
          transparent={true}
          visible={isMenuModalVisible}
          onRequestClose={handleMenuModalClose}
        >
          <MenuModal
            isVisible={isMenuModalVisible}
            onClose={handleMenuModalClose}
            navigation={navigation}
          />
        </Modal>
        <WelcomeText />
        {temporaryImage && (
          <ImageBackground
            style={styles.imageBackground}
            source={{
              uri: form.file
                ? form.file
                : temporaryImage.replace('127.0.0.1', '10.0.2.2'),
            }}
          >
            <View style={styles.imageOverlay}>
              <Icon
                name="edit"
                size={24}
                color="#fff"
                onPress={() => handleImagePicker()}
              />
            </View>
          </ImageBackground>
        )}
        <Productinformation />
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          placeholder="Nama Produk"
          style={styles.input}
          value={form.nama_produk}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, nama_produk: text }))
          }
        />
        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Nama Produk"
          style={styles.input}
          value={form.harga.toString()}
          onChangeText={(text) => setForm((prev) => ({ ...prev, harga: text }))}
        />
        <Text style={styles.label}>Stock</Text>
        <TextInput
          placeholder="Nama Produk"
          style={styles.input}
          value={form.stok.toString()}
          onChangeText={(text) => setForm((prev) => ({ ...prev, stok: text }))}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleUpdate()}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    padding: 5,
    paddingBottom: 100, // Adjust as needed
  },
  welcomeTextDesk: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeSection: {
    alignItems: 'flex-start', // Align to the left
    marginTop: 20,
    marginLeft: 10,
  },
  welcomeTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageBackground: {
    width: '80%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  imageOverlay: {
    position: 'absolute',
    width: '80%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 15,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlign: 'left', // Align to the left
    marginLeft: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: '90%',
    marginLeft: 10,
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#365486',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default EditProductScreen;
