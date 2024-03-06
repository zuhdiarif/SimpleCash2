import React from 'react';
import { View, Text, Button } from 'react-native';

const Cart = ({ cartItems, onCheckout }) => {
  return (
    <View>
      {cartItems.map(item => (
        <View key={item.id}>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
          <Text>Quantity: {item.quantity}</Text>
        </View>
      ))}
      <Button title="Checkout" onPress={onCheckout} />
    </View>
  );
};

export default Cart;