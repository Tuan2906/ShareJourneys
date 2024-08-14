import { StatusBar } from 'expo-status-bar';
import React, {useReducer} from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import HomeNavigator from './Navigation/Home/HomeNavigator';
// import ProfileNavigate from './Navigation/Profile/navigation';
import MainHeader from './Components/Home/MainHeader';
// import TabNavigator from './Navigation/Home/TabNavigator';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabNav from './Navigation/BottomTabNav';
import { NavigationContainer } from '@react-navigation/native';
import PostDetail from './Components/Post/PostDetail';
import test from './Components/Home/Icon';
import ICONNE from './Components/Home/Icon';
import PostComments from './Components/Post/PostComments';
import { SPACING } from './constants';
import Signup from './Components/user/signup';
import HomeNavigate from './Navigation/Home/Navigation';
import MainNavigate from './Navigation/MainNavigation';
import LoginNavigation from './Navigation/Login/Navigation';
import MyUserReducer from './reducers/MyUserReducer';
import Mycontext from './config/Mycontext';
// import CommentSection from './Components/Post/CommentSection';





// import React, { useRef } from 'react';
// import { View, TextInput, Button } from 'react-native';

// const ChildComponent = ({ onPressButton }) => {
//   return (
//     <Button title="Press Me" onPress={onPressButton} />
//   );
// };

// const ParentComponent = () => {
//   const inputRef = useRef(null);

//   const handleButtonPress = () => {
//     // Thực hiện hành động trên TextInput của thành phần cha
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   return (
//     <View>
//       <TextInput ref={inputRef} />
//       <ChildComponent onPressButton={handleButtonPress} />
//     </View>
//   );
// };





const App = () =>{
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <Mycontext.Provider value={[user, dispatch]}>  

      <NavigationContainer>
          <MainNavigate/>
       </NavigationContainer>
       </Mycontext.Provider>

  )
}

export default App;