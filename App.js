import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screen/splashscreen';
import LoginScreen from './screen/loginscreen';
import Menuscreen from './screen/menuscreen';
import RegistrationScreen from './screen/registrationscreen';
import Productscreen from './screen/productscreen';
import EditProductScreen from './screen/EditProductScreen';
import AddProductScreen from './screen/AddProductScreen';
import Paymentscreen from './screen/paymentscreen';
import Transaksionscreen from './screen/transaksionscreen';

const Stack = createStackNavigator();

import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Regis" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={Menuscreen} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={Productscreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={Paymentscreen} options={{ headerShown: false }} />
        <Stack.Screen name="Transaksion" component={Transaksionscreen} options={{ headerShown: false }} />
        {/* Tambahkan halaman lain di sini, seperti beranda (Home) */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;