import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostDetail from '../../Components/Post/PostDetail';
import ScreenHeader from '../../Components/Home/ScreenHeader';
import MainHeader from '../../Components/Home/MainHeader';
import Profile from '../../Components/ProfileComponent/ProfileUser';
import JourneyHistory from '../../Components/Post/JourneyHistory';

const Stack = createNativeStackNavigator();
const HistoryNavigate = () => {
  return (
    <>
     <Stack.Navigator initialRouteName ="History">
        <Stack.Screen name="History"  options={{headerShown: false}} component={JourneyHistory} />
        <Stack.Screen name="PostDetail" options={{headerShown: false}} component={PostDetail} />
        <Stack.Screen name="ProfileUser" options={{headerShown: false}} component={Profile} />
        <Stack.Screen name="PostDetail2" options={{headerShown: false}} component={PostDetail} />
      </Stack.Navigator>
    </>
           
        
  );
}

export default HistoryNavigate;