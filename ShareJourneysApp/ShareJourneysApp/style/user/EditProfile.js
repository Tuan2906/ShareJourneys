import { StyleSheet } from "react-native"
import { COLORS, FONTS } from "../../constants";



const styleEditProfile = StyleSheet.create({
    
    main:{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    view:{
      margin: 20,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      padding: 35,
      width: "90%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    picker:{
      backgroundColor: COLORS.primary,
      textHeaderColor: "#469ab6",
      textDefaultColor: COLORS.white,
      selectedTextColor: COLORS.white,
      mainColor: "#469ab6",
      textSecondaryColor: COLORS.white,
      borderColor: "rgba(122,146,165,0.1)",
    },
    image: {
      height: 170,
      width: 170,
      borderRadius: 85,
      borderWidth: 2,
      borderColor: COLORS.primary,
    }, 
    camera: {
        position: "absolute",
        bottom: 0,
        right: 10,
        zIndex: 9999,
      
    },
    input: {
      height: 44,
      width: "100%",
      borderColor: COLORS.secondaryGray,
      borderWidth: 1,
      borderRadius: 4,
      marginVertical: 6,
      justifyContent: "center",
      paddingLeft: 8,
    },
    button:{
      backgroundColor: COLORS.primary,
      height: 44,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
    }
  })

  export default styleEditProfile;