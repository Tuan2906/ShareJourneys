import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import PostScreen from './PostScreen';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
const PostForm = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content:'',
    description:'',
    diemDi:'',
    diemDen:'',
    ngayDi:'',
    ngayDen:'',
    chiPhi:0,
    diaDiemTrungGian:[],
    pictureDaChon:[],
    pictureUserSelect:[],
    anhTam:[],
    phuongtien:0,
    tag:[], 
  });
  const saveFormData = () => {
    // Lưu trạng thái của formData vào một biến tạm
    const tempFormData = { ...formData };
    // Lưu trạng thái của form vào state tạm
    setFormData(tempFormData);
  };
  const handlePressBack = () => {
    saveFormData(); // Lưu trạng thái của form trước khi chuyển trang

    setPage(page - 1);
  };

  const handlePressNext = () => {
    saveFormData(); // Lưu trạng thái của form trước khi chuyển trang
    setPage(page + 1);
  };

  const handleChangeText = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderPage = () => {
    switch (page) {
      case 0:
        return <FirstPage formData={formData} onChangeText={handleChangeText} onPressNext={handlePressNext} />;
      case 1:
        return <SecondPage  formData={formData} onChangeText={handleChangeText} onPressBack={handlePressBack} onPressNext={handlePressNext} />;
      case 2:
         navigation.navigate("PostScreen",{formData: formData})
         return null;
         // default:
      //   return <PostScreen formData={formData} />;
    }
  };

  return (
    <>
    { page ==0 &&
      <View style={{marginTop:20}}>
          <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={{fontSize:20,color:"red"}}>Vui long hoan thanh cac buoc dang bai</Text>
      </View>
      }
     <View>
     {page == 0 && (
        <View style={style.pageInfo}>
          <Text style={style.counter}>Page {page + 1} of 2</Text>
        </View>
      )}
      {page ==1 && (
        <View style={{...style.pageInfo,marginTop:16}}>
          <Text style={style.counter}>Page {page + 1} of 2</Text>
        </View>
      )}
      {renderPage()}
      
    </View>
    </>
   
  );
};
const style = StyleSheet.create({
  
  counter: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
 
  pageInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default PostForm;