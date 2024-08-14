import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostDetail from '../../Components/Post/PostDetail';
import ScreenHeader from '../../Components/Home/ScreenHeader';
import MainHeader from '../../Components/Home/MainHeader';
import Profile from '../../Components/ProfileComponent/ProfileUser';
import Chat from '../../Components/Chat/Chat';

const Stack = createNativeStackNavigator();
const HomeNavigate = () => {
  return (
    <>
     <Stack.Navigator initialRouteName ="HomePage">
        <Stack.Screen name="HomePage"  options={{headerShown: false}} component={MainHeader} />
        <Stack.Screen name="PostDetail" options={{headerShown: false}} component={PostDetail} />
        <Stack.Screen name="ProfileUser" options={{headerShown: false}} component={Profile} />
        <Stack.Screen name="PostDetail2" options={{headerShown: false}} component={PostDetail} />
        <Stack.Screen name="Chat" options={{headerShown: false}} component={Chat} />
      </Stack.Navigator>
    </>
           
        
  );
}

export default HomeNavigate;