import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostForm from '../../Components/Post/PostForm';
import PostScreen from '../../Components/Post/PostScreen';
import PostDetail from '../../Components/Post/PostDetail';
import Profile from '../../Components/ProfileComponent/ProfileUser';
import UpdatePostForm from '../../Components/Post/UpdatePost';


const Stack = createNativeStackNavigator();
const UpPostNavigate = () => {
  return (
    <>
     <Stack.Navigator initialRouteName ="PostScreen">
     <Stack.Screen
            name='PostScreen'
            component={PostScreen}
            options={{
            headerShown: false
        }}
        />
        <Stack.Screen
            name='PostForm'
            component={PostForm}
            options={{
            headerShown: false
        }}
        />
       <Stack.Screen name="PostDetail" options={{headerShown: false}} component={PostDetail} />
        <Stack.Screen name="ProfileUser" options={{headerShown: false}} component={Profile} />
        <Stack.Screen name="PostDetail2" options={{headerShown: false}} component={PostDetail} />
        <Stack.Screen name="updatePost" options={{headerShown: true}} component={UpdatePostForm} />

      </Stack.Navigator>
    </>
           
        
  );
}

export default UpPostNavigate;