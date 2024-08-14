import React, {  useState, useEffect } from 'react';
import { Drawer,  } from 'react-native-paper';
import {StyleSheet, TouchableOpacity, Text,View,Button, ScrollView,Modal} from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { RadioButton, Chip } from 'react-native-paper';
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-modern-datepicker';
import TAGS from '../../data/tags';
import APIs, { endpoints } from '../../config/APIs';
import moment from 'moment';

const Filter = ({setfil, setShow, X}) => {
    const [checked, setChecked] = useState(false);
    const [selectedChips, setSelectedChips] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [pickerLocalCome, setPickerLocalCome] = useState('')
    const [pickerLocalArrive, setPickerLocalArrive] = useState('')
    const [filterQuery, setFilterQuery] = useState({})
    const [destinations, setDestinations] = useState([])
    const [tags, setTags] = useState([]);
    const [all, setAll] = useState(true)
    const filterClosed = ()=>{
        setShow(false)
        setfil(filterQuery)
    }

    const onClose = () => {
        setShow(false)
        setfil({})
    };
    
    const loadDestination= async () => {
        try {
            let res = await APIs.get(endpoints['local']);
            setDestinations(res.data);
        } catch(ex) {
            console.error(ex);
        }
      }
      const loadTag= async () => {
        try {
            let res = await APIs.get(endpoints['tag']);
            setTags(res.data);
        } catch(ex) {
            console.error(ex);
        }
      }
    useEffect(()=>{
        loadTag()
        loadDestination()
    },[])
    
    const setKeyValue = (key, value) =>{
        let arr1 = filterQuery
        delete arr1[key];
        arr1[key] = value;
        return arr1;
    }
    const handleSelectCome =(value)=>{
        if(value!=undefined) {
            setPickerLocalCome(value);
            // let arr1 = filterQuery
            // let array = arr1.filter(item => Object.keys(item)[0] !== 'id_localcome');
            // array.push({'id_localcome':value});
            let array = setKeyValue('id_localcome',value);
            setFilterQuery(array);
        }
        
        
    }

    const handleSelectArrive =(value)=>{
        if(value!=undefined) {
            setPickerLocalArrive(value);
            // let arr1 = filterQuery
            // let array = arr1.filter(item => Object.keys(item)[0] !== 'id_localarrive');
            // array.push({'id_localarrive':value});
            let array = setKeyValue('id_localarrive',value);
            setFilterQuery(array);
        }
        
    }


    const handlePressChip = (chip) => {
        if(chip!==undefined) {
            setSelectedChips(chip)
            setAll(false)
        }
        else{
            setSelectedChips(''); 
            setAll(true)
        }
        let array = setKeyValue('id_tag',chip);
        setFilterQuery(array);

    };
  
    const handlePress = (value) => {
      setChecked(value);
      let array = setKeyValue('id_check',value);
      setFilterQuery(array);
    };

    const handlePressDate = (value) => {
        setSelectedDate(value);
        const formattedDate = moment(value, 'YYYY/MM/DD').format('YYYY-MM-DD');
        let array = setKeyValue('time',formattedDate);
        setFilterQuery(array);
    };
    



    
  return (
    
    <Modal 
        style = {styles.container}
        animationType="slide"
        visible={X}
        >
        <View style = {{flexDirection: 'row', marginBottom: 10}}>
            <Text style = {{fontSize: 30, paddingTop:5, paddingLeft: 25, marginTop: 10}}>FILTER</Text>
            <TouchableOpacity 
            style = {
                {
                    padding:10,
                    marginLeft: 10,
                    marginTop: 10,
                    borderStyle: 'solid',
                    borderWidth: 2, 
                    borderColor: COLORS.black,
                    borderRadius: 10,
                }
            }
            onPress={
                filterClosed
            }>
                <MaterialIcons name="filter-alt" size={30} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity style={{position:'absolute', right:'10%',top:'40%', backgroundColor:'red', elevation:5, borderRadius:50, padding:5}} onPress={onClose}>
                <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <ScrollView>
        <View >
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Đia điểm đi</Text>
            </View>            
            <RNPickerSelect
                placeholder={{ label: 'Chọn địa điểm đi' }}
                onValueChange={(value) =>{handleSelectCome(value)}}
                items={destinations.filter((lc) => lc.id !== pickerLocalArrive).map((lc) => (
                    {
                        value: lc.id,
                        label: lc.diaChi,
                    }
                ))}
            />
        </View>
        <View >
            <View style={{flexDirection:'row'}}>
                <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Đia điểm đến</Text>
            </View>            
            <RNPickerSelect
                placeholder={{label: 'Chọn địa diểm đến' }}
                onValueChange={(value) =>{handleSelectArrive(value)}}
                items={destinations.filter((lc) => lc.id !== pickerLocalCome).map((lc) => (
                    {
                        value: lc.id,
                        label: lc.diaChi
                    }
                ))}            
                />
        </View>
        <View >
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="filter-alt" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Tags</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
                {
                    tags.map((tag) => (
                        <Chip key={tag.id}
                            mode="flat"
                            selected={selectedChips === tag.id}
                            onPress={() => handlePressChip(tag.id)}
                            style={{ marginRight: 8, marginBottom: 8 }}
                        >
                            {tag.name}
                        </Chip>
                    ))
                }
                 <Chip 
                    mode="flat"
                    selected={all}
                    onPress={() => handlePressChip(undefined)}
                    style={{ marginRight: 8, marginBottom: 8 }}
                >
                    all
                </Chip>
            </View>
        </View>     
        <RadioButton.Group onValueChange={handlePress} value={checked}>
            <View style={{flexDirection:'row'}}>
                <MaterialIcons name="star-border" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Rating</Text>
            </View>

            <View>
                <View style={{flexDirection:'row', width: '100%', marginTop: 20}}>
                    <Text style = {{marginLeft : 30}}>1</Text>
                    <Text  style = {{marginLeft: 60}}>2</Text>
                    <Text  style = {{marginLeft: 60}}>3</Text>
                    <Text  style = {{marginLeft: 60}}>4</Text>
                    <Text  style = {{marginLeft: 60}}>5</Text>
                </View> 
                <View style={{flexDirection:'row', width: '100%', marginRight:'30%'}}>
                    <RadioButton.Item value="1"/>
                    <RadioButton.Item value="2"/>
                    <RadioButton.Item value="3"/>
                    <RadioButton.Item value="4" />
                    <RadioButton.Item value="5"/>
                </View>
            </View> 
            
        </RadioButton.Group>
        <View style={{flexDirection:'column', height:'60%'}}>
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="timer" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Thời gian đi</Text>
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>{selectedDate}</Text>
            </View>
            <View>
                
            <DatePicker
                style ={{width:'100%', height:'60%'}}
                onDateChange={(date) => {handlePressDate(date)}}
            />
            </View>

        </View>
        </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: COLORS.white,
      width: '95%',
      zIndex: 999,
      left: 0,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: COLORS.black,
      height: SIZES.height-80,
      
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width:50, 
        height:50
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    }

  });

export default Filter;