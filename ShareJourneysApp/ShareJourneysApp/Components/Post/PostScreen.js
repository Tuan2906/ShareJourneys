import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import color from '../../style/color';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pofile, userJson } from '../../data/data';
import moment from 'moment';
import {  FontAwesome } from '@expo/vector-icons';
import APIs, { authApi, endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
  const { name, posts } = userJson;

  const PhotosRoutes = ({setLoading,setPosts,page,loading,loadMore,posts,navigation}) => {
    const dlUser = useContext(Mycontext)
    const xuLyDeletePost=async(idPost,index)=>{
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res= await authApi(token).delete(endpoints['deletePost'](idPost));
        if(res.status==204)
        {
          Alert.alert("Xóa thành công!!!");
          let temp = [...posts];
          temp.splice(index, 1);
          setPosts(temp);
        }
    } catch (ex) {
        console.error(ex);
    }
    }


    const deletePost = (idPost,index) => {
      Alert.alert(
        "Xóa bài viết",
        "Bạn có chắc chắn muốn xóa bài viết này?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () =>xuLyDeletePost(idPost,index)
 
          }
        ]
      );
    };
    return(
      <ScrollView style={{ flex: 1, paddingHorizontal: 1 }}horizontal={true} showsHorizontalScrollIndicator={false} onScroll={loadMore}>
      {/* {loading && <ActivityIndicator />} */}
      {console.log('1231313131312',posts)}
      {posts.map((user, index) => (
        
        <TouchableOpacity style={{ margin: 1, backgroundColor: color.white, padding:3, borderWidth: 1, borderColor: 'black', borderRadius: 10}} key={index} onPress={() => {navigation.navigate('PostDetail',{'place_id':user.id, "naviName": 'PostScreen'})}}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
            <Image
              source={{ uri: dlUser[0].avatar }}
              style={{ width: 30, height: 30, borderRadius: 15}}
            />
            <View>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{dlUser[0].username}</Text>
              <Text style={{ color: 'gray', fontSize: 12 }}>{moment(user.created_date).fromNow()}</Text>
            </View>
            <View style={{ flexDirection: 'row',flex:1,justifyContent: 'flex-end' }}>
                <TouchableOpacity style = {{padding:5}} onPress={() => navigation.navigate("updatePost",{"id_post":user.id})}>
                  <FontAwesome name="pencil" size={20} color={color.primary} />
                </TouchableOpacity>

                <TouchableOpacity style = {{padding:5}} onPress={() =>deletePost(user.id,index)}>
                  <FontAwesome name="trash" size={20} color={color.danger} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>
          </View>
          <View
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 12,
                  overflow: 'hidden',
                  width:300,
                  height:300,
                  margin:10
                }}
              >
                <Image
                  key={index}
                  source={{ uri:  user.pic[0].picture}}
                  style={{ width: "100%", height: "80%", borderRadius: 12 }}
                />                  
                <Text 
                      style={{   fontSize: 16, lineHeight: 24,
                        marginLeft:-10,marginRight:-10, color: color.primary,textAlign:"center" }}>
                      {user.title}
                    </Text>
                    <Text 
                      style={{ lineHeight: 24,
                        marginLeft:2, color: "red", fontSize: 14 }}>
                      {user.avgRate}
                      <FontAwesome name="star" size={15} color={color.secondary} />
                    </Text>
              </View>
             
        </TouchableOpacity>
      ))}
                      {loading && page > 1 && <ActivityIndicator />}
    </ScrollView>
    )
    
  };

  var temp2 = true;
const PostScreen = ({navigation}) => {
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const formData = route.params?.formData;
    const formData1 = route.params?.formData1;

    // Sử dụng optional chaining để kiểm tra tồn tại của route.params
    const [posts, setPosts] = useState()

    const getEndpoint = async(page)=>{
        let url = `${endpoints['post_current_user']}?page=${page}`;
        let token = await AsyncStorage.getItem('access-token')
        let res = await authApi(token).get(url)
        return res;
    }
    const loadUserPosts = async() => {
      if (formData!=undefined && temp2==true) {
        console.log('111111111111111111111111111111111111111111111111111111111111111111111')
        let res = await getEndpoint(1);
        setPage(1)
        temp2=false;
      
      console.log('dawdadawdadwawdawdawdadadwawdwdadawdawdawdawdadawdw')
        setPosts(res.data.results);
        return;
      }

      if (page > 0) {
        console.log('pageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',page)
        setLoading(true);
        try {
          
            let res = await getEndpoint(page);
            if (res.data.next === null)
                setPage(0);

            if (page === 1)
              setPosts(res.data.results);
            else
            setPosts(current => {
                    return [...current, ...res.data.results];
                });
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }
    
}
    const isScrollingRight = ({layoutMeasurement, contentOffset,contentSize}) => {
      return contentOffset.x > 0 && contentOffset.x + layoutMeasurement.width >= contentSize.width;
    };
    const loadMore = ({nativeEvent}) => {
      if (!loading && page > 0 && isScrollingRight(nativeEvent)) {
              setPage(page + 1);
      }
    }
    useEffect(() => {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      loadUserPosts()
      
    }, [formData,page,formData1])
    // const navigation = useNavigation();


    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://th.bing.com/th/id/OIP.0JITmpedQwHPZWj00eGiqwHaE7?rs=1&pid=ImgDetMain' }}
            style={styles.image}
          />
          <Text style={styles.text}>sharejourney</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={()=>{temp2 = true, navigation.navigate("PostForm")}}>
            <Text style={styles.submitButtonText}>Bạn muốn share hành trình</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.formContainer,padding:1,marginTop:50}}>
          <Text style={{...styles.text,marginTop:1}}>Các bài viết:</Text>
          {posts== undefined? <ActivityIndicator/>:<PhotosRoutes setLoading = {setLoading} setPosts={setPosts} page = {page} loading = {loading} posts = {posts} loadMore = {loadMore} navigation={navigation}></PhotosRoutes>}
        </View>
      </ScrollView>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:30
    },
    imageContainer: {
      flexDirection:"row",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 50, // Half of the width and height to make it a circle
    },
    text: {
      marginTop:20,
    //  / marginLeft: 10, // Adjust this value to position the text as needed
      fontSize: 20,
      color:color.primary
    },
    formContainer: {
      width: '100%',
      backgroundColor: '#f2f2f2', // Light gray background color for the form
      padding: 30,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      margin:5,

    },
    formContainer2: {
     backgroundColor: '#f2f2f2', // Light gray background color for the form
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      margin:5,

    },
    
    submitButton: {
      backgroundColor:"white",
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    submitButtonText: {
      color: 'black',
      fontSize: 16,
      textAlign:"center"
    },
  });

  export default PostScreen