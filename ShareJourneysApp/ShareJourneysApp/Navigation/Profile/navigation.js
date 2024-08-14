import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../Components/ProfileComponent/Profile';
import EditProfile from '../../Components/ProfileComponent/EditProfile';

const Stack = createNativeStackNavigator();
const ProfileNavigate = () => {
  return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
  );
}

export default ProfileNavigate;