import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import ScreenHeader from './ScreenHeader';
import Filter from './Filter';
import { Searchbar } from 'react-native-paper';
import Mycontext from '../../config/Mycontext';



const MainHeader = ({navigation}) => {
  const [showComponent, setShowComponent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dlUser= useContext(Mycontext)
  console.log('User',dlUser)
  const [filter, setFilter] = useState({})

  // const route = useRoute();
  // const formData = route.params?.filter
  // if (formData) console.log('fdata',formData)
  const handleButtonPress = () => {
    setShowComponent(true);
  };

  

  return (

    
    <>
        <View style={{...styles.container}}>
            <Image
              source={{ uri: dlUser[0].avatar}}
              style={{ width: 30, height: 30, borderRadius: 15}}
            />
            <Searchbar style={styles.title}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              
            />            
            <TouchableOpacity>
                <MaterialIcons
                name="travel-explore"
                size={30}
                color={COLORS.black}
                    />
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={handleButtonPress}>
                <MaterialIcons name="filter-alt" size={24} color="black" />
            </TouchableOpacity>
            {showComponent && <Filter fil ={filter} setfil = {setFilter} X={showComponent} setShow = {setShowComponent} />}
        </View>
        <ScreenHeader fil = {filter} navigation ={navigation} q={searchQuery}  />
    </>
        
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    position: 'relative',
    marginTop: 30,
  },
  title: {
   borderStyle:'solid', borderColor:'black', borderWidth: 1, width: '70%'
  },
});

export default MainHeader;