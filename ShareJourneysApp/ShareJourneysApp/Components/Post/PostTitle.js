import React, { memo } from 'react';
import { View,  Text, StyleSheet} from 'react-native';
import { Title } from 'react-native-paper';
import { SIZES , COLORS} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import { Surface } from 'react-native-paper';
import moment from 'moment';
import "moment/locale/vi"

const PostTitle = ({post})=>{
    // const calculateMinuteDiff = (date) => {
    //     const currentDate = moment(new Date);
    //     const pastDate = new Date(date)
    //     const diffMinutes = currentDate.diff(pastDate, 'minutes'); // Tính toán số phút chênh lệch
    //     if (diffMinutes < 60) {
    //         return `${diffMinutes} phút trước`;
    //     }
    //     if (diffMinutes < 1440) { // 1440 phút = 24 giờ
    //         const diffHours = currentDate.diff(pastDate, 'hours');
    //         return `${diffHours} giờ trước`;
    //     } 
    //     if (diffMinutes < 43200) { // 43200 phút = 30 ngày
    //         const diffDays = currentDate.diff(pastDate, 'days');
    //         return `${diffDays} ngày trước`;
    //     } 
    //     if (diffMinutes < 525600) { // 525600 phút = 365 ngày
    //         const diffMonths = currentDate.diff(pastDate, 'months');
    //         return `${diffMonths} tháng trước`;
    //     } 
    //     const diffYears = currentDate.diff(pastDate, 'years');
    //     return `${diffYears} năm trước`;
    // };
    return (
        <View >
        <Title style= {[styles.title, styles.pad,styles.Textcenter]}>
            {post.title}
        </Title>
        <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row', marginLeft: 10,  width: '45%'}}>
                <Text style= {{...styles.text, marginTop:5}}>
                    {post.journey.id_tuyenDuong==undefined ? <ActivityIndicator/>: post.journey.id_tuyenDuong.id_noiDen.diaChi}
                </Text>   
                <MaterialIcons name="share-location" size={25} color={COLORS.black} style={{marginTop:10}} />

            </View >
            <View style={{flexDirection:'row', marginRight: 10, width: '55%'}}>
                <MaterialIcons name="lock-clock" size={25} color={COLORS.black} style={{marginTop:10}} />
                <Text style ={{...styles.text, marginTop:5, marginRight:-10}}>{moment(post.created_date).fromNow()}</Text>
            </View>
        </View>
       
        <Text style= {[styles.text,styles.pad]}>
            <Text style = {{...styles.text, fontWeight:'bold' ,fontSize:25}}>
                <MaterialIcons name="details" size={20} color={COLORS.black} style ={{marginLeft:15}} />
                Giới thiệu về trip:
            </Text>
                {post.content}
        </Text>
        <View style = {{flexDirection:'row'}}>

        <Surface style = {{...styles.tag, marginLeft:10,flexDirection:'row'}} elevation={5}>
            <MaterialIcons name="star-outline" size={20} color={COLORS.black} style ={{margin:10}} />
            <Text style = {{fontSize: SIZES.h2}}>
                {
                    ((parseFloat(post.avgRate) * 100 )/5).toFixed(0)
                }
                %
            </Text>
        </Surface>
        <Surface style = {{...styles.tag, marginLeft:10,flexDirection:'row', }} elevation={5}>
            <MaterialIcons name="emoji-transportation" size={20} color={COLORS.black} style ={{margin:10}} />
            <Text style = {{fontSize: SIZES.h2}}>
                {
                    post.journey.id_PhuongTien.loai
                }
            </Text>
        </Surface>
        </View>
       
        
    </View>
    )
}


const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'black',
      
    },
    text:{
      fontSize: 25,
    },
    pad:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    Textcenter:{
        alignSelf: 'center',
    },
    tag:{
        width: 'auto',
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffbe76',
        paddingRight:10
    }
    
  });
export default memo(PostTitle);