import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const WelcomeText = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTextTitle}>Edit Product</Text>
      <Text style={styles.welcomeTextDesk}>Change the photo, item name, price, and item you want to edit.</Text>
    </View>
  );
};

const ProductForm = ({ productData, onSave }) => {
  const [name, setName] = useState(productData.name);
  const [price, setPrice] = useState(productData.price.toString());
  const [description, setDescription] = useState(productData.description);
  const [image, setImage] = useState(productData.image || 'defaultImageUri'); // Assume image is the URI of the image

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const imageName = 'productImage.jpg';
    const reference = storage().ref(`images/${imageName}`);

    try {
      await reference.putFile(uri);
      const imageURL = await reference.getDownloadURL();
      setImage(imageURL);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleSave = () => {
    // Validasi formulir atau manipulasi data sebelum menyimpan
    const updatedProduct = {
      id: productData.id,
      name,
      price: parseFloat(price),
      description,
      image,
    };

    onSave(updatedProduct);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WelcomeText />
      <View style={styles.rightContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.productImage} source={{ uri: image }} />
          <View style={styles.imageOverlay}>
            <Icon name="edit" size={24} color="#fff" onPress={handleImagePicker} />
          </View>
        </View>
        <Text style={styles.TextTitle}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.TextTitle}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />
        <Text style={styles.TextTitle}>Stock</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
        />
        <Button style={styles.save} title="Save" onPress={handleSave} />
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
