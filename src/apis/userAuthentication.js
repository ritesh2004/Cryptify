import axios from "axios";

//----------------------- User Authentication -----------------------//

//----------------------- Login -----------------------//
export const login = async (data) => {
    console.log(data);
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
        console.log(response.data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};