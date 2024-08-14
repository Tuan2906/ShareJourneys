import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Surface, Avatar,  } from 'react-native-paper';

const PostOwner = ({navigation,Owner}) => {
    const ViewProfile = (id)=>{
      return navigation.navigate('ProfileUser',{id})
    }
    return(
        <Surface style={[styles.surface, styles.row]} elevation={5}>
              <View style = {{width: '20%'}}>
                    <Avatar.Image size={60} source={{uri: Owner.avatar}} />
              </View>
              <View style = {{width: '50%'}}>
                    <Text>Được tạo bởi: </Text>
                    <Text style = {{fontSize: 20, fontWeight: 'bold'}}>{Owner.username }</Text>
                    <Text style = {{fontSize: 15, fontWeight: 'bold'}}> Đánh giá: {Owner.avgRate}/5</Text>
              </View>
              <View style = {{width: '30%'}}>
                <TouchableOpacity style = {styles.row} onPress={()=>ViewProfile(Owner.id)}>
                    <Text style = {{textDecorationLine: 'underline'}}>Xem thông tin</Text>
                </TouchableOpacity>
              </View>
        </Surface>
    )

}
const styles = StyleSheet.create({
    surface: {
      padding: 8,
      marginTop:20,
      marginBottom:20,
      marginLeft:'auto',
      marginRight:'auto',
      height: 80,
      borderRadius:20,
      width: '90%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
        flexDirection: 'row'
    }
  });
export default memo(PostOwner);