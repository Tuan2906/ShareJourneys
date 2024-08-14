import React, { useState, useEffect, useCallback } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView,Image, RefreshControl} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants/theme';
import { SEARCH_PLACES } from '../../data';
import { MaterialIcons } from "@expo/vector-icons";
import { Surface} from 'react-native-paper';
import PostDetail from '../Post/PostDetail';
import APIs, { endpoints } from '../../config/APIs';
import moment from 'moment';
import "moment/locale/vi"
import Notification from '../Notification/Notification';
import registerNNPushToken from 'native-notify';


const ScreenHeader = ({navigation,fil,q}) => {
  // const users = [
  //   { name: 'Alice', age: 30 },
  //   { name: 'Bob', age: 25 },
  //   { name: 'Charlie', age: 35 },
  // ];
  // arrSort = users.sort((a,b)=>b.age - a.age)
  const [SortTags, setSortTags] = useState([]) 
  const [SortPosts, setSortPosts] = useState([]) 
  const [tagFake, setStateFake] = useState([]) 
  const [refreshing, setRefreshing] = useState(false);


  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   loadTag.then(loadPosts).then(() => setRefreshing(false));
  // }, []);

  // const [visible, setVisible] = useState(true)
  var visible = true
  // const [tags, setTags] = useState([]);
  // const [posts, setPosts] = useState([]); 
  // // Sắp xếp mảng theo tuổi giảm dần
  // const sortedUsers = users.sort((a, b) => b.age - a.age);
  Notification()
  const ToPostDetail = (id) =>{
    navigation.navigate('PostDetail',{"place_id": id,"naviName": 'HomePage'})
  }


  const loadTag= async () => {
    try {
      if(fil.id_tag==undefined) {
        let res = await APIs.get(endpoints['tag']);
        setSortTags(res.data.sort((a,b) => b.id - a.id));
        setStateFake(res.data.sort((a,b) => b.id - a.id));
        
      }
      else{
        const selectedTag = tagFake.find(tag => tag.id === fil.id_tag);
        setSortTags([selectedTag]);
      }
        
    } catch(ex) {
        console.error(ex);
    }
  }
  const loadPosts= async () => {
    try {
        let url = `${endpoints['allposts']}?q=${q}&c=${fil.id_localcome}&a=${fil.id_localarrive}&t=${fil.id_tag}&ti=${fil.time}&r=${fil.id_check}`;
        let res = await APIs.get(url);
        setSortPosts(res.data.sort((a,b) => b.avgRate - a.avgRate ));
    } catch(ex) {
        console.error(ex);
    }
  }
  useEffect(()=>{
    console.log('anac')
    loadTag()
  },[fil.id_tag,refreshing])

  useEffect(()=>{
    console.log('anac1')
    loadPosts()
  },[q,fil,refreshing])
  
// abc [1,2,3]
// fill = 2


const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToTop = 20;
  return contentOffset.y <= paddingToTop;
};
const loadMore = ({nativeEvent}) => {
  if ( isCloseToTop(nativeEvent)) {
    console.log('acn')
          setRefreshing(!refreshing);
  }
}

const filterPosts =  (tag) => {
  return  SortPosts.filter((posts) =>posts.tags.some(tagP => tagP.name === tag.name))
}

const handleTags = (arr,) => {
  if(visible ==true){
    visible = false
    let s = arr.find(tag => tag.id === fil.id_tag).name
    return s
  }
}

  // fill => rong => het ra
  // fill -> xài filter
  return (
      <View style={{...styles.container, width:'100%', height:'100%'}}>
            <ScrollView onScroll={loadMore}>
              {/*duyet qua tag*/}
              { SortTags.map((tag,index)=>(
                <View key={index}>
                  {/* {
                    filterPosts(tag).length!=0 && console.log( filterPosts(tag).length) && fil.id_tag!=undefined?
                    <Text style={styles.mainTitle}>{ handleTags(SortTags)}</Text>:<Text style={styles.mainTitle}>{tag.name}</Text>
                  } */}
                  <Text style={styles.mainTitle}>{tag.name}</Text>
                  <ScrollView  style={{ flex: 1, paddingHorizontal: 1}}horizontal={true} showsHorizontalScrollIndicator={false}>
                    {filterPosts(tag).map((place, index) => (
                    <TouchableOpacity key={place.id} onPress={() =>ToPostDetail(place.id)}>
                      <View 
                      style={
                      { 
                        margin: 9, 
                        padding:5, 
                        borderRadius: 10 ,
                        backgroundColor: '#f0f0f0', // Màu nền của container
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 50,
                          height: 50,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        elevation: 5,
                        borderStyle:'solid',
                        borderWidth:2,
                        borderColor: 'gray'
                        
                      }} >
                      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
                         <Image
                          source={{ uri:place.user.avatar }}
                          style={{ width: 30, height: 30, borderRadius: 15}}
                        />
                        <View>
                          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{place.user.username}</Text>
                          <Text style={{ color: 'gray', fontSize: 12 }}>{moment(place.created_date).fromNow()}</Text>
                        </View>
                      </View>
                      <View
                            style={{
                              flex: 1,
                              aspectRatio: 1,
                              borderRadius: 12,
                              overflow: 'hidden',
                              width:300,
                              height:300
                            }}
                          >
                           <Image
                              key={index}
                              source={{ uri: place.pic[0].picture}}
                              style={{ width: "100%", height: "80%", borderRadius: 12 }}
                            />
                            
                                <Text style={{ ...styles.text_Post, color: COLORS.black, fontSize: 25, textAlign:'center' }}>{place.title}</Text>
                                <View style = {{
                                  flexDirection: 'row', 
                                  paddingVertical: 5, 
                                  paddingHorizontal: 5, 
                                  justifyContent:'space-around'
                                  }}>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="star-border" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      { place.avgRate.toFixed(1)}
                                    </Text>
                                  </View>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="lock-clock" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      {moment(place.journey.ngayDi).format("DD/MM/YYYY")}
                                    </Text>
                                  </View>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="payment" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      {place.journey.chiPhi}
                                    </Text>
                                  </View>
                                </View>
                                
                      </View>
                    </View>  
                    </TouchableOpacity>
                  ))}
                  </ScrollView>
                </View>
                 
              ))}
                          <View style={{height:200}}></View>             
            </ScrollView>
          </View>

   
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
  },
  mainTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
  },
  secondTitle: {
    fontSize: SIZES.title,
  },
});

export default ScreenHeader;
