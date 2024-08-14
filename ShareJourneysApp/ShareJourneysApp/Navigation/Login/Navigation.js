import { NavigationContainer } from '@react-navigation/native';
import React, { useReducer, useState } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"

// import Chat from './components/Chat';
// import Profile from './components/ProfileUser';
// import PostForm from './components/Post/PostForm';
// import PostScreen from './components/Post/PostScreen';
// import JourneyHistory from './components/Post/JourneyHistory';
// import Mycontext from './configs/Mycontext';
import Login from '../../Components/user/login';
import Signup from '../../Components/user/signup';

 const Stack = createNativeStackNavigator();
 const LoginNavigation = () => {
    return (

            <Stack.Navigator>
                  <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>

                    <Stack.Screen
                    name='Signup'
                    component={Signup}
                    options={{
                      headerShown: false
                    }}
                    />
                  {/* <Stack.Screen
                    name='Chat'
                    component={Chat}
                    options={({route}) => ({
                      headerBackVisible:false,
                      title:route.params.name,
                      headerTitleStyle:{fontWeight:'bold'},
                      headerTitleAlign:'center'
  
  
                  })}
                  /> */}
                  {/* <Stack.Screen
                    name='ProfileUser'
                    component={Profile}
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
                  <Stack.Screen
                    name='PostScreen'
                    component={PostScreen}
                    options={{
                      headerShown: false
                  }}
                  
                  />
                  <Stack.Screen
                    name='JourneyHistory'
                    component={JourneyHistory}
                    options={{
                      headerShown: false
                  }}
                  
                  /> */}
  
  
  
            </Stack.Navigator>
  
        )
  }
  export default LoginNavigation