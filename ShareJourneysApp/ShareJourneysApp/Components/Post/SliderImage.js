import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';



const Dot = () => (
  <View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }} />
);

const ActiveDot = () => (
  <View style={{ backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }} />
);

const SliderImage = ({images}) => {
  console.log('slider',images);
  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        loop
        dot={<Dot />}
        activeDot={<ActiveDot />}
        dotStyle={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }}
        activeDotStyle={{ backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }}
      >
        {images.map((image, index) => (
          <View key={index} style={{ flex: 1 }}>
            <Image source={{ uri: image.picture }} style={{ width: '100%', height: '100%' }} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%', // Đặt chiều cao của container của Swiper
  },
});

export default memo(SliderImage);
