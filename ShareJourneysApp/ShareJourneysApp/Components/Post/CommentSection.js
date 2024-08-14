import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomMessage from './CustomMessage ';
const CommentSection = ({ users, onPressUser }) => {
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: 1,
      }}
      renderMessage={(props) => <CustomMessage {...props} onPressUser={onPressUser} />}
      alwaysShowSend
      messagesContainerStyle={{ backgroundColor: '#F5F5F5' }}
    />
  );
};

export default CommentSection;