import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ScrollView,
  Modal,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
// import { photos, pofile, userJson } from "../../data/data";
import color from '../../style/color';
import styles from '../../style/Style';
import ReportModal from "./UIHeader";
import moment from "moment";
import {  FontAwesome } from '@expo/vector-icons';
import APIs, { endpoints } from "../../config/APIs";


const PhotosRoutes = ({id,navigation}) => {
  // const {username,posts_current_user}  = pofile;
  // console.log('11111111111111111111111111111111111',pofile);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState()
    const loadUserPosts = async() => {
      if (page > 0) {
        setLoading(true);
        try {
            let url = `${endpoints['post_user'](id)}?page=${page}`;
            let res = await APIs.get(url);
            
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
      loadUserPosts()
    }, [page])

  return(
    <ScrollView style={{ flex: 1, paddingHorizontal: 1 }}horizontal={true} showsHorizontalScrollIndicator={false} onScroll={loadMore}>
            {loading && <ActivityIndicator />}

    { posts != undefined && posts.map((user, index) => (
      <TouchableOpacity style={{ margin: 1, backgroundColor: color.white, padding:3, borderWidth: 1, borderColor: 'black', borderRadius: 10}} key={index}  
      onPress={() => {navigation.navigate('PostDetail2',{'place_id':user.id, "naviName": 'ProfileUser'})}}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
          <Image
            source={{ uri: user.user.avatar }}
            style={{ width: 30, height: 30, borderRadius: 15}}
          />
          <View>
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{user.user.username}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>{moment(user.created_date).fromNow()}</Text>
          </View>
          
        </View>
        <View
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                overflow: 'hidden',
                width:100,
                height:350,
                margin:4
              }}
            >
              <Image
                key={index}
                source={{ uri: user.pic[0].picture}}
                style={{ width: "100%", height: "80%", borderRadius: 12 }}
              />                  
              <Text 
                    style={{ ...styles.text_Post, color: color.primary, fontSize:30,textAlign:"center" }}>
                    {user.title}
                  </Text>
                  <Text 
                    style={{ ...styles.text_Post,marginLeft:9, color: "red", fontSize: 20, marginBottom:10 }}>
                    {user.avgRate.toFixed(0)}
                    <FontAwesome name="star" size={15} color={color.secondary} />
                  </Text>
            </View>
            
      </TouchableOpacity>
    ))}
                          {loading && page > 1 && <ActivityIndicator />}

  </ScrollView>
  );
  
};




const Profile = ({navigation, route}) => {
  console.log(122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222)
  const {id} = route.params;
  console.log('userrrrrrrrrrrrrrrrrrrrrrrrrrrrr',id)
  
  const [pofile, setPofile] = useState();

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const handlePressReport = () => {
    setIsReportModalVisible(true);
  };

  const handlePressCloseReportModal = () => {
    setIsReportModalVisible(false);
  };
  
  const loadUser = async () =>{
    try{
      console.log('usersssssssssssssssssssssssss')
      let res = await APIs.get(endpoints['user'](id))
      console.log('usersssssssssssssssssssssssss',res.data)
      setPofile(res.data)
      }
      catch(ex)
      {
        console.error(ex);
      }
  }
  useEffect(()=>{
    loadUser();
  },[id])

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: color.white,
      }}
    >
      {pofile==undefined? <ActivityIndicator/>:
     <>
     <StatusBar backgroundColor={color.gray} />
      <View style={{ width: "100%" }}>
        <Image
          source={{uri: pofile.avatar}}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
      </View>
      <TouchableOpacity
        style={
              styles.touchableOpacityGoBack

        }
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={{ uri: pofile.avatar }}
          resizeMode="contain"
          style={styles.imgProfileUser}
        />
        <Text
          style={{
            fontSize:23,
            color: color.black,
            marginVertical: 8,
          }}
        >
                {pofile.username}
        </Text>
        <View
          style={{
            paddingVertical: 1,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 0,
              marginTop:-10
            }}
          >
            <Text
              style={{
                 fontSize:20,
                color: color.primary,
                alignItems: "center"
              }}
            >
              Rate
            </Text>
            <Text
              style={{
                fontSize:20,
                color: "red",
              }}
            >
              {(pofile.avgRate *10).toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
              style={styles.touchableOpacity_report}
              onPress={handlePressReport}
            >
              <Text
                style={styles.text}
              >
                Report
              </Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableOpacity_nhantin}
          >
         <MaterialIcons name="message" size={20} color="red" style={{padding:5}} />
            <Text
              style={styles.text}
            >
              Nhắn tin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, borderColor:"black",borderWidth:1,borderStyle:"solid", marginTop:5 }}>
        </View>
        <Text style={{...styles.text_Post,fontWeight:"bold",fontSize:20,padding:2,marginTop:10}}>Các hành trình đã đăng tải</Text>
      <View style={{ flex: 1, marginHorizontal: 2, marginTop: 1 }}>
        <ScrollView>
          {console.log('pofilelllllllllll',pofile)}
          {pofile==undefined? <ActivityIndicator/>:<PhotosRoutes id = {id} navigation={navigation} />}
        </ScrollView>
      </View>
      <ReportModal user={pofile.username} id_user = {id} isVisible={isReportModalVisible} onClose={handlePressCloseReportModal} />
     </>}
     <View style={{height:100}}></View>
    </ScrollView>
  );
};


export default Profile;