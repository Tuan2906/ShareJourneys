import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import APIs, { authApi, endpoints } from '../../config/APIs';
import { Chip } from 'react-native-paper';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import color from '../../style/color';
import { ImageList } from './FirstPage';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UpdatePostForm = ({navigation,route}) => {

  const id_post = route.params?.id_post;
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState([]);
  const [pickerLocalCome, setPickerLocalCome] = useState('');
  const [pickerLocalArrive, setPickerLocalArrive] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedChips, setSelectedChips] = useState('');
  const [isDatePickerNgayDiVisible, setDatePickerNgayDiVisibility] = useState(false);
  const [isDatePickerNgayDenVisible, setDatePickerNgayDenVisibility] = useState(false);
  const [dateNgayDi, setDateNgayDi] = useState(new Date());
  const [dateNgayDen, setDateNgayDen] = useState(new Date());
  const [transports, setTransports] = useState([]);
  const [transport, setTransport] = useState([]);
  const [tick, setTick] = useState(false);
  const [visibleImage, setVisibleImage] = useState([]);
  const [imageUser, setImageUser] = useState([]);

  const [detail, setDetail] = useState({title:'', content: '',chiphi:'',phuongtien:''});


  const loadDetailPost = async () =>{
    try{
      let res = await APIs.get(endpoints['posts'](id_post))
      console.log(res.data)
      let data = res.data
      setDetail({title:data.title, content:data.content, chiphi:data.journey.chiPhi,
         phuongtien: data.journey.id_PhuongTien})
      setPickerLocalCome(data.journey.id_tuyenDuong.id_noiDi)
      setPickerLocalArrive(data.journey.id_tuyenDuong.id_noiDen)
      setSelectedChips(data.tags)
      setVisibleImage(data.pic)
      setDateNgayDi(new Date(data.journey.ngayDi))
      setDateNgayDen(new Date(data.journey.ngayDen))
      }
      catch(ex)
      {
        console.error(ex);
      }
  }
  useEffect(()=>{
      loadDetailPost();
  },[])


  const handleTrSelection = (data) => {
    setTick(!tick);
    setTransports({ ...transports, [data.id]: !transports[data.id] });
    console.log(data)
    setDetail({...detail,phuongtien:data})
    console.log('Selected Transports:', transports);
  };

  const loadTransport = async () => {
    try {
      let res = await APIs.get(endpoints['transport']);
      setTransport(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleTagSelection = (tag) => {
    console.log('dadwadwd',tag)
    console.log('dadwadwd',selectedChips)

    if (selectedChips.some(c => c.id === tag.id)) {
      // Nếu tag đã tồn tại, xóa nó khỏi selectedChips
      const updatedChips = selectedChips.filter(c => c.id !== tag.id);
      console.log("updatedChips",updatedChips)
      console.log(1)
      setSelectedChips(updatedChips);
    } else {
      console.log(2)

      // Nếu tag chưa tồn tại, thêm nó vào selectedChips
      setSelectedChips([...selectedChips, tag]);
    }
  };

  const loadTag = async () => {
    try {
      let res = await APIs.get(endpoints['tag']);
      setTags(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleSelectCome = (value) => {
    if(value!=undefined) {

      console.log('handleSelectCome',value);
      setPickerLocalCome(value || '');
    }
  };

  const handleSelectArrive = (value) => {
    if(value!=undefined) {

      console.log('handleSelectArrive',value)
      setPickerLocalArrive(value || '');
    }
  };

  const loadDestination = async () => {
    try {
      let res = await APIs.get(endpoints['local']);
      setDestinations(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadTag();
    loadDestination();
    loadTransport();
  }, []);

  const handleImageUser = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        selectionLimit: 5,
      });

      if (result && !result.canceled) {
        const selectedImages = result.assets.map(asset => asset.uri);
        const selectedPictures = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: 'image/jpeg'
        }));
        setImageUser(selectedPictures);
        console.log('anc',selectedImages[0])
        setVisibleImage([...visibleImage,{
          id: "device",
          picture:selectedImages[0],
        }]);
      }
    }
  };

  const loadPicture = async () => {
    if (page > 0) {
      setLoading(true);
      try {
        let res = await APIs.get(`${endpoints['picture']}?page=${page}`);
        if (res.data.next === null) {
          setPage(0);
        }
        if (page === 1) {
          setPicture(res.data.results);
        } else {
          setPicture(current => [...current, ...res.data.results]);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPicture();
  }, [page]);

  const isCloseToEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToEnd = 20;
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToEnd;
  };

  const loadMore = ({ nativeEvent }) => {
    if (!loading && page > 0 && isCloseToEnd(nativeEvent)) {
      setPage(page + 1);
    }
  };

  const handlePressChooseImgFromLibrary = () => {
    setShowImagePicker(!showImagePicker);
    

  };

  const handleImageSelect = (image) => {
    setVisibleImage([...visibleImage,image]);
    console.log('Image selected:', image);
  };

  const handleConfirmNgayDi = (date) => {
    setDateNgayDi(date);
    hideDateNgayDiPicker();
  };

  const handleConfirmNgayDen = (date) => {
    setDateNgayDen(date);
    hideDateNgayDenPicker();
  };

  const showDateNgayDiPicker = () => {
    setDatePickerNgayDiVisibility(true);
  };

  const showDateNgayDenPicker = () => {
    setDatePickerNgayDenVisibility(true);
  };

  const hideDateNgayDiPicker = () => {
    setDatePickerNgayDiVisibility(false);
  };

  const hideDateNgayDenPicker = () => {
    setDatePickerNgayDenVisibility(false);
  };
  const handleChange = (change,value) => {
      if (change == 'title'){
        setDetail({...detail,title:value})
      }
      else if (change == 'content'){
        setDetail({...detail,content:value})
      }
      else if (change == 'chiphi'){
        setDetail({...detail,chiphi:value})
      }
  }
  const handleSubmit = async() => {
    // console.log(detail)
    // console.log(transports)
    // console.log(selectedChips)
    // console.log(visibleImage)
    // console.log(dateNgayDi)
    // console.log(dateNgayDen)
    // console.log(pickerLocalCome)
    console.log(pickerLocalArrive)
    console.log(1)
    // const formData= new FormData({
    //   'title': detail.title,
    //   'content': detail.content,
    //   'chiPhi': detail.chiphi,
    //   'phuongtien': detail.phuongtien.id,
    //   'diemDi':pickerLocalCome ,
    //   'diemDen':pickerLocalArrive,
    //   'ngayDi': dateNgayDi,
    //   'ngayDen': dateNgayDen,
    //   'tag':selectedChips,
    //   'pictureDaChon': visibleImage.filter(image => image.id != "device").map(image => image.id),
    //   'pictureUserSelect': imageUser
    // });
    const formData = new FormData();
    formData.append('title', detail.title);
    formData.append('content', detail.content);
    formData.append('chiPhi', detail.chiphi);
    formData.append('phuongtien', detail.phuongtien.id);
    formData.append('diemDi', pickerLocalCome);
    formData.append('diemDen', pickerLocalArrive);
    formData.append('ngayDi', dateNgayDi.toISOString()); // Chuyển đổi sang định dạng ISO
    formData.append('ngayDen', dateNgayDen.toISOString()); // Chuyển đổi sang định dạng ISO
    selectedChips.forEach((chip) => {
      formData.append("tag", chip.id);
    });
    visibleImage.filter(image => image.id !== "device").forEach((image, index) => {
      formData.append(`pictureDaChon`, image.id);
    });
    
    // Thêm các hình ảnh từ thiết bị của người dùng
    imageUser.forEach((image, index) => {
      formData.append(`pictureUserSelect`, 
       image
      );
    });
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).patch(endpoints['editPost'](id_post),formData,{
        headers: {
          'Content-Type':'multipart/form-data',
        },
      })
      } catch (ex) {
          console.error(ex);
          return;
      }
    navigation.navigate('PostScreen',{formData1:formData});

    console.log('formData',formData)
  }
  const handleUnselectImage = (index) => {
    //console.log(selected);
     console.log(index)
     console.log('pictureDaChon',visibleImage)
     
      const updatedImages = [...visibleImage];
     // const updateHT= [...selected]
      console.log("truoc khi update",updatedImages);
      updatedImages.splice(index, 1);
      //updateHT.splice(index,1);
      console.log("sau khi update",updatedImages);
      setVisibleImage(updatedImages);
      //formData.pictureDaChon=updateHT;
     // console.log(formData.pictureDaChon)
      if(visibleImage.length==0)
      {
        setImageUser([]);
        return;
      }
      // pic da chon: tu he thong
      // console.log('formData.pictureUserSelect11111111',fo)
      // console.log('formData.pictureDaChon111111111111',formData.pictureDaChon);
      // setImageS(visibleImage.filter(image => image.id != "device").map(image => image.id));

      const selectedPictures = visibleImage.filter(image => image.id == "device")
  
      const filteredPictures = imageUser.filter(picture => 
        selectedPictures.some(selected => selected.picture === picture.uri)
    );
      // .map(image => {
      //   formData.pictureUserSelect.some(pic => pic.uri == image.picture);
      // })
      setImageUser( filteredPictures)
      console.log('selectedPictures',filteredPictures)
    };

  return (
    <>
    { 
    detail===undefined? <ActivityIndicator/>:
        <Formik
      >
        
          
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange('title',value)}
              value={ detail.title}
              placeholder="Title"
            />
            <Text style={styles.label}>Nội dung</Text>
  
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange('content',value)}
              value={detail.content}
              placeholder="Content"
              multiline
              numberOfLines={4}
            />            
            <Text style={styles.label}>Tags</Text>
            <ScrollView style={{ marginTop: 2 }} horizontal={true} showsHorizontalScrollIndicator={false}>
            {tags ==[] && <ActivityIndicator/>}
            {tags.map((tag, index) => (
                <TouchableOpacity key={index} onPress={() => handleTagSelection(tag)}>
                  <View style={{ position: 'relative', padding: 1, borderColor: color.black,backgroundColor:color.secondary ,borderRadius: 10, borderWidth: 1, margin: 5 }}>
                    <Text style={styles.text}>{tag.name}</Text>
                    {console.log(selectedChips==undefined)}
                    {console.log('chipppppppp',selectedChips)}
                    {selectedChips==undefined || selectedChips==''?<ActivityIndicator/>: selectedChips.map((chip, indexs) =>
                      chip.id == tag.id  && < MaterialIcons key={indexs} name="check-circle" size={20} color="green" style={{ position: 'absolute', top: 0, right:1,marginTop:-7, marginRight:-11 }} />
                    )
                     }
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
  
            <Text style={styles.label}>Phương tiện di chuyển</Text>
            <ScrollView style={styles.transportContainer} horizontal showsHorizontalScrollIndicator={false}>
              {transport.map((tr, index) => (
                <TouchableOpacity key={index} onPress={() => handleTrSelection(tr)}>
                  <View style={[styles.transportItem]}>
                    <Text style={styles.transportText}>{tr.loai}</Text>
                    { console.log('detaillllllll',detail) }
                    {
                    detail.phuongtien.loai == tr.loai && <MaterialIcons name="check-circle" size={20} color="green" style={styles.transportIcon} />
                    // transports[tr.id]  && <MaterialIcons name="check-circle" size={20} color="green" style={styles.transportIcon} />
                    }
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.label}>Chi phí</Text>
            
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange('chiphi',value)}
              value={detail.chiphi}
              placeholder="Chi Phi"
            />
            <Text style={styles.label}>Điểm đi</Text>
  
            <RNPickerSelect
              placeholder={{ label: 'Chọn địa điểm đi' }}
              onValueChange={handleSelectCome}
              items={destinations.filter((lc) => lc.id !== pickerLocalArrive).map((lc) => ({
                value: lc.id,
                label: lc.diaChi,
              }))}
              style={pickerSelectStyles}
            />
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerButton} onPress={showDateNgayDiPicker}>
                <FontAwesome name="calendar" size={24} color="black" />
                <Text style={styles.datePickerText}>Chọn ngày đi</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={isDatePickerNgayDiVisible}
                mode="datetime"
                onConfirm={handleConfirmNgayDi}
                onCancel={hideDateNgayDiPicker}
                date={dateNgayDi}
              />
              <Text style={styles.dateSelected}>Ngày đi dự kiến: {dateNgayDi.toLocaleString()}</Text>
            </View>
            <Text style={styles.label}>Điểm đến</Text>
            <RNPickerSelect
              placeholder={{ label: 'Chọn địa điểm đến' }}
              onValueChange={handleSelectArrive}
              items={destinations.filter((lc) => lc.id !== pickerLocalCome).map((lc) => ({
                value: lc.id,
                label: lc.diaChi,
              }))}
              style={pickerSelectStyles}
            />
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerButton} onPress={showDateNgayDenPicker}>
                <FontAwesome name="calendar" size={24} color="black" />
                <Text style={styles.datePickerText}>Chọn ngày đến</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={isDatePickerNgayDenVisible}
                mode="datetime"
                onConfirm={handleConfirmNgayDen}
                onCancel={hideDateNgayDenPicker}
                date={dateNgayDen}
              />
              <Text style={styles.dateSelected}>Ngày đến dự kiến: {dateNgayDen.toLocaleString()}</Text>
            </View>
  
            <TouchableOpacity style={styles.imagePickerButton} onPress={handlePressChooseImgFromLibrary}>
              <Text style={styles.imagePickerButtonText}>Chọn ảnh từ ứng dụng</Text>
            </TouchableOpacity>
  
            {showImagePicker && (
              picture === null ? (
                <ActivityIndicator />
              ) : (
                <ImageList loadMore={loadMore} loading={loading} page={page} loadPicture={loadPicture} images={picture} onSelect={handleImageSelect} />
              )
            )}
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImageUser}>
              <Text style={styles.imagePickerButtonText}>Chọn ảnh từ điện thoại</Text>
            </TouchableOpacity>
            <ScrollView style={{marginTop:10}}  horizontal={true} showsHorizontalScrollIndicator={false}>
            {visibleImage.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => {
                handleUnselectImage(index)
                }}>
                <View style={{ position: 'relative',padding:5,marginTop:-5}}>
                  
                <Image source={{ uri: image.picture }} style={{ width: 80, height: 50, marginRight: 0 }} />
                <MaterialIcons name="close" size={20} color="red" style={{ position: 'absolute', top: 0,left:1}} />
              </View>
            </TouchableOpacity>
            ))}
          </ScrollView>
            <Button onPress={()=>handleSubmit()} title="Update Post" />
            <View style={styles.block}>
  
            </View>
          </ScrollView>
        
  
  
      </Formik>
      }
    </>
      
   

  );
};

const styles = StyleSheet.create({
  block: {
    height: 100,
    width: '100%',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  transportContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  transportItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  transportItemSelected: {
    borderColor: 'green',
    backgroundColor: '#e0ffe0',
  },
  transportText: {
    marginRight: 4,
  },
  transportIcon: {
    marginLeft: 4,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  datePickerText: {
    marginLeft: 8,
  },
  dateSelected: {
    color: '#888',
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: {
    color: '#fff',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});

export default UpdatePostForm;
