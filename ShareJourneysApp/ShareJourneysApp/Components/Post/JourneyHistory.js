
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    FlatList,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { StatusBar } from "expo-status-bar";
  import { MaterialIcons } from "@expo/vector-icons";
  import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { imagesDataURL, userJson } from "../../data/data";
import color from '../../style/color';
import styles from "../../style/Style";
import {  FontAwesome } from '@expo/vector-icons';
import RatingModal from "./ModalRating";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../config/APIs";
import moment from "moment";

const { name, posts } = userJson;
const LichSuDaDangKy = ({navigation}) => {
  const [posts, setPosts] = useState()
  const loadHisPostRegister = async() => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).get(endpoints['hisPostRegister'])
      
      setPosts(res.data);
      } catch (ex) {
          console.error(ex);
          return;
      }
 }
  useEffect(() => {
    loadHisPostRegister()
  }, [])
;
return (
    <ScrollView style={{ paddingHorizontal: 1,padding:1 }}>

      {posts==undefined? <ActivityIndicator/>:posts.map((user, index) => (
        <TouchableOpacity
          style={{
            margin: 1,
            backgroundColor: color.white,
            padding: 3,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
          }}
          key={index}
          onPress={
            () => {
              data = { "naviName": 'History', "place_id":  user.post_id }
              navigation.navigate('PostDetail', data)}
            }
        
        >
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 12,
              flexDirection: 'row',
              width: '30%',
              height: '30%',
            }}
          >
            <Image
              key={index}
              source={{ uri: user.pic.picture }}
              style={{ width: '100%', height: '100%', borderRadius: 1 }}
            />
            <View style={{width:120,height:100}}>
            <Text
              style={{
                ...styles.text_Post,
                color: "red",
                fontSize: 15,
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              {user.title}
            </Text>
          
            </View>
            <View style={{borderColor:"black",borderWidth:1,borderRadius:10,height:"40%",left:70,top:0,marginTop:-3,shadowColor:"grey",shadowOpacity:100,shadowRadius:10}}>
                <Text
                style={{
                    ...styles.text_Post,
                    color: "gray",
                    fontSize: 15,
                    textAlign: 'center',
                    right:0,
                    top:0,
                    left:0,
                    
                }}
                >
                { moment(user.created_date).format("HH:mm:ss")}
                </Text>
            </View>
           
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
)
};
  var id=0;
  const LichSuDaDaDi = ({navigation}) => {
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [posts, setPosts] = useState()
  const loadHisPost = async() => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).get(endpoints['historyPost'])
      setPosts(res.data);
      } catch (ex) {
          console.error(ex);
          return;
      }
 }
  useEffect(() => {
    loadHisPost()
  }, [isRatingModalVisible])
    const handlePressRating = (userId) => {
      console.log(`Report button pressed for user ${userId}`);
      id= userId
      console.log(id);
      setIsRatingModalVisible(true);
    };
  
    const handlePressCloseRatingModal = () => {
      setIsRatingModalVisible(false);
      console.log(posts);
    };
  
    return (
      <ScrollView style={{ paddingHorizontal: 1, padding: 1 }}>
        {posts==undefined? <ActivityIndicator/> :posts.map((user, index) => (
          <TouchableOpacity
            style={{
              margin: 1,
              backgroundColor: color.white,
              padding: 3,
              borderWidth: 1,
              borderColor: color.black,
              borderRadius: 10,
            }}
            key={index}
            onPress={() =>{
              data = { "naviName": 'History', "place_id":  user.post_id }
              navigation.navigate('PostDetail', data)}
            }
            accessibilityLabel={`Post ${index + 1}`} // add accessibilityLabel here

          >
            <View
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                flexDirection: 'row',
                width: '30%',
                height: '30%',
              }}
            >
              <Image
                key={index}
                source={{ uri: user.pic.picture }}
                style={{ width: '100%', height: '100%', borderRadius: 1 }}
              />
              <View style={{ width: 120, height: 100 }}>
                <Text
                  style={{
                    ...styles.text_Post,
                    color: 'red',
                    fontSize: 15,
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  {user.title}
                </Text>
  
                {user.rate !=null && (
                  <Text style={{ padding: 6, textAlign: 'center' }}>
                    Đã Đánh giá: {user.rate}
                    <FontAwesome name="star" size={15} color={color.primary} />
                  </Text>
                )}
                {user.rate==null && (
                  <View
                    style={{
                      backgroundColor: color.primary,
                      borderWidth: 1,
                      borderRadius: 10,
                      width: '50%',
                      height: '25%',
                      left: 30,
                      marginTop: 2,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handlePressRating(user.post_id)}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        Đánh giá
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
  
              <View
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  height: '40%',
                  left: 73,
                  top: 0,
                  marginTop: -3,
                  shadowColor: 'grey',
                  shadowOpacity: 100,
                  shadowRadius: 10,
                }}
              >
                <Text
                  style={{
                    ...styles.text_Post,
                    color: 'gray',
                    fontSize: 15,
                    textAlign: 'center',
                    right: 0,
                    top: 0,
                    left: 0,
                  }}
                >
                  { moment(user.created_date).format("HH:mm:ss")}
                </Text>
              </View>
              
                <RatingModal
                  isVisible={isRatingModalVisible}
                  onClose={handlePressCloseRatingModal}
                  posts={posts}
                  idPost={id}
                  
                />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      );
};




const JourneyHistory = ({navigation}) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
  
    const [routes] = useState([
      { key: "first", title: "Đã đăng ký" },
      { key: "second", title: "Đã đi" },
    ]);
    const renderScene = SceneMap({
      first: () => <LichSuDaDangKy navigation={navigation} />,
      second: () => <LichSuDaDaDi navigation={navigation} />,
    });

    const renderTabBar = (props) => (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: color.primary,
        }}
        style={{
          backgroundColor: color.white,
          height: 50,
          margin:1
        }}
        renderLabel={({ focused, route }) => (
          <Text style={[{ color: focused ? color.black : color.gray }]}>
            {route.title}
          </Text>
        )}
      />
    );
    return(
        <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
            <View style={styles_History.imageContainer}>
                <Image
                    source={{ uri: 'https://th.bing.com/th/id/OIP.0JITmpedQwHPZWj00eGiqwHaE7?rs=1&pid=ImgDetMain' }}
                    style={styles_History.image}
                />
                <Text style={styles_History.text}>sharejourney</Text>
            </View>
            <Text style={{...styles.modalTitle,color:color.secondary,textAlign:"center",fontSize: 30}}>History</Text>
            <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            />

      </View>
    )
}
const styles_History = StyleSheet.create(
    {
        imageContainer: {
            flexDirection:"row",
            
        },
        text: {
            marginTop:9,
        //  / marginLeft: 10, // Adjust this value to position the text as needed
            fontSize: 20,
            color:color.primary
        }, 
        image: {
            width: 50,
            height: 50,
            borderRadius: 50, // Half of the width and height to make it a circle
          },
    }
)
export default JourneyHistory