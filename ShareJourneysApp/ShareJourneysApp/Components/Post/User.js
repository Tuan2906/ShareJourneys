import React, { memo } from 'react';
import { View, Image, Text } from 'react-native';

const User = ({ user }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <Image source={{ uri: user.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
        <Text style={{ color: '#666' }}>@{user.username}</Text>
      </View>
    </View>
  );
};

export default memo(User);