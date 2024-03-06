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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Navbar from '../component/Navbar';
import MenuModal from '../component/MenuModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const WelcomeText = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTextTitle}>Add Product</Text>
      <Text style={styles.welcomeTextDesk}>
        Enter photos, item names, prices and the number of items you want to
        add.
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

const AddProductScreen = ({ navigation }) => {
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [temporaryImage, setTemporaryImage] = useState('');
  const [form, setForm] = useState({
    nama_produk: '',
    harga: '',
    stok: '',
    file: null,
  });

  const handleMenuPress = () => {
    setMenuModalVisible(true);
  };

  const handleMenuModalClose = () => {
    setMenuModalVisible(false);
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setTemporaryImage(result.assets[0].uri);
      setForm((prev) => ({
        ...prev,
        file: result.assets[0].uri,
      }));
      handleMenuModalClose();
      return true;
    }
  };

  const handleUpdate = async () => {
    if (!form.file) {
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
      method: 'post',
      url: `http://10.0.2.2:8080/petugas/add_produk`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response);

    // Navigate back to ProductScreen after adding the product
    navigation.navigate('Product');
  };

  const windowHeight = Dimensions.get('window').height;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
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
        <ImageBackground
          style={{
            width: '80%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
          }}
          source={
            form.file
              ? { uri: form.file }
              : require('../assets/default-placeholder.png')
          }
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
        <Productinformation />
        <Text
          style={{
            fontSize: 14,
            marginBottom: 15,
            marginTop: 5,
            fontWeight: 'bold',
            textAlign: 'center',
            textAlign: 'left', // Align to the left
            marginLeft: 10,
          }}
        >
          Product Name
        </Text>
        <TextInput
          placeholder="Nama Produk"
          style={{
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
          }}
          value={form.nama_produk}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, nama_produk: text }))
          }
        />
        <Text
          style={{
            fontSize: 14,
            marginBottom: 15,
            marginTop: 5,
            fontWeight: 'bold',
            textAlign: 'center',
            textAlign: 'left', // Align to the left
            marginLeft: 10,
          }}
        >
          Price
        </Text>
        <TextInput
          placeholder="Price"
          style={{
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
          }}
          value={form.harga.toString()}
          onChangeText={(text) => setForm((prev) => ({ ...prev, harga: text }))}
        />
        <Text
          style={{
            fontSize: 14,
            marginBottom: 15,
            marginTop: 5,
            fontWeight: 'bold',
            textAlign: 'center',
            textAlign: 'left', // Align to the left
            marginLeft: 10,
          }}
        >
          Stok
        </Text>
        <TextInput
          placeholder="Stok"
          style={{
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
          }}
          value={form.stok.toString()}
          onChangeText={(text) => setForm((prev) => ({ ...prev, stok: text }))}
        />
        <TouchableOpacity
          onPress={() => handleUpdate()}
          style={{
            marginTop: 10,
            backgroundColor: '#365486',
            padding: 10,
            borderRadius: 10,
            textAlign: 'left', // Align to the left
            marginLeft: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Add</Text>
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
    padding: 10,
    paddingBottom: 100, // Adjust as needed
  },
  welcomeTextDesk: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left', // Align to the left
    marginLeft: 5,
  },
  welcomeSection: {
    alignItems: 'flex-start', // Align to the left
    marginTop: 20,
  },
  welcomeTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left', // Align to the left
    marginLeft: 5,
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
});

export default AddProductScreen;
