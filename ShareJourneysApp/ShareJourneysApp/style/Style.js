import { StyleSheet } from "react-native";
import color from "./color";
const styles= StyleSheet.create({
    text:
    {
        fontFamily: 'regular', fontSize: 14, lineHeight: 20,
        color: color.white
    },
    text_Post:
    {
        fontSize: 16, lineHeight: 40,
    },
    touchableOpacity_nhantin:
    {
        width: 124,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.primary,
        borderRadius: 10,
        marginHorizontal: 8,
        flexDirection: "row"
    },
    touchableOpacity_report:
    {
        width: 124,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.primary,
        borderRadius: 10,
        marginHorizontal: 10 * 2,
    },
    imgProfileUser:
    {
        height: 155,
        width: 155,
        borderRadius: 999,
        borderColor: color.primary,
        borderWidth: 2,
        marginTop: -89,
    },
    touchableOpacityGoBack:
    {
        position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 1,
    },
    reportCheckboxContainer: {
        flexDirection: 'row',
        marginTop: 10,
      },
      reportCheckbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      },
      checkbox: {
        width: 14,
        height: 14,
        borderRadius: 2,
        backgroundColor: 'white',
      },
      checkboxChecked: {
        backgroundColor: 'gray',
      },
      reportCheckboxLabel: {
        fontSize: 16,
        color: 'gray',
      },
      closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      closeButton: {
        padding: 5,
      },
      modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      reasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      reasonCheckmarkContainer: {
        marginRight: 10,
      },
      reasonText: {
        fontSize: 16,
      },
      selectedReason: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
      },
      confirmButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
      },
      confirmButtonText: {
        color: 'white',
        fontSize: 18,
      },

})
export default styles