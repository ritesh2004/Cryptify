import axios from "axios";

//----------------------- User Authentication -----------------------//

//----------------------- Login -----------------------//
export const login = async (data) => {
    console.log(data);
  try {
    const response = await axios.post(
      "http://192.168.1.4:5000/api/v1/user/login",
      data
    );
    // console.log(response?.data);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

//----------------------- Register -----------------------//

export const register = async (data) => {
    try {
        const response = await axios.post(
        "http://192.168.1.4:5000/api/v1/auth/register",
        data
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};