import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatListComponent, FlatList, TouchableOpacity, ScrollView, Alert,KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import color from '../../style/color';
import PostScreen from './PostScreen';
import DateTimePicker from 'react-native-modal-datetime-picker';
import APIs, { authApi, endpoints } from '../../config/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
var tam=0;


const SecondPage = ({ setScroll,formData, onChangeText, onPressBack, onPressNext }) => {
  const [startingDestination, setStartingDestination] = useState(null);
  const [endingDestination, setEndingDestination] = useState(null);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [timeDung, setTimeDung] = useState([]);
  const [transports, setTransports] = useState([]);
  const [transport, setTransport] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [tick, setTick] = useState(false);
  const [demAdd, setDemAdd] = useState(0);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [dateNgayDi, setDateNgayDi] = useState(new Date());
  const [dateNgayDen, setDateNgayDen] = useState(new Date());
  const [dateNgayDenTrungGian, setDateNgayDenTrungGian] = useState(new Map().set('date', new Date()));
  const [tags, setTags] = useState([]);
  const [isDatePickerNgayDiVisible, setDatePickerNgayDiVisibility] = useState(false);
  const [isDatePickerNgayDenVisible, setDatePickerNgayDenVisibility] = useState(false);
  const [isDatePickerNgayDenTGVisible, setDatePickerNgayDenTGVisibility] = useState(false);

// Fetch  lay cac tag
  const loadTag= async () => {
    try {
        let res = await APIs.get(endpoints['tag']);
        console.log(res.data);
        setTags(res.data);
    } catch(ex) {
        console.error(ex);
    }
  }
 // Fetch lay transport
 const loadTransport= async () => {
  try {
      let res = await APIs.get(endpoints['transport']);
      console.log(res.data);
      setTransport(res.data);
  } catch(ex) {
      console.error(ex);
  }
}
// fetch lay destination
const loadDestination= async () => {
  try {
      let res = await APIs.get(endpoints['local']);
      console.log(res.data);
      setDestinations(res.data);
  } catch(ex) {
      console.error(ex);
  }
}
 useEffect(()=>{
  loadTag()
  loadTransport()
  loadDestination()
  },[])  

 


// Xử lý datatime


  const showDateNgayDiPicker = () => {
    setDatePickerNgayDiVisibility(true);

  };
  const showDateNgayDenPicker = () => {
    setDatePickerNgayDenVisibility(true);

  };
  const showDateNgayDenTGPicker = () => {
    setDatePickerNgayDenTGVisibility(true);

  };
  const hideDateNgayDiPicker = () => {
    setDatePickerNgayDiVisibility(false);
  };
  const hideDateNgayDenPicker = () => {
    setDatePickerNgayDenVisibility(false);
  };
  const hideDateNgayDenTGPicker = (i) => {
    setDatePickerNgayDenTGVisibility(i,false);
  };

  const handleConfirmNgayDi = (dateNgayDi) => {
    console.log("how to loaf")
    setDateNgayDi(dateNgayDi);
    hideDateNgayDiPicker();
  };
  const handleConfirmNgayDen = (dateNgayDen) => {
    console.log("vao duloc");
    console.log(dateNgayDen)
    setDateNgayDen(dateNgayDen);
    hideDateNgayDenPicker();
  };
  const handleConfirmNgayDenTrungGian = (dateNgayDenTG, i) => {
    console.log("vao tg");
    console.log(i);
   
    console.log(dateNgayDenTG)
    setDateNgayDenTrungGian(new Map(dateNgayDenTrungGian.set(i, dateNgayDenTG)));
    setTimeDung(prevTimeDung => {
      const newTimeDung = [...prevTimeDung];
      newTimeDung[i] = dateNgayDenTG;
      return newTimeDung;
    });
    console.log("ddss", timeDung);
    hideDateNgayDenTGPicker();
  };
  const handleValidDate=(dateValid)=>{
    const date= new Date(dateValid);
    const dateString =  date.toISOString().split('T')[0];
    const timeString =  date.toTimeString().split(' ')[0];
    const dateTimeString = `${dateString} ${timeString}`;
    return dateTimeString;
  }

  // Xu ly tag
  const [tagSelections, setTagSelections] = useState([]);
  const handleTagSelection = (tag) => {
    setTagSelections({ ...tagSelections, [tag.id]: !tagSelections[tag.id] });
    console.log(tagSelections)
  };
  const handleSelectDestination = (id, isStartingPoint) => {
    if (isStartingPoint) {
      console.log("vao di",id)
      if (id !== endingDestination) {
        setStartingDestination(id === startingDestination ? null : id);
        onChangeText('diemDi', id);
        setShowDestinationPicker(true);
      }
    } 
    else {  
      console.log("vao duoc",id)
      console.log(endingDestination)
      if(endingDestination==null)
      {
        console.log("check")
        setEndingDestination(1);
        onChangeText('diemDen', 1);
      }
      if (id !== startingDestination) {
        console.log("diem den",id);
        setEndingDestination(id === endingDestination ? null : id);
        onChangeText('diemDen', id);
        setShowDestinationPicker(false);
      }
    }
  };
  // Xử lý địa điểm trung gian
  const handleAddDestination = () => {
    setDemAdd(demAdd + 1);
    console.log(demAdd);
  setShowDestinationPicker(true);
  };
   
  const handleClose = (index) => {
    setDemAdd(index)
    const newSelectedDestinations = [...selectedDestinations];
    console.log(timeDung);
  if(dateNgayDenTrungGian != undefined)
    {
      timeDung.splice(index,1);
      console.log(timeDung);
    }
    newSelectedDestinations.splice(index, 1);
    setSelectedDestinations(newSelectedDestinations);
  };
  // xu ly transport
  const handleTrSelection = (data) => {
    if (tick === true) {
      setTick(false)
      setTransports([]);
      if (tick==false)
      {
        setTransports({ ...transports, [data.id]: !transports[data.id] });
        console.log(transports);
      }
     
    }
    else{
      setTick(true)
      setTransports({ ...transports, [data.id]: !transports[data.id] });
    }
    console.log('Neeeeeeeeeeeeeeeeeeeeeeeeee',transports);
  };
  
  const renderDestinationItem = (item) => (
    <Picker label={item.diaChi} value={item.id} key={item.id} />
  );

const handleDestinationChange = (value, index) => {
  console.log(index)
  const newSelectedDestination = destinations.find(d => d.id === parseInt(value));
  const newSelectedDestinations = [...selectedDestinations];
  console.log(selectedDestinations)
  console.log(endingDestination)
  if ( newSelectedDestination.id !== endingDestination && newSelectedDestination.id !== startingDestination) {
      // Cập nhật giá trị của iddiaDiem trong diaDiemTrungGian
        console.log(newSelectedDestinations)
        newSelectedDestinations[index] = newSelectedDestination;
        setSelectedDestinations(newSelectedDestinations);
    }else{
      Alert.alert("Dia Diem khong trung nhau");
    }
  }
  const [error, setError] = useState(null);

 
  // Xử lý tag
  const handleSubmit = async() => {
    const newDiaDiemTrungGian = [...formData.diaDiemTrungGian];
    console.log("Du lieu submit diem trung gian",selectedDestinations)
    console.log("dad",timeDung);
    
    // Phần chỉnh sửa check ngày
    if(moment(dateNgayDen).isBefore(moment(dateNgayDi))) {
      alert("Lỗi ngày đi hoặc ngày đến không hợp lệ");
        return ;
    }
    for (let i = 1; i < timeDung.length; i++) {
      console.log("sos sanh ",moment(timeDung[i - 1]).fromNow())
      if (moment(timeDung[i - 1]).isAfter(moment(timeDung[i]))) {
       alert(`Lỗi địa điểm trung gian ${i} và ${i+1}:\n
        Ngày ${moment(timeDung[i - 1]).format("DD/MM/YYYY hh:mm:ss")} \n
        không được nhỏ hơn \n
        Ngày ${moment(timeDung[i]).format("DD/MM/YYYY hh:mm:ss")}\n`);
       return;
      }
    }
    if (timeDung.length>0 && (moment(dateNgayDen).isBefore(moment(timeDung[timeDung.length - 1])) || 
      moment(dateNgayDi).isAfter(moment(timeDung[0])))) {
        alert("Lỗi ngày đi hoặc ngày đến không hợp lệ hoặc ngày trung gian không hợp lệ");
        return ;
      }
    selectedDestinations.forEach((destination, index) => {
      if (index >= newDiaDiemTrungGian.length) {
        newDiaDiemTrungGian.push({ iddiaDiem: destination.id, timedung: timeDung[index] });
      } else {
        newDiaDiemTrungGian[index].iddiaDiem = destination.id;
      }
    });
    for (const id in tagSelections) {
      if(tagSelections[id]==true)
      {
         formData.tag.push(id)
      }
      
    }
    for (const id in transports) {
      if(transports[id]==true)
      {
        console.log('Dat la phuong tine');
        console.log(id)
         formData.phuongtien=id
      }
      
    }
    const dateDi = handleValidDate(dateNgayDi);
    const dateDen = handleValidDate(dateNgayDen);
    formData.diaDiemTrungGian=newDiaDiemTrungGian
    formData.ngayDi= dateDi;
    formData.ngayDen= dateDen;
    
    const newFormData = { ...formData};
    console.log("Du lieu trong submiit:",newFormData);
    const formData2= new FormData();
      Object.keys(newFormData).forEach(key => {
        if (key === 'pictureUserSelect') {
          newFormData[key].forEach((image) => {
            formData2.append('pictureUserSelect', {
              uri: image.uri,
              name: image.name,
              type: image.type,
            });
          });
        } 
        else if (typeof newFormData[key] === 'object') {
          if (key === 'tag' || key === 'pictureDaChon'){
            const arr = newFormData[key].map(i => parseInt(i));
            arr.forEach(i => {
              formData2.append(key, i);
          });
          }
          else{
            formData2.append(key,JSON.stringify(newFormData[key]));

          }
          } 
        
        else {
          formData2.append(key, newFormData[key]);
        }
  })
    console.log('Day la form data',formData2);

    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['UpPost'],formData2,{
        headers: {
          'Content-Type':'multipart/form-data',
        },
      })
      } catch (ex) {
          console.error(ex);
          return;
      }
    return onPressNext(()=>PostScreen(newFormData), Alert.alert("Dang bai thanh cong"));
  };
  return (
      <ScrollView>
         <View>
            <Text>Chọn tag:</Text>
            <ScrollView style={{ marginTop: 2 }} horizontal={true} showsHorizontalScrollIndicator={false}>
            {tags ==[] && <ActivityIndicator/>}
            {tags.map((tag, index) => (
                <TouchableOpacity key={index} onPress={() => handleTagSelection(tag)}>
                  <View style={{ position: 'relative', padding: 1, borderColor: color.black,backgroundColor:color.secondary ,borderRadius: 10, borderWidth: 1, margin: 5 }}>
                    <Text style={styles.text}>{tag.name}</Text>
                    {tagSelections[tag.id] && <MaterialIcons name="check-circle" size={20} color="green" style={{ position: 'absolute', top: 0, right:1,marginTop:-7, marginRight:-11 }} />}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View>
            <Text>Chọn phương tiện di chuyển:</Text>
            <ScrollView style={{ marginTop: 2 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {transport.map((tr, index) => (
                <TouchableOpacity key={index} onPress={() => handleTrSelection(tr)}>
                  <View style={{ position: 'relative', padding: 1, borderColor: color.black,backgroundColor:color.secondary ,borderRadius: 10, borderWidth: 1, margin: 5 }}>
                    <Text style={styles.text}>{tr.loai}</Text>
                    {transports[tr.id] && <MaterialIcons name="check-circle" size={20} color="green" style={{ position: 'absolute', top: 0, right:1,marginTop:-8, marginRight:-11 }} />}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text>Chi phí phát sinh</Text>
              <TextInput
                      style={styles.TextInput}
                      placeholder="Nhập chi phí hành trình này nếu có"
                      keyboardType="numeric"
                      value={formData.chiPhi}
                      onChangeText={text => onChangeText('chiPhi', text)}
                    />
          </View>
          <View style={{
            borderWidth: 5,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 1,
            marginBottom:8,
            marginTop:3
          }}>
            <Text style={{color:"black"}}>Chọn hành trình bắt đầu:</Text>
              <Picker
                selectedValue={startingDestination}
                onValueChange={(id) => {
                  handleSelectDestination(id, true);
                  setShowDestinationPicker(true);
                }}
              >
                {destinations.map(renderDestinationItem)}
              </Picker>
              <View>
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={{...styles.iconButton,flexDirection:"row"}} onPress={()=>showDateNgayDiPicker()}>
                <FontAwesome name="calendar" size={24} color="black" />
                <Text>Chọn ngày đi:</Text>
                 </TouchableOpacity>
                </View>
                <DateTimePicker
                  isVisible={isDatePickerNgayDiVisible}
                  mode="datetime"
                  onConfirm={(dateNgayDi)=>handleConfirmNgayDi(dateNgayDi)}
                  onCancel={hideDateNgayDiPicker}
                  date={dateNgayDi}
                />
                <Text style={{color:"red"}}>Ngày đi dự kiến: {dateNgayDi.toLocaleString()}</Text>
              </View>
          </View>
          <View style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 1,
            marginBottom: 10,
          }}>
             
            <Text>Chọn hành trình kết thúc:</Text>
          <Picker
            selectedValue={endingDestination}
            onValueChange={(id) => {
              handleSelectDestination(id, false);
              setShowDestinationPicker(true);
            }}
          >
            {destinations.map(renderDestinationItem)}
          </Picker>
          <View>
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={{...styles.iconButton,flexDirection:"row"}} onPress={()=>showDateNgayDenPicker()}>
                <FontAwesome name="calendar" size={24} color="black" />
                <Text>Chọn ngày đến:</Text>
                 </TouchableOpacity>
                </View>
                <DateTimePicker
                  isVisible={isDatePickerNgayDenVisible}
                  mode="datetime"
                  onConfirm={(dateNgayDen)=>handleConfirmNgayDen(dateNgayDen)}
                  onCancel={hideDateNgayDenPicker}
                  date={dateNgayDen}
                />
                <Text style={{color:"red"}}>Ngày đến dự kiến: {dateNgayDen.toLocaleString()}</Text>
              </View>
          </View>
        <View style={styles.container} >
          <View style={styles.intermediateDestinationsContainer}>
            <Text>Địa điểm trung gian</Text>
            <TouchableOpacity onPress={handleAddDestination}>
              <MaterialIcons name="add-circle" size={24} color="green" style={{marginBottom:-1,marginTop:-2}} />
            </TouchableOpacity>
          </View>
          <View>
          {showDestinationPicker &&
            Array(demAdd).fill(2).map((_, i) => (
                <View key={i} style={styles.intermediateDestinationsPickerContainer}>
                <View style={{ borderWidth: 1, margin: 5, borderRadius: 10 }}>
                  <View style={{ flexDirection: 'row', padding: 1 }}>
                    <Text style={styles.headerText}>Chọn hành trình trung gian</Text>
                    <TouchableOpacity onPress={() => handleClose(i)} style={styles.closeButton}>
                      <MaterialIcons name="close" size={24} color="red" style={{ marginBottom: -1, marginTop: -2 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedDestinations[i] ? selectedDestinations[i].id : null}
                      onValueChange={(value, index) => {
                        handleDestinationChange(value, i);
                        setShowDestinationPicker(true);
                      }}
                    >
                      {destinations.map((destination) => (
                        <Picker.Item
                          key={destination.id}
                          label={destination.diaChi}
                          value={destination.id}
                        />
                      ))}
                    </Picker>
                    <View>
                        <View style={{flexDirection:"row"}}>
                        <TouchableOpacity style={{...styles.iconButton, width: 210,flexDirection:"row"}}  onPress={()=>{tam=i,showDateNgayDenTGPicker()}}>
                        <FontAwesome name="calendar" size={24} color="black" />
                        <Text>Chọn thời gian dự kiến đến</Text>
                        </TouchableOpacity>
                        </View>
                        <DateTimePicker 
                          isVisible={isDatePickerNgayDenTGVisible}
                            mode="datetime"
                            onConfirm={(date)=>{
                              handleConfirmNgayDenTrungGian(date,tam)}}                           
                               onCancel={hideDateNgayDenPicker}
                            date={dateNgayDenTrungGian.get(tam)}
                          />
                    
                                  <Text style={{ color: 'red' }} key={i}>
                                  
                              {console.log("ngay den",dateNgayDenTrungGian.get(demAdd)?.toLocaleString(),i)} Ngày đến dự kiến: {dateNgayDenTrungGian.get(i)?.toLocaleString()}
                              </Text>

                        
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
          
          {demAdd >=1 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', height:40, width:"100%",marginBottom:'30%' }}>
            <Button title="Back" onPress={onPressBack} />
            <Button title="Finish"  onPress={() => handleSubmit()} />
          </View>}
          {demAdd <1 && <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button title="Back" onPress={onPressBack} />
            <Button title="Finish"  onPress={() => handleSubmit()} />
          </View>}
          
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  destinationItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  destinationItemSelected: {
    backgroundColor: '#ddd',
  },
  destinationItemText: {
    fontSize: 16,
  },
  container:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 1,
    marginBottom: 20,
  },
  intermediateDestinationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    
  },
  addIcon: {
    fontSize: 24,
    color: 'blue',
  },
  intermediateDestinationsPickerContainer: {
    marginTop: 1,
  },
  pickerContainer: {
  },
  TextInput:{
    width:"100%",
    padding:9,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  iconButton: {
    backgroundColor:"white",
    borderRadius: 35,
    width: 125,
    height: 40,
    padding:6,
    shadowColor:"white",
    shadowOpacity:10
    
  },
  datePicker: {
    width: '90%',
    height: '90%',
  },

});

export default SecondPage;