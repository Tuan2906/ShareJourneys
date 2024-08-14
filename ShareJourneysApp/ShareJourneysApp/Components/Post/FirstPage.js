import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { imagesDataURL } from '../../data/data';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../Button';
import color from '../../style/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import APIs, { endpoints } from '../../config/APIs';
export const ImageList = ({ page,  loadPicture, loading, images, onSelect,loadMore }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageSelections, setImageSelections] = useState({});
  const handleImageSelection = (image) => {
    const updatedSelections = { ...imageSelections };
    console.log("ham moi")
    updatedSelections[image.id] = !updatedSelections[image.id];

    if (updatedSelections[image.id]) {
      setImageSelections(updatedSelections);

    } else {
      console.log("Bo loi")
      
    }

    onSelect(image);
  };

  return (
    <>
      <Text>Choose image from library</Text>
      <ScrollView style={{ marginTop: 2 }} horizontal={true} showsHorizontalScrollIndicator={false} onScroll={loadMore} >
      <RefreshControl onRefresh={() => loadPicture()} />
      {loading && <ActivityIndicator />}

        {images.map((image, index) => {
          return (
            
            <TouchableOpacity key={index} onPress={() => handleImageSelection(image)}>
              
              <View style={{ position: 'relative', padding: 1, borderColor: color.primary, borderRadius: 2, borderWidth: 3, margin: 1 }}>                
                <Image source={{ uri: image.picture }} style={{ width: 100, height: 100 }} />
                {imageSelections[image.id] && <MaterialIcons name="check-circle" size={24} color="green" style={{ position: 'absolute', top: 0, right: 0 }} />}
              </View>
            </TouchableOpacity>
          );
        })}
        {loading && page > 1 && <ActivityIndicator />}
      </ScrollView>
    </>
  );
};
const FirstPage = ({ formData, onChangeText, onPressNext }) => {
  const [image, setImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [pictureDaChon, setPictureDaChon] = useState([]);
  const [selected, setSelected] = useState([]);
  const [picture,setPicture]=useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadPicture= async () => {
    if (page > 0) {
      setLoading(true);
    try {
        let res = await APIs.get(`${endpoints['picture']}?page=${page}`);
        if (res.data.next === null){
          setPage(0);
          console.log('1')
        }
        if (page === 1){
          setPicture(res.data.results);
          console.log('2')
        }
        else
        setPicture(current => {
            return [...current, ...res.data.results];
        });



    } catch(ex) {
        console.error(ex);
    }
    finally{
      setLoading(false);

    }
  }
}
useEffect(()=>{
  loadPicture()
},[page])
const isCloseToEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToEnd = 20; // Khoảng cách để xác định là cuối màn hình
  return layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToEnd;
};
const loadMore = ({nativeEvent}) => {
  if (!loading && page > 0 && isCloseToEnd(nativeEvent)) {
      console.log('3')
          setPage(page + 1);
  }
}

  const handleImageUser = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    } else {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            multiple: true,
            selectionLimit: 5, // Set the maximum number of images that can be selected
        });

        if (result && !result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            const selectedPictures =  result.assets.map(asset => {
              return {
                "uri": asset.uri,
                "name": asset.fileName,
                "type": 'image/jpeg'
              }
            });
            setImage(selectedImages[0]);
            console.log(selectedPictures)
           //formData.pictureDaChon.push(...selectedImages); // Update the formData object with multiple selected images
            formData.pictureUserSelect.push(...selectedPictures)
            formData.anhTam.push({
              id: "device",
              picture:selectedImages[0],
            })
            console.log('', formData.anhTam)
            setPictureDaChon([...formData.anhTam])
          }
    }
};
  const handleImageSelect = (image) => {
    setImage(image);
    console.log("vao duoc");
    console.log(pictureDaChon);
    if(formData.pictureDaChon.length ===0)
    {
      console.log("oke len")
      formData.pictureDaChon.push(image.id)
      formData.anhTam.push(
        {
          id: image.id,
          picture:image.picture
        }
      )
      
      
    }
    else
    {
      console.log("khong oke len")
      formData.pictureDaChon.map(picture=>{
        if (!formData.pictureDaChon.includes(image.id)) {
          formData.pictureDaChon.push(image.id); // Update the formData object directly
          formData.anhTam.push( {
            id: image.id,
            picture:image.picture
          })
  
        }
      })
    }
    const add= [...formData.anhTam]
    console.log('adddddd',add)
    setPictureDaChon(add)
    onChangeText(formData); // Pass the updated formData object to the onChangeText function
  };
  const handlePressChooseImgFromLibary= () => {
    setShowImagePicker(!showImagePicker);
  };
  const handleUnselectImage = (index) => {
  //console.log(selected);
   console.log(index)
   console.log('pictureDaChon',pictureDaChon)
   
    const updatedImages = [...pictureDaChon];
   // const updateHT= [...selected]
    console.log("truoc khi update",updatedImages);
    updatedImages.splice(index, 1);
    //updateHT.splice(index,1);
    console.log("sau khi update",updatedImages);
    setPictureDaChon(updatedImages);
    formData.anhTam = updatedImages;
    //formData.pictureDaChon=updateHT;
   // console.log(formData.pictureDaChon)
    console.log("anh tan", formData.anhTam);
    if(formData.anhTam.length==0)
    {
      formData.pictureDaChon=[];
      formData.pictureUserSelect=[]
      return;
    }
    // pic da chon: tu he thong
    console.log('formData.pictureUserSelect11111111',formData.pictureUserSelect)
    console.log('formData.pictureDaChon111111111111',formData.pictureDaChon);
    formData.pictureDaChon = formData.anhTam.filter(image => image.id != "device").map(image => image.id);
    const selectedPictures = formData.anhTam
    .filter(image => image.id == "device")

    const filteredPictures = formData.pictureUserSelect.filter(picture => 
      selectedPictures.some(selected => selected.picture === picture.uri)
  );
    // .map(image => {
    //   formData.pictureUserSelect.some(pic => pic.uri == image.picture);
    // })
    formData.pictureUserSelect= filteredPictures
    console.log('selectedPictures',filteredPictures)


    // console.log('formData.pictureUserSelect',formData.pictureUserSelect)
    // console.log('formData.pictureDaChon',formData.pictureDaChon);

      //  for (const anh of formData.anhTam) {
      //   for (const image of formData.pictureUserSelect) {
      //       console.log("anh tu anh tam:",anh);
      //       if (anh.picture == image.uri) {
      //           console.log("vo duoc xoa anh thu 1")
      //           formData.pictureUserSelect=[];
      //           formData.pictureUserSelect.push(image);
      //       }
      //   }

    
   

  };
 

  return (
    <View style={styles.container}>
      <Text>Post title:</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={text => onChangeText('title', text)}
      />
      <Text >Post content:</Text>
      <ScrollView style={styles.container} scrollEnabled={true}>
          <TextInput style={[styles.input, styles.inputContent]} multiline
          value={formData.content} 
          onChangeText={text => onChangeText('content', text)}  numberOfLines={5}
          maxLength={500} placeholder="Enter your content here" />
      </ScrollView>
      <Text style={color.black}>Post description:</Text>
      <ScrollView style={styles.container} scrollEnabled={true}>
        <TextInput  multiline
          style={[styles.input, styles.inputContent]} 
          value={formData.description} numberOfLines={2}
          onChangeText={text => onChangeText('description', text)}
        />
      </ScrollView>
      <TouchableOpacity style={styles.imagePickerButton} onPress={() => handlePressChooseImgFromLibary()}>
        <Text style={styles.imagePickerButtonText}>Chọn ảnh từ ứng dụng</Text>
      </TouchableOpacity>
      
              {showImagePicker &&(
          picture === null? (
            <ActivityIndicator />
          ) : (
            <ImageList  loadMore={loadMore} loading = {loading} page={page}  loadPicture={  loadPicture} images={picture} onSelect={handleImageSelect} />
          )
        )}
      <TouchableOpacity style={{ backgroundColor: "blue", padding: 10, alignSelf: 'center', borderRadius: 5}} onPress={()=>handleImageUser()}>
      <Text style={{color: "white"}}>Chọn ảnh từ điện thoại</Text>
      </TouchableOpacity> 
      <ScrollView style={{marginTop:10}}  horizontal={true} showsHorizontalScrollIndicator={false}>
        {formData.anhTam.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => handleUnselectImage(index)}>
            <View style={{ position: 'relative',padding:5,marginTop:-5}}>
            
            <Image source={{ uri: image.picture }} style={{ width: 80, height: 50, marginRight: 0 }} />
            <MaterialIcons name="close" size={20} color="red" style={{ position: 'absolute', top: 0,left:1}} />
          </View>
        </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title="Next" onPress={onPressNext} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    padding: 1,
    marginTop:5
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius:40,
    paddingHorizontal: 10,
  },
  inputContent:
  {
    width:"100%",
    height:"100%",
    borderRadius:10

  },
  imagePickerButton: {
    backgroundColor: color.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  imagePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FirstPage;