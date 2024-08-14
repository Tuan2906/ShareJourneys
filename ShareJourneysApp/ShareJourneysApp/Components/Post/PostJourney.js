import React, {memo, useEffect, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView,Animated ,ActivityIndicator } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { SIZES , COLORS} from '../../constants';
import moment from 'moment';
import MapViewComponent from './map';
import {collection, getDocs,doc, getDoc} from 'firebase/firestore';
import { db } from '../../firebase/firebaseconf';
import { Button } from 'react-native-paper';



const PostJourney = ({Journey,sl_stoplocal})=>{
    console.log('stop',sl_stoplocal);
    console.log('journey',Journey);
    const [isPressed, setIsPressed] = useState(Array(sl_stoplocal+2).fill(false));
    const [isVisible, setIsVisible] = useState(Array(sl_stoplocal+2).fill(false));
    const [isRender, setRender] = useState(false);
    const [Locals, setLocals] = useState([])
    const [route, setRoute] = useState(null);
    const [index, setIndex] = useState(0)
    const handleRoutePress = async (length) => {
        const routeCoordinates = [];
        for (let i = 0; i <=length; i++) {
            routeCoordinates.push({
                latitude: Locals[i].latitude,
                longitude: Locals[i].longitude,
            }
        )
    }
        setRoute(routeCoordinates);
    };
    const getDiaDiemFireBase = async(docu) =>{
        const docRef = doc(db, 'Local', docu);
        const docs = await getDoc(docRef)
        console.log('Query snapshot', docs.data())
        return  docs.data()
    }
    const getDiaDiemSFireBase =async (length,data) =>{
        console.log('length',length)
        const arrLocal = []
        let toado
        for (let i = 0; i < length; i++) {
            if (i==0){
                console.log('1');
                toado = await getDiaDiemFireBase(data.id_tuyenDuong.id_noiDi.diaChi);
                console.log(i, toado);
                if (toado) {
                    arrLocal.push({
                        ...toado,
                        diaChi: data.id_tuyenDuong.id_noiDi.diaChi
                    });
                }
                            }
            else if (i==length-1) {
                console.log('2');
            toado = await getDiaDiemFireBase(data.id_tuyenDuong.id_noiDen.diaChi);
            console.log(i, toado);
            if (toado) {
                arrLocal.push({
                    ...toado,
                    diaChi: data.id_tuyenDuong.id_noiDen.diaChi
                });
            }

            }
            else {
                console.log('3');
                toado = await getDiaDiemFireBase(data.stoplocal[i-1].id_DiaDiem.diaChi)
                if (toado) {
                    arrLocal.push({
                        ...toado,
                        diaChi: data.stoplocal[i - 1].id_DiaDiem.diaChi
                    });
                }

            }
        }
        console.log('Query',arrLocal)
                    setLocals(arrLocal)

    } 
      useEffect(() => {
        
        getDiaDiemSFireBase(sl_stoplocal+2,Journey)
         }, []);

  const handlePress = (index) => {
    const boole = isPressed;
    const N_hidden = isVisible;
    console.log(index)
   
        if(boole[index] == true){
            for (let i=index+1; i<sl_stoplocal+2;i++){
                boole[i] = false;
                N_hidden[i] = false;
            }
        }
        else{
            for (let i=0; i<=index;i++){
                if(boole[i] == false){
                    boole[i] =!boole[i];
                    N_hidden[i] =!N_hidden[i];
                }
                
            }
           
        }
    setIndex(index);
    handleRoutePress(index)
    setIsVisible(N_hidden);
    setIsPressed(boole);
    setRender(!isRender);
  };
    const renderElements = (length,data) => {
        const elements = [];
        for (let i = 0; i < length; i++) {
            if(i==0){
                elements.push
                (
                    <View style={{alignItems:'flex-end',}}key={i} >
                        <MaterialIcons  name="share-location" size={35}  color={isPressed[i] ? '#ffbe76' : 'black'} />
                        <Text style={{}}>{isPressed[i] ?data.id_tuyenDuong.id_noiDi.diaChi:"Xuất phát"}</Text>
                    </View>
                        
                )
            }
            else if (i==length-1){
                elements.push
                (
                    <View key={i} style= {{flexDirection: 'row', }}>
                        <View style = {{...styles.line,marginBottom: 20,  width:70}}/>
                        <View >
                            <MaterialIcons name="share-location" size={35}  color={isPressed[i] ? '#ffbe76' : 'black'}/>
                            <Text>{isPressed[i] ?data.id_tuyenDuong.id_noiDen.diaChi:"kết thúc"}</Text>

                        </View>
                    </View>
                               
                )
            }
            else{
                elements.push
                (
                    
                    <View key={i} style= {{flexDirection: 'column', alignItems:'center'}}> 
                        <View style= {{flexDirection: 'row'}}>
                            <View style = {{...styles.line, width:70}}/>
                        <View  style= {{flexDirection: 'row'}}>
                        <View style = {{...styles.line, width: 'auto'}}/>

                            <MaterialIcons name="share-location" size={35} color={isPressed[i] ? '#ffbe76' : 'black'}/>
                        </View>
                        </View>
                        { isVisible[i] && <Text style = {{ position: 'absolute', bottom: 0, left: 50, color:COLORS.black}}> {data.stoplocal[i-1].id_DiaDiem.diaChi}</Text>}
                    </View>
            
                )
            }
            
            

        }
        return elements;
    }
    const renderButton = (length,data)=>{
        const elements = [];
        var name = ''
        var ngay = ''
        for (let i = 0; i < length; i++) {
            if(i==0){
                elements.push
                (
                    <TouchableOpacity style = {[styles.button, styles.surface]} key={i} onPress={() => handlePress(i)}>
                    <MaterialIcons name="lock-clock" size={30} color={COLORS.black} style={{marginTop:5}} />
                    <View style = {{flexDirection: 'column', justifyContent:'space-around'}}>
                        <Text style ={{fontSize: 15, paddingTop:20, paddingLeft:10, paddingRight:10, paddingBottom:10, fontWeight:'bold'}}>
                            {
                                moment(data.ngayDi).format("DD/MM/YYYY")
                            
                            }

                        </Text>
                        <Text style ={{fontSize: 15, padding:10, fontWeight:'bold'}}>
                            {moment(data.ngayDi).format("HH:mm:ss")}

                        </Text>
                    </View>
                    
                    
                
                </TouchableOpacity>
                        
                )
               
            }
            else if (i==length-1){
                elements.push
                (
                    <TouchableOpacity style = {[styles.button, styles.surface]} key={i} onPress={() => handlePress(i)}>
                    <MaterialIcons name="lock-clock" size={30} color={COLORS.black} style={{marginTop:5}} />
                    <View style = {{flexDirection: 'column', justifyContent:'space-around'}}>
                        <Text style ={{fontSize: 15, paddingTop:20, paddingLeft:10, paddingRight:10, paddingBottom:10, fontWeight:'bold'}}>
                            {moment(data.ngayDen).format("DD/MM/YYYY")}

                        </Text>
                        <Text style ={{fontSize: 15, padding:10, fontWeight:'bold'}}>
                            {moment(data.ngayDen).format("HH:mm:ss")}

                        </Text>
                    </View>
                    
                    
                
                </TouchableOpacity>
                               
                )
            }
            else{
                elements.push
                (
                    
                    <TouchableOpacity style = {[styles.button, styles.surface]} key={i} onPress={() => handlePress(i)}>
                        <MaterialIcons name="lock-clock" size={30} color={COLORS.black} />
                        <View style = {{flexDirection: 'column', justifyContent:'space-around'}}>
                            <Text style ={{fontSize: 15, paddingTop:20, paddingLeft:10, paddingRight:10, paddingBottom:10, fontWeight:'bold'}}>
                                {moment(data.stoplocal[i-1].ThoiGianDuKien).format("DD/MM/YYYY")}

                            </Text>
                            <Text style ={{fontSize: 15, padding:10, fontWeight:'bold'}}>
                                {moment(data.stoplocal[i-1].ThoiGianDuKien).format("HH:mm:ss")}

                            </Text>
                        </View>
                        
                        
                    
                    </TouchableOpacity>
            
                )
            }           
        }
        return elements;
    }
    return(
        <View>
            <View style={{flexDirection:'row', marginLeft: 10, marginTop: 20}}>
                <MaterialIcons name="map" size={25} color={COLORS.black} style={{marginTop:10}} />
                <Text style ={{fontSize: 25, marginTop:5, fontWeight:'bold'}}>Thông tin chuyến đi</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style ={{width: '100%',flexDirection:'row', }}>
              <View style ={{width: '100%',flexDirection:'row',justifyContent:'center',margin:10 }}>
                {
                   renderElements(sl_stoplocal+2,Journey)
                }
              </View>
            </ScrollView>
                {console.log(Locals)}
                {console.log(Locals.length == 0)}

               { Locals.length == 0 ? <ActivityIndicator/> :
                <View style = {{marginTop: 30}}>
                    <MapViewComponent local={Locals} route={route} index={index}/>
                </View>
            }
            <View>
                <Text style ={{fontSize: 25, marginLeft:10, marginTop:5, fontWeight:'bold'}}>Lịch trình</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}  style ={{width: '100%',flexDirection:'row',marginTop: 30 }}>
                    {
                       renderButton(sl_stoplocal+2,Journey)

                    }
                </ScrollView>
            </View>


        </View>
    )
}


const styles = StyleSheet.create({
    button:{
        width: 'auto', // Kích thước đường kính
        height: 60, // Kích thước đường kính
        borderRadius: 20, // Bán kính bằng một nửa kích thước
        alignItems: 'center', // Căn chỉnh nội dung theo trục dọc
        justifyContent: 'space-between', // 
        backgroundColor: '#ffbe76', 
        marginLeft: 20,
        flexDirection: 'row',
        padding:5
    },
    line:{
        width: 40,
        height: 1,
        backgroundColor: 'black',
        alignSelf:'center',
        // 
    },
    surface: {
        borderRadius: 10,
        elevation: 5, // Tăng độ nâng của bề mặt
        borderStyle:'solid',
        borderWidth: 1,
      },

  });

export default memo(PostJourney);