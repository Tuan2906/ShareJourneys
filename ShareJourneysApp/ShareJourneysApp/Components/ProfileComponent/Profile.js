import {
    View,
    Text,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    FlatList,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { COLORS, FONTS, SIZES, images } from "../../constants";
  import { StatusBar } from "expo-status-bar";
  import { MaterialIcons } from "@expo/vector-icons";
import Mycontext from "../../config/Mycontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDevide } from '../Notification/Notification';



  
  const Profile = ({navigation}) => { 
    const dlUser= useContext(Mycontext)
    const ToEditProfile = () =>{
        navigation.navigate('EditProfile');
    }
    const logout = async () => {
      const token_device = await AsyncStorage.getItem('token_device')
      console.log(token_device)
      await deleteDevide(token_device,dlUser);
      dlUser[1]({
          "type": "logout",
          "payload": navigation.navigate('Authenticate')
      })
    }
    

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={{ flex: 1, alignItems: "center", marginTop:100 }}>
          <Image
            source={{uri:dlUser[0].avatar}}
            resizeMode="contain"
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: COLORS.primary,
              borderWidth: 2,
              marginTop: -90,
            }}
          />
  
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.primary,
              marginVertical: 8,
            }}
          >
            {dlUser[0].username}
          </Text>
          
  
          <View style = {{ width:'100%', height:'70%'}}>
            <TouchableOpacity onPress={ToEditProfile}
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                justifyContent: "space-between",
                borderStyle: "solid",
                borderWidth: 2,
                }}
            >
              <Text
                style={{
                  ...FONTS.body2,
                  color: COLORS.black,
                }}
              >
                <MaterialIcons
              name="settings"
              size={24}
              color={COLORS.black}
                />
                Edit Profile
              </Text>
              <MaterialIcons
              name="arrow-circle-right"
              size={24}
              color={COLORS.black}
                />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                justifyContent: "space-between",
                borderStyle: "solid",
                borderWidth: 2,
                }}
            >
              <Text
                style={{
                  ...FONTS.body2,
                  color: COLORS.black,
                }}
              >
                <MaterialIcons
              name="logout"
              size={24}
              color={COLORS.black}
                />
                Log Out
              </Text>
              <MaterialIcons
              name="arrow-circle-right"
              size={24}
              color={COLORS.black}
                />
            </TouchableOpacity>
          </View>
        </View>
  
      </SafeAreaView>
    );
  };
  
  export default Profile;