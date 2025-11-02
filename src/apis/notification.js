import axios from "axios";

//----------------------- Notification Manager -----------------------//

//----------------------- Upload Push Token -----------------------//
export const uploadPushToken = async (data, token) => {
  console.log("Notification Data: ",data);
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/notification/upload-token`,
      {
        token: data.token,
        userId: data.userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      }
    );
    // console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
};

//----------------------- Send Notification -----------------------//

export const sendNotification = async (data, token) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/notification/send-notification`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
};
