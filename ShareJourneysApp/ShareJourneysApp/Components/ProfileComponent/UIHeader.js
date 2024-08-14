import React, { useEffect, useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../style/Style';
import APIs, { endpoints } from '../../config/APIs';

const ReportModal = ({user,id_user, isVisible, onClose }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const[reports,setReports]= useState([])
  const loadReport= async () => {
    try {
        let res = await APIs.get(endpoints['report']);
        console.log(res.data);
        setReports(res.data);
    } catch(ex) {
        console.error(ex);
    }
  }
  useEffect(()=>{
    loadReport()
    },[])  
  const handlePressReason = (reason) => {
    setSelectedReason(reason);
  };

  const handlePressConfirm = async () => {
    if (selectedReason) { 
      try{
        console.log(`Reported for reason: ${selectedReason.reportContent}`);
        console.log(endpoints['reportUser'](selectedReason.id))
        let res = await APIs.post(endpoints['reportUser'](selectedReason.id), {
          'idUser':id_user// chỗ này mai mốt lấy id user của bên chi tiết bài đăng
        })
        let sendEmail =   APIs.post(endpoints['apiEmail'],{
          'user':user,// chỗ này mai mốt lấy id user của bên chi tiết bài đăng
          'nd':selectedReason.reportContent,
        })
        Alert.alert("Cảm ơn ban đã report !!! Chúng tôi sẽ xem sét trường hợp")
        onClose();
      }catch(ex)
      {
        console.error(ex);
      }
    
    } else {
      console.log('Please select a reason');
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
            <Text style={styles.modalTitle}>Report</Text>
            <FlatList
              data={reports}
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
                  <Text style={styles.reasonText}>{item.reportContent}</Text>
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



export default ReportModal;