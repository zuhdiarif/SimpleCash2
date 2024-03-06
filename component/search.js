import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchProduct = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Call the onSearch callback with the searchQuery
    onSearch(searchQuery);
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="ios-search" size={24} color="#3498db" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        {/* You can add a custom search button here if needed */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 5, // Adjust the left padding to align the text with the icon
  },
  searchButton: {
    // untuk customize search button
  },
});

export default SearchProduct;