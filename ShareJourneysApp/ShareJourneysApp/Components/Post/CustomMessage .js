import React from 'react';
import { View, Image,TouchableOpacity, Text } from 'react-native';

const CustomMessage = ({ currentMessage, onPressUser }) => {
  const { user, text, createdAt } = currentMessage;

  return (
    <TouchableOpacity onPress={() => onPressUser(user)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: user.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
          <Text style={{ color: '#666' }}>{text}</Text>
        </View>
      </View>
      <Text style={{ color: '#999', marginTop: 5 }}>{createdAt}</Text>
    </TouchableOpacity>
  );
};

export default CustomMessage;