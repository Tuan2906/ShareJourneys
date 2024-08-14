import React, { useReducer } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNavigation from './Login/Navigation';
import BottomTabNav from './BottomTabNav';

const Stack = createNativeStackNavigator();

const MainNavigate = () => {
  return (
            <Stack.Navigator initialRouteName ="Authenticate">
                <Stack.Screen name="Authenticate"  options={{headerShown: false}} component={LoginNavigation} />
                <Stack.Screen name="BottomTabNav" options={{headerShown: false}} component={BottomTabNav} />
            </Stack.Navigator>

  );
}

export default MainNavigate;