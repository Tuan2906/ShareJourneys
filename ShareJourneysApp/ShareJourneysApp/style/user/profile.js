import { StyleSheet} from 'react-native';
import { COLORS, FONTS, SIZES, images } from "../../constants";



const styleProfile = StyleSheet.create({
  SafeAreaViewPro:{
      flex: 1,
      backgroundColor: COLORS.white,
  },
  ViewStylePro:{
       width: "100%",
       height:'100%',
       alignItems: 'center',
       marginTop: 50
  },
  ImageStylePro:{
      height: 155,
      width: 155,
      borderRadius: 999,
      borderColor: COLORS.primary,
      borderWidth: 2,
      marginTop: 10,
  },
  FontStylePro:{
      fontSize :20,
      color: '#000',
  },
  TouchStylePro:{
      width: '100%',
      height: '5%',
      alignItems: "center",
      borderStyle: 'solid',
      borderWidth: 2,
      // justifyContent: "center",
      backgroundColor: COLORS.white,
  }

})

export default styleProfile;