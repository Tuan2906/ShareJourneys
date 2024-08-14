
import { Button, Platform, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseconf";
import Mycontext from "../../config/Mycontext";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Notification(){
  const [expoPushToken, setExpoPushToken] = useState("");
  const dlUser = useContext(Mycontext)

  async function fetchData() {
    console.log("Registering for push notifications...");
    try {
      const token = await registerForPushNotificationsAsync();
      const docsRef = collection(db, "Notifications");
      const docS = doc(docsRef, token);
      await AsyncStorage.setItem("token_device", token)

      console.log("token: ", token);
  
      const docSnap = await getDoc(docS);
      setExpoPushToken(token);
  
      if (docSnap.exists()) {
        // Lấy mảng username hiện tại
        const currentUsernames = docSnap.data().username || [];
        // Nối với username mới
        if (!currentUsernames.includes(dlUser[0].username)) {
          // Nối với username mới nếu chưa tồn tại
          const updatedUsernames = [...currentUsernames, dlUser[0].username];
  
          // Cập nhật tài liệu với giá trị username mới
          await setDoc(docS, { username: updatedUsernames });
          console.log("Document successfully updated!");
        } else {
          console.log("Username already exists in the array.");
        }
        // Cập nhật tài liệu với giá trị username mới
        console.log("Document successfully updated!");
      } else {
        // Tạo tài liệu mới nếu không tồn tại
        await setDoc(docS, { username: [dlUser[0].username] });
        console.log("Document successfully created!");
      }
    } catch (error) {
      console.error("Error handling notification: ", error);
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      console.log("vo android")
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#00FF00",
        color:"#00FF00",
      });
    }

    if (Device.isDevice) {
       console.log("vo if deviex");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:    
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "c42e080a-a85f-4e8d-8e2f-ae7193c02611",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

}

const sendTo = async (expoPushToken,body) =>{
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "SHAREJOURNEY THÔNG BÁO",
    body: body,
  };

  let res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
  console.log('dawdwdaw',res.status);
}

export const sendNotification = async (body,username) => {
    console.log("Sending push notification...");
    const docsRef = collection(db, "Notifications");

    // Tạo truy vấn với điều kiện username chứa user cụ thể
    const q = query(docsRef, where("username", "array-contains", username));
    
    // Thực hiện truy vấn
    const querySnapshot = await getDocs(q);
    
    // Duyệt qua kết quả và lấy tên tài liệu
    const documentNames = querySnapshot.docs.map(doc => {
      console.log(doc.id)
      sendTo(doc.id, body)

    });
    // notification message
    
    console.log("Sending push success...");
  };

export const deleteDevide = async (token,dlUser) =>{
  console.log('dlUser neeeeee',dlUser[0].username)
  try {
    const docRef = doc(db, "Notifications", token);

    // Lấy tài liệu từ FirestoreW
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Lấy mảng username hiện tại
      const currentUsernames = docSnap.data().username || [];

      // Kiểm tra và xóa user nếu tồn tại trong mảng
      const updatedUsernames = currentUsernames.filter(username => username !== dlUser[0].username);

      // Cập nhật tài liệu với mảng username đã chỉnh sửa
      await updateDoc(docRef, { username: updatedUsernames });

      console.log("User successfully removed from document!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}