import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons';
import styles from '../../style/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../config/APIs';

const RatingModal = ({ isVisible, onClose,posts,idPost}) => {
  const reasons = [
    1,2,3,4,5
  ];

  const [selectedReason, setSelectedReason] = useState(null);

  const handlePressReason = (reason) => {
   
    setSelectedReason(reason);
  };

  const handlePressConfirm = async() => {
    if (selectedReason) { 
      console.log(`Kết quả rating: ${selectedReason}`);
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).post(endpoints['rates'](idPost), {
            'rate': selectedReason
        })
            // for (const post of posts)
            //   {
            //     console.log(post.id);
            //     console.log(idPost);
            //     if(post.id === idPost)
            //     {
            //       post.rating.push({
            //         "rate":selectedReason
            //       })
            //       break;
            //     }
            //   }
          Alert.alert("Đánh giá thành công");

        } catch (ex) {
            console.error(ex);
            Alert.alert("Bài post không tìm thấy để đánh giá");
            onClose();
            return;
        }
      
      
     
      
      console.log(posts);
      //Cho nay xu ly lu du lieu json
      onClose();
   } else {
      console.log('Vui lòng chọn rating');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableHighlight style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={{...styles.closeButton,marginTop:-20,marginRight:-14}} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
            <Text style={styles.modalTitle}>Chọn mức độ đánh giá</Text>
            <FlatList
              data={reasons}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.reasonContainer,
                    selectedReason === item && styles.selectedReason,
                  ]}
                  onPress={() => handlePressReason(item)}
                >
                  <View style={styles.reasonCheckmarkContainer}>
                    {selectedReason === item && (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="green"
                      />
                    )}
                  </View>
                  <Text style={styles.reasonText}>{item}
                  
                  
                          
                  <FontAwesome name="star" size={15} color={"#FFD700"} />

                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handlePressConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    </Modal>
  );
};



export default RatingModal;