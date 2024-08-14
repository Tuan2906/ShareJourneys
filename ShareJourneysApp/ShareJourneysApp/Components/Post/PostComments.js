import React, { useState, useRef ,forwardRef, useEffect,memo ,useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image, Button,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons,Feather } from '@expo/vector-icons';
import UserComments from '../../data/Comments';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../constants';
import moment from 'moment';
import reply from '../../data/cmtRep';
import APIs, { authApi, endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from '../Notification/Notification';





const Comment =forwardRef(({ title ,ngaydi,id_userPost,setIdReped,id_P, id_c,reference, index, setIn, comment,bool,setIsCmtRep }, ref) => {
  const [selectedReason, setSelectedReason] = useState();
  const [tick, setTick] = useState();
  const dlUser= useContext(Mycontext)

  const handleRep = (id_c) => {
    console.log('abc')
    console.log(index)
    console.log(bool)
    console.log(id_c)

    reference()
    setIn(index)
    setIsCmtRep(bool);
    setIdReped(id_c)

  };

  const AddCommentTick = async (id_userCMT) =>{
    try{
      let res = await APIs.post(endpoints['add-tick'](id_P,id_c),{'idUser': id_userCMT})
      console.log('TIcklkkkkkkkkkkkkkkkkkkkkkkkkk',res.data)
      setTick(res.data)
      if (res.data.tick[0].active == true) {
        sendNotification(`Bạn được mời đi chung hành trình ${title}`,res.data.user.username)
      }
      else {
        sendNotification(`Bạn bị hủy hành trình ${title}` ,res.data.user.username)
      }
    }
      catch(ex)
      {
        console.error(ex);
      }
  }


  
  const handlePressReason = (reason, id_userCMT) => {
    console.log('dawdadawdawdddddw',id_userCMT, reason)
    console.log('dawdadawd',dlUser[0].id)
    console.log('dawdadawdawdddddw222222222222',id_userPost)
    console.log('dawdadawdawdddddw333333333333',selectedReason)

    if (id_userPost == dlUser[0].id)
    {
      AddCommentTick(id_userCMT)
      if (selectedReason == reason) {
        console.log('1')
        setSelectedReason(null);
      } else {
        console.log('2')
        setSelectedReason(reason);
      }
    }
  }
  const checkDisabledButon =()=> {
    console.log(moment(ngaydi))
    console.log(moment())

    console.log(moment() >= moment(ngaydi))
    if ( moment().isAfter(moment(ngaydi)))
      return true
    return false
  }
  return (
    <TouchableOpacity disabled={checkDisabledButon()}  onPress={() => handlePressReason(index, comment.user.id)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Image source={{ uri:  comment.user.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />

        <View style={{ flex: 1, width: 'auto', backgroundColor: 'lightgray', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{comment.user.username}</Text>
          <Text>{comment.content}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text style={{ color: 'black', fontSize: 12 }}>{moment(comment.created_date).fromNow()}</Text>


            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleRep(id_c)} ref={ref}>
              <Feather name="message-circle" size={20} color="black" />
            </TouchableOpacity>

            {/* {console.log(comment.tick!= undefined )}
            {console.log( comment.tick.length > 0)}
            {console.log( comment.tick[0].active)} */}
            {/* {console.log('cawcaw' ,tick)} */}
            { tick==undefined? comment.tick!= undefined && comment.tick.length > 0 && comment.tick[0].active &&
            <>
              <View style={{ justifyContent: 'flex-end', width: 40 }}>
                  <MaterialIcons
                            name="check-circle"
                            size={24}
                            color="green"
                          />
              </View>
            </>:
            tick.tick[0].active &&
            <>
            <View style={{ justifyContent: 'flex-end', width: 40 }}>
                <MaterialIcons
                          name="check-circle"
                          size={24}
                          color="green"
                        />
            </View>
          </>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});


const Comments = forwardRef(({title ,ngaydi,id_userPost,id_P, setIdReped,handleRef, setIn, comments, set, setRep, rep,setIsCmtR }, ref) => {
  const [showReplyViews, setShowReplyViews] = useState(Array(comments.length).fill(false));
  const [up, setUp] = useState(90)
  // const [indexState,setIndexState] = useState(0);
  // const [id_cmt, setId_cmt] = useState()
  // const [load, setLoad]= useState(false)
  const loadCommentRepPost = async (comment_id,index) =>{
    try{
      let res = await APIs.get(endpoints['reply'](comment_id))
      const newRep = [...rep]; // Sao chép mảng Rep
      newRep[index] = res.data // Thay đổi giá trị tại index
      setRep(newRep); // Cập nhật mảng Rep
      }
      catch(ex)
      {
        console.error(ex);
      }
  }


  const handleReplyPress =  (index, id_cmt,rep, count_rep) => {
     let change = -up
    setUp(change)
    const newShowReplyViews = [...showReplyViews];

    newShowReplyViews[index] = !newShowReplyViews[index];
   


    setShowReplyViews(newShowReplyViews);
    loadCommentRepPost(id_cmt, index);

  };
  
  // useEffect(() => {
  //   if (showReplyViews[indexState]) {
  //     loadCommentRepPost(id_cmt, indexState);
  //   }
  //   setLoad(true);
  // }, [showReplyViews[indexState]]);


  const useHandleRefresh = ()=>{
    handleRef()
  }
  return (
    <View >
      {comments.map((comment, indexArr) => (
        <View  key={comment.id} style={{ flexDirection: 'column' }}>
           <Comment  title={title} ngaydi={ngaydi} ref={ref} id_userPost={id_userPost}  setIdReped={setIdReped} id_P = {id_P} id_c = {comment.id} reference={useHandleRefresh} comment={comment} index={indexArr} bool ={true} idCmt = {comment.id} setIsCmtRep={setIsCmtR} setIn={setIn} />
          
          {/* nut hien reply */}
          {comment.reply_count != 0 &&
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20, marginRight: 20, flexDirection: 'row' }} onPress={() => handleReplyPress(indexArr, comment.id, rep,comment.reply_count)}>
              <MaterialIcons name="play-arrow" size={24} color="black" style={{ transform: [{ rotate: `${up}deg` }] }} />
              <Text style={{ color: 'black', fontSize: 12 }}>{comment.reply_count} reply</Text>
            </TouchableOpacity>} 


            {/* show reply */}
          {showReplyViews[indexArr] && (
            <View style={{ paddingLeft: 30, marginTop: 10 }}>
              
              {rep.length == 0? <ActivityIndicator/>:  
              <>
           

                {!Array.isArray( rep[indexArr])?   <ActivityIndicator/>:
               <>
               {   rep[indexArr].map((reply, indexArr) => (
                  <View style={{ paddingLeft: 10, marginTop: 10 }} key={indexArr}>
                    <Comment reference={useHandleRefresh} comment={reply} index={''} setIn={setIn} bool={false} setIsCmtRep={setIsCmtR}/>
                  </View>
                ))}
               </>
                }
              </>
              }
              
            </View>
          )}
        </View>
      ))}
    </View>
  );
});


const InputView = forwardRef(({view,setView, id_c,id_P,index,setIn,comments, set,rep, setRep ,iscmtRep,setIsCmtR }, ref) => {
  const [newCommentText, setNewCommentText] = useState('');

  
  // newComment.content = newCommentText;

  const addComment = async () => {
      try {
          let token = await AsyncStorage.getItem('access-token');
          let res = await authApi(token).post(endpoints['add-comment'](id_P), {
              'content': newCommentText
          })
          set([res.data,...comments]);
          

      } catch (ex) {
          console.error(ex);
      }
  }

  const addRep = async () => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['add-rep'](id_c), {
          'content': newCommentText
      })

      // setRep([res.data,...rep]);
      const cm = comments.splice(index, 1,res.data);
      console.log('123456',cm);
      set(comments);
      setView(!view);

  } catch (ex) {
      console.error(ex);
  }
  }

  const handleAddComment = () => {
    if(iscmtRep) {

        addRep()
    }
    else{
      addComment()

    }
    setIsCmtR(false)
    setNewCommentText('');
  };

  return (
    <View style={{ width: '100%' }}>
      <TextInput
        ref={ref} // Đảm bảo chuyển ref vào TextInput
        style={{ borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
        label="Thêm bình luận"
        value={newCommentText}
        onChangeText={setNewCommentText}
        right={
          <TextInput.Icon icon="send" onPress={handleAddComment} />
        }
      />
    </View>
  );
});


const PostComments = ({title,ngaydi,islocked,id_userPost,id_post, isVisible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [cmtRep, setCmtRep] = useState()
  const [isCmtRep, setIsCmtRep] = useState(false)
  const [index, setIndex] = useState(0);
  const inputRef = useRef();
  const [idCmt, setIdCmt] = useState()// de luu rep
  const [viewCMTRep,setViewCMTRep ] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    // Thực hiện hành động trên TextInput của thành phần cha

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // const NewUserCmt = () => {
  //   let id =''
  //   if (comments.length== 0) {
  //     id= 0
  //   }
  //   else comments[0].id + 1
    
  //   return user
  // }



  const loadCommentsPost = async () =>{
    console.log('page',page)

    if (page > 0) {
      setLoading(true);
      console.log('k vo day')
    try{
      let res = await APIs.get(`${endpoints['comments'](id_post)}?page=${page}`)

    
      if (res.data.next === null)
        setPage(0);

      if (page === 1)
        setComments(res.data.results);
      else
        setComments(current => {
            return [...current, ...res.data.results];
        });
      }
      catch(ex)
      {
        console.error(ex);
      }
      finally{
        setLoading(false);

      }
  }
}
  useEffect(()=>{
    console.log('dawddddddddddddddddddddddddddddddddddddddddddddddddddwoo[pmomopm');
    loadCommentsPost();
  },[id_post,viewCMTRep,page])

  useEffect(()=>{
    setCmtRep(() => Array(comments.length).fill(null).map(() => []))

  },[comments])

  // useEffect(()=>{
  //   console.log('cadwda',cmtRep)
  //   setViewCMTRep(!viewCMTRep)
  // },[cmtRep])

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  };
  const loadMore = ({nativeEvent}) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
    }
}


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}

    >
      <View style={[styles.container, styles.overlay]}>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Bình Luận</Text>
        <ScrollView style={{ width: '100%', height: '80%', marginTop: 30 }} onScroll={loadMore}>
        <RefreshControl onRefresh={() => loadCommentsPost()} />
        {loading && <ActivityIndicator />}
          {comments.length != 0 && <Comments title={title} ngaydi={ngaydi} id_userPost={id_userPost}  id_P = {id_post} setIdReped={setIdCmt} handleRef={handleButtonPress}  setIn = {setIndex} comments={comments} rep = {cmtRep} setRep = {setCmtRep} set = {setComments} setIsCmtR = {setIsCmtRep} ref={inputRef} />}
          {loading && page > 1 && <ActivityIndicator />}

        </ScrollView>
        {console.log('lockkkkkkkkkkkkkkkkkk',islocked)}
        {islocked != 'lock'  && <InputView view = {viewCMTRep} setView = {setViewCMTRep} id_P = {id_post} id_c ={idCmt} comments={comments} index={index} setIn = {setIndex} set={setComments} rep = {cmtRep} setRep = {setCmtRep} iscmtRep = {isCmtRep} setIsCmtR = {setIsCmtRep}  ref={inputRef} />}
      </View>
    </Modal>
  );

};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    height:'100%',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedReasonItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
  },
  reasonText: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});




export default memo(PostComments);
