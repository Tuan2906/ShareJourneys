import { View, Text, Image , Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import color from '../../style/color';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../firebase/firebaseconf';
// import APIs, { authApi, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../Button';
import APIs, { authApi, endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';


const Login = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [user, dispatch] = useContext(Mycontext);
    const loginUser = async () => {
        signInWithEmailAndPassword(authentication, username, password)
        .then(()=> console.log('user logged in'))
        setLoading(true);
        try {
            console.log(username,password);
            console.log( process.env.SHAREJOURNEYSAPP_CLIENT_ID)
            let res = await APIs.post(endpoints['login'], {
                "username": username, 
                "password": password,
                "client_id": process.env.SHAREJOURNEYSAPP_CLIENT_ID,
                "client_secret": process.env.SHAREJOURNEYSAPP_CLIENT_SECRET,
                "grant_type": "password"
            },{
                headers: { 'Content-Type': 'multipart/form-data' },
              })
            console.log(res.data);
            await AsyncStorage.setItem("access-token", res.data.access_token)
            console.log("acces token",res.data.access_token)
            let user = await authApi(res.data.access_token).get(endpoints['current-user']);
            let a= await AsyncStorage.getItem('access-token')
            console.log("Du lieu access-token:",a);
            console.log('userdawda', user.data);
            dispatch({
                type: "login", 
                payload: user.data
            });
            await AsyncStorage.setItem("userData", JSON.stringify(user.data));
            
            navigation.navigate("BottomTabNav");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Tai khoan bi khoa hoac chua dang ki nguoi dung");
        } finally {
            setLoading(false);
        }
    }
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(authentication, (user) => {
    //       if(user){
    //         navigation.navigate("Home");
    //       }else{
    //         // console.log('no user')
    //         navigation.canGoBack() && navigation.popToTop();
    //       }
    //     });
      
    //     return () => unsubscribe();
    //   }, []);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color.white}}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: color.black
                    }}>
                        Chào nừng bạn đến shareJourney👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: color.black
                    }}>Hello again you have been missed!</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email address</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: color.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                      <TextInput
                        value={username} onChangeText={t => setUsername(t)}
                            placeholder='Enter your email address'
                            placeholderTextColor={color.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: color.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            placeholderTextColor={color.black}
                            secureTextEntry={isPasswordShown}
                            value={password} onChangeText={t => setPassword(t)}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={color.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={color.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? color.primary : undefined}
                    />

                    <Text>Remenber Me</Text>
                </View>

                <Button
                    title="Login"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={loginUser}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: color.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Or Login with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor:color.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: color.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../../picture/facebook.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: color.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require('../../picture/google.png')}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: color.black }}>Don't have an account ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: color.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login