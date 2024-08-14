import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../Components/Chat/Home';
import Chat from '../../Components/Chat/Chat';


const Stack = createNativeStackNavigator();
const ChatNavigate = () => {
  return (
    <>
     <Stack.Navigator initialRouteName ="HomeChat">
        <Stack.Screen name="HomeChat"  options={{headerShown: false}} component={Home} />
        <Stack.Screen name="Chat" options={{headerShown: false}} component={Chat} />

      </Stack.Navigator>
    </>
           
        
  );
}

export default ChatNavigate;