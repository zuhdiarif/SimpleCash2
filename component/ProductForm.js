import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Import axios for HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const ProductForm = ({ data }) => {
  useEffect(() => {
    setForm({
      nama_produk: data.nama_produk,
      harga: data.harga,
      stok: data.stok,
    })
  }, [data])

  const [form, setForm] = useState({
    nama_produk: '',
    harga: '',
    stok: '',
    file: null,
  });

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result);
        uploadImage(result.uri);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const updateData = async () => {
    const formData = new FormData();
    formData.append('nama_produk');
    formData.append('harga');
    formData.append('stok');
    formData.append('file');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WelcomeText />
      <View style={styles.rightContainer}>
        <View style={styles.imageContainer}>
          {/* {productData.file && (
            <Image
              style={styles.productImage}
              source={{
                uri: productData.file.replace('127.0.0.1', '10.0.2.2'),
              }}
            />
          )} */}
          <View style={styles.imageOverlay}>
            <Icon
              name="edit"
              size={24}
              color="#fff"
              onPress={() => handleImagePicker()}
            />
          </View>
        </View>
        <Text style={styles.TextTitle}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={form.nama_produk} // Use the state variable here
          onChangeText={(text) => setName(text)}
        />
        {/* <Text style={styles.TextTitle}>Price</Text>
        <TextInput
          style={styles.input}
          value={price.toString()} // Use the state variable here
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />
        <Text style={styles.TextTitle}>Stock</Text>
        <TextInput
          style={styles.input}
          placeholder="Stok"
          value={stok.toString()} // Use the state variable here
          onChangeText={(text) => setStok(text)}
          keyboardType="numeric"
        /> */}

        <Button style={styles.save} title="Update" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  rightContainer: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  TextTitle: {
    fontSize: 14,
    marginBottom: 15,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeTextDesk: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  save: {
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
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

export default ProductForm;
