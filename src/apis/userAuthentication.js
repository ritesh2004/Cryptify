import axios from "axios";

//----------------------- User Authentication -----------------------//

//----------------------- Login -----------------------//
export const login = async (data) => {
    // console.log(data);
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/user/login`,
      data
    );
    // console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.log("Error: ",error);
    return null;
  }
};

//----------------------- Register -----------------------//

export const register = async (data) => {
    try {
        const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/create`,
        data
        );
        // console.log(response.data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// ------------------------ Store Biometric Data ------------------------ //
export const storeBiometricData = async (data, token) => {
    try {
        // console.log("Storing biometric data...");
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/biometric/store`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log("Biometric data stored successfully: ", response.data);
        return response.data;
    } catch (error) {
        return null;
    }
};

// ------------------------ Verify Biometric Data ------------------------ //
export const verifyBiometricData = async (data) => {
    try {
        // console.log("Verifying biometric data...");
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/biometric/verify`, data);
        // console.log("Biometric data verified successfully: ", {accessToken: response.data.accessToken, user: {id: response.data.user.id, username: response.data.user.username, email: response.data.user.email}});
        return response.data;
    } catch (error) {
        console.log("Error verifying biometric data: ", error);
        return null;
    }
};
