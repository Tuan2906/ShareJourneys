import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Send, Avatar } from 'react-native-gifted-chat';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { authentication, db } from '../../firebase/firebaseconf';
import { Ionicons } from '@expo/vector-icons'; // Bạn cần cài đặt thư viện @expo/vector-icons nếu chưa cài đặt

const Chat = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  console.log('ben chat',route.params)
  const  uid  = route.params.uid
  const  username  = route.params.name
  const  avatar  = route.params.avatar
  const  avatarRec  = route.params.avatarRec
  const  name  = route.params.username

console.log(uid,username, avatar)
  const currentUser = authentication?.currentUser?.uid;
  // truy van lay du lieu ma da tuong tac voi nhau 
  useEffect(() => {
    const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
    const docref = doc(db, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const q = query(colRef, orderBy('createdAt',"desc"));
    const unsubcribe = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map(mes => {
        if(mes.data().createdAt){
          return{
            ...mes.data(),
            createdAt:mes.data().createdAt.toDate()
          }
        }else{
          return{
            ...mes.data(),
            createdAt:new Date()
          }
        }
        

      })
      setMessages(allMsg)

    })

      return () => {
        unsubcribe()
      }
  },[])
// Gui tin nhan cua nguoi dang nhap vao gui toi uid nguoi nhan duoc
  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    // console.log(myMsg)
    const myMsg = {
      ...msg,
      sentBy:currentUser,
      sentTo:uid
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;


    const docref = doc(db, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const chatSnap = addDoc(colRef, {
      ...myMsg,
      createdAt:serverTimestamp(),
    })

  }, [])
  
  



  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() =>navigation.goBack()} style ={{...styles.callButton,backgroundColor:'#fff',marginRight:10}} >
          <Ionicons name="chevron-back" size={20} color="#000" />
      </TouchableOpacity>
        <Image
          source={{ uri: avatarRec }} // Thay thế bằng URL avatar của người trò chuyện
          style={styles.avatar}
        />
        <Text style={styles.headerText}>{name}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      placeholder='Nhập tin nhắn'
      user={{
        _id: currentUser,
        name: username,
        avatar: avatar,
       
      }}
      
    />
    </SafeAreaView>
    

  )
}
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: `${(((height/100 - 0.95)*100)/height)*100}%`,
    position:'relative',
    zIndex: 0,
    marginTop:30,
  },
  header: {
    height: '10%',
    width: '100%',
    backgroundColor: '#0084FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position:'relative',
    top:0,
    zIndex:999,
    
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
 
});

export default Chat;