import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, Image, Text } from 'react-native';
import MapView, { Marker, Polyline ,PROVIDER_GOOGLE} from 'react-native-maps';

const MapViewComponent = ({local,route,index}) => {
  const { diaChi, ...rest } = local[index];
  console.log('Locals',local);
  console.log('diaChi',diaChi);
  console.log('rest',rest);

//   var data =[{
//     latitude: 10.828105,
//     longitude: 106.736222,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   },
//   {
//     latitude: 10.827827,
//     longitude: 106.736267,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   },
//   {
//     latitude: 10.825265,
//     longitude:  106.737435,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   },
// ]


const mapRef = useRef(null);

useEffect(() => {
    if (mapRef.current) {
      console.log('mapRef.current')
        mapRef.current.animateToRegion(route, 10000); // 1000 ms cho hiệu ứng mượt
    }
}, [route]);
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        region={rest}
      >
       {
        
        local.map((data,index)=>{
          const { diaChi, ...rest } = data;
          return (
            <Marker coordinate={rest} key={index}> 
            <View style={styles.customMarker}>
              <Image
                source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.yphFFuGZvajAt3GGHF-wfwHaGj&pid=Api&P=0&h=180' }} // Thay bằng URL hình ảnh của bạn
                style={styles.markerImage}
              />
              <Text style={styles.markerText}>{diaChi}</Text>
            </View>
            <View style = {{alignItems:'center'}}> 
            <Image
                source={{ uri: 'https://media.istockphoto.com/id/1307260371/vi/vec-to/ghim-b%E1%BA%A3n-%C4%91%E1%BB%93-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-c%E1%BB%A7a-ghim-th%E1%BA%A3-%C4%91%E1%BB%8Ba-%C4%91i%E1%BB%83m-%C4%91i%E1%BB%83m-%C4%91%C3%A1nh-d%E1%BA%A5u-gps-m%C3%A0u-%C4%91%E1%BB%8F-%C4%91i%E1%BB%83m-%C4%91%E1%BB%8Ba-l%C3%BD-cho-v%E1%BB%8B-tr%C3%AD.jpg?s=170667a&w=0&k=20&c=4AaBM2tixPn9Q0YqETscWRPjsQSX01euR2bHzICubn8=' }} // Thay bằng URL hình ảnh của bạn
                style={styles.markerImage}
                />
            </View>
          </Marker>
          )
})

       }
       
        {route && (
          <Polyline
            coordinates={route}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width:'100%',
    height: 200,
  },
  customMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 15,
    justifyContent:'center',
  },
  markerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  markerText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default MapViewComponent;