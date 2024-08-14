import { View, Text, Image, Pressable, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import color from '../../style/color';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { authentication, db } from '../../firebase/firebaseconf';
// import APIs from '../../config/APIs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import APIs, { endpoints } from '../../config/APIs';
import Button from '../../Button';
import { HelperText } from 'react-native-paper';
const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "username": "",
        "password": "",
        "confirm": "",
        "avatar": ""
    });
    const [loading, setLoading] = useState(false);
   
    const register = async () => {
          
          if (!user.username || user.username.length < 3) {
            setError(true);
            setErrorText('username không hợp lệ, username lớn hơn 3 kí tự ')
            return;
          }
          if (!user.password || user.password.length < 6) {
            setError(true);
            setErrorText('password không hợp lệ, password lớn hơn 6 kí tự ')
            return;
          }
          if (user.password != user.confirm) {
            setError(true);
            setErrorText('Mật khẩu không khớp!')
            return;
          }
          if (!user.avatar) {
            setError(true);
            setErrorText('Phải chọn ảnh đại diện!')
            return;
          }
          
          setError(false);
        setLoading(true);

        const form = new FormData();
        for (let key in user)
            if (key === 'avatar') {
                form.append(key, {
                    uri: user[key].uri,
                    name: user[key].fileName,
                    type: 'image/jpeg'
                })
            } else
                form.append(key, user[key]);
        
        console.log(form)

        try {
            let res = await APIs.post(endpoints["users"], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await registerUser(res.data)
            navigation.navigate("Login");
            console.info(res.data);
        } catch (ex) {
            console.error("Loi",ex);
        } finally {

            setLoading(false);
        }
    }
    const { username, password, } = user;
    const registerUser = async (data) => {
        const { avatar } = data;

        console.log("firese1")
        await createUserWithEmailAndPassword(authentication, username, password)
        .then( (userCredentials) => {
            const userUID = userCredentials.user.uid;
            collection(db, username);
            const docRef = doc(db, username, userUID);
            const docSnap = setDoc(docRef, {
                avatarUrl:avatar,
                username,
                password,
                userUID,
            })
           
        })
        .then(() => console.log('succesful'))
    }
    const picker = async () => {
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                change("avatar", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setUser(current => {
            return {...current, [field]: value}
        })
        console.log("User Register:",user)
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: color.white }}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
                <View style={{ marginVertical:10 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: color.black
                    }}>
                       Tạo tài khoản
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: color.black
                    }}>Kết bạn mới cùng shareJourney</Text>
                </View>

                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Tên</Text>

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
                            placeholder='Nhập tên của bạn...'
                            placeholderTextColor={color.black}
                            onChangeText={t => change("first_name", t)}
                            value={user.first_name}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Họ và tên lót</Text>

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
                            placeholder='Nhập tên lót của bạn...'
                            placeholderTextColor={color.black}
                            value={user.last_name} onChangeText={t => change("last_name", t)}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Tên đăng nhập</Text>

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
                          value={user.username} onChangeText={t => change("username", t)}
                            placeholder='Nhập username...'
                            placeholderTextColor={color.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mật khẩu</Text>

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
                            value={user.password} onChangeText={t => change("password", t)}
                            placeholder='Nhập password của bạn...'
                            placeholderTextColor={color.black}
                            secureTextEntry={isPasswordShown}
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
                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Xác nhận mật khẩu</Text>

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
                            value={user.confirm} onChangeText={t => change("confirm", t)}
                            placeholder='Nhập xác nhận password của bạn...'
                            placeholderTextColor={color.black}
                            secureTextEntry={isPasswordShown}
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
                
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: "blue", padding: 10, alignItems: "center", borderRadius: 5}} onPress={picker}>
                    <Text style={{color: "white"}}>Chọn ảnh đại diện</Text>
                    </TouchableOpacity> 
                    <View style={{marginLeft: 10}}>
                        <Image source={{uri: user.avatar.uri}} style={{width: 50, height: 50}} />
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

                    <Text>I aggree to the terms and conditions</Text>
                </View>
                <HelperText type="error" visible={error}>
                    {errorText}
                </HelperText>
                {loading===true?<ActivityIndicator />:<>
                        <Button
                            title="Sign Up"
                            filled
                            style={{
                                marginTop: 18,
                                marginBottom: 4,
                            }}
                            onPress={register}
                        />
                </>}


                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: color.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: color.grey,
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
                            source={require("./../../picture/facebook.png")}
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
                            source={require("./../../picture/google.png")}
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
                    <Text style={{ fontSize: 16, color: color.black }}>Already have an account</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: color.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Signup