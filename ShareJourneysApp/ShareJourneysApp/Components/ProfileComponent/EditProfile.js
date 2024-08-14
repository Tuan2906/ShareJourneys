import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Modal,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import * as ImagePicker from "expo-image-picker";
  import { COLORS, FONTS } from "../../constants";
  import { MaterialIcons } from "@expo/vector-icons";
  import { imagesDataURL } from "../../constants/data";
  import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import Mycontext from "../../config/Mycontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../config/APIs";
import { collection, query, where, getDocs ,setDoc} from 'firebase/firestore';
import { authentication, db } from '../../firebase/firebaseconf'

  const EditProfile = ({ navigation }) => {
    const dlUser= useContext(Mycontext)
    console.log('adwdwadadawfgafagef',dlUser[0]);
    const [selectedImage, setSelectedImage] = useState(dlUser[0].avatar);
    const [name, setName] = useState(dlUser[0].username);
    const [email, setEmail] = useState(dlUser[0].email);
    // const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState(dlUser[0].first_name);
    const [last_name, setLastName] = useState(dlUser[0].last_name);
    const [loading, setLoading] = useState(false);
    const changeFireStoreAuthenticate = async (user) => {
      try {
        const docsRef = collection(db, dlUser[0].username);
        const q = query(docsRef, where('userUID', '==', authentication?.currentUser?.uid));
        
        // Thực hiện truy vấn để lấy các tài liệu phù hợp
        const querySnapshot = await getDocs(q);
    
        // Lấy avatar từ các tài liệu
        console.log('docs',querySnapshot.docs)
        if (!querySnapshot.empty) {
          // Giả sử chỉ có một tài liệu khớp với userUID
          const docRef = querySnapshot.docs[0].ref;
          console.log('docRef1',docRef)
          // Cập nhật tài liệu với dữ liệu mới
          await setDoc(docRef, {
            avatarUrl: user.avatar,
            username: user.username,
            userUID: authentication?.currentUser?.uid,
          }, { merge: true });
          console.log('Document successfully updated');
        }    


        // const users = querySnapshot.docs.map(doc => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
      //   setDoc(querySnapshot.docs[0], {
      //     avatarUrl:user.avatar,
      //     username:user.username,
      //     userUID:users[0].userUID,
      // })



        // console.log('Users:', users);
        // const avatars = users.map(user => user.avatarUrl); // Giả sử trường avatar trong tài liệu là 'avatar'
        
        // console.log('Avatars:', avatars);
        // return avatars;
      } catch (error) {
        console.error('Error update documents: ', error);
      }
    };
    const changeFireStoreNotAuthenticate = async (user) =>{
      try {
        console.log("changeFireStoreNotAuthenticate")
        const docsRef = collection(db, dlUser[0].username);
        const qN = query(docsRef, where('userUID', '!=', authentication?.currentUser?.uid));
        console.log('qN',qN.filters)
        console.log('qN filters', qN._query.filters);
        console.log('qN filters', qN.segments);

        // Thực hiện truy vấn để lấy các tài liệu phù hợp
        const querySnapshot = await getDocs(qN); // lay nhung thg nhắn
        console.log('querySnapshot',querySnapshot.docs)

        // Lấy doc của những thg nhắn của current-user
        querySnapshot.docs.map(async (doc) => {
          console.log('dataaaaaaaaaaaaaaaaaaaaaaaa',doc.data())
          const docsRef = collection(db, doc.data().username);
          console.log('docRef2',docsRef)
          const q = query(docsRef, where('userUID', '==',authentication?.currentUser?.uid));
          const NotAuthquerySnapshot = await getDocs(q);
          console.log('notAuthQuerySnapshot',NotAuthquerySnapshot.docs);
          NotAuthquerySnapshot.docs.map(async (docNot) => {
            if (!NotAuthquerySnapshot.empty) {
              const docRef = docNot.ref;
              // Cập nhật tài liệu với dữ liệu mới
              console.log('11111111',docRef)
              await setDoc(docRef, {
                avatarUrl: user.avatar,
                username: user.username,
                userUID: authentication?.currentUser?.uid,
              }, { merge: true });
              console.log('Document successfully updated');
            }    
          })
          
      })
        

    }
     catch (error) {
        console.error('Error update documents: ', error);
      }
    }

    const patch_user = async () => {
      
      let userData = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'username': name,
        'avatar': selectedImage,
      };
      console.log('1234',userData)
      const form = new FormData();
      for (let key in userData){
          if (key === 'avatar') {
              form.append(key, {
                  uri: userData[key].uri,
                  name: userData[key].fileName,
                  type: 'image/jpeg'
              })
          } else
              form.append(key, userData[key]);
        }
      console.log('12345', form._parts[4]);

      try {
          let a= await AsyncStorage.getItem('access-token')
          let user = await authApi(a).patch(endpoints['current-user'],form,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('1231313123123',user.data)
          dlUser[1]({
            type: "editProfile",
            payload: user.data
            
          })
          await changeFireStoreAuthenticate(user.data)   
          await changeFireStoreNotAuthenticate(user.data) 
          navigation.goBack();   
      } catch (ex) {
          console.error(ex);
          alert("Tai khoan bi khoa hoac chua dang ki nguoi dung");
      } finally {
          setLoading(false);
      }
    }


  //   const change = (field, value) => {
  //     console.log("User Register:",userData)
  //     setUser(current => {
  //         return {...current, [field]: value}
  //     })
  // }



    const handleImageSelection = async () => {
      let result = await ImagePicker.launchImageLibraryAsync();
    
      if (!result.canceled) {
        setSelectedImage(result.assets[0])

      }
      
    };
   
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 22,
        }}
      >
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
  
          <Text style={{ ...FONTS.h3 }}>Edit Profile</Text>
        </View>
  
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginVertical: 22,
            }}
          >
            <TouchableOpacity onPress={handleImageSelection}>
            {console.log('abc',selectedImage)}
              <Image
                source={{ uri: selectedImage.uri || dlUser[0].avatar }}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />
  
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
  
          <View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Name</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => setName(value)}
                  editable={true}
                />
              </View>
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Email</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  editable={true}
                />
              </View>
            </View>
  
            {/* <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Password</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={dlUser[0].password}
                  onChangeText={(value) => setPassword(value)}
                  editable={true}
                  secureTextEntry
                />
              </View>
            </View> */}
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Họ</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={last_name}
                  onChangeText={(value) => setLastName(value)}
                  editable={true}
                />
              </View>
            </View>
          </View>
  
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Tên</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={first_name}
                onChangeText={(value) => setFirstName(value)}
                // editable={true}
              />
            </View>
          </View>
  
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={patch_user}
          >
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.white,
              }}
            >
              Save Change
            </Text>
          </TouchableOpacity>
  
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default EditProfile;




