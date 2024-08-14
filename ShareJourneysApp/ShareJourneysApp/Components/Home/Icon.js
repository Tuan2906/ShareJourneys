import React, {  useState, useEffect } from 'react';
import { Drawer } from 'react-native-paper';
import {StyleSheet, TouchableOpacity, Text,View,Button, ScrollView} from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { RadioButton, Chip } from 'react-native-paper';
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-modern-datepicker';
import LOCAL from '../../data/local';
import TAGS from '../../data/tags';

const ICONNE = ()=>{
    const [pickerLocalCome, setPickerLocalCome] = useState('')
    const [pickerLocalArrive, setPickerLocalArrive] = useState('')
    const [filterQuery, setFilterQuery] = useState([])

    const handleSelectCome =(value)=>{
        if(value!=undefined) {
            setPickerLocalCome(value);
            let array = [...filterQuery,{'id_localcome':value}];
            console.log('arr1',array)
        }
        
        // setFilterQuery(array);
    }

    const handleSelectArrive =(value)=>{
        if (value!=undefined) {
            setPickerLocalArrive(value);
            let array = [...filterQuery,{'id_localarrive':value}];
            console.log('arr2',array)
        // setFilterQuery(array);
        }
        
    }

    return (
        <View>
            <View >
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Đia điểm đi</Text>
            </View>            
            <RNPickerSelect
                placeholder={{ label: 'Chọn địa điểm đi' }}
                onValueChange={(value) =>{handleSelectCome(value)}}
                items={LOCAL.filter((lc) => lc.id !== pickerLocalArrive).map((lc) => (
                    {value: lc.id,label: lc.diaChi}
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
                items={LOCAL.filter((lc) => lc.id !== pickerLocalCome).map((lc) => (
                    {value: lc.id,label: lc.diaChi}
                ))}
            />
        </View>
        </View>
    )
}
export default ICONNE;