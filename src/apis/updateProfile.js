import axios from "axios";

//----------------------- Update Socket ID -----------------------//

export const updateProfile = async (data, token) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/edit/profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        return response.data;
    }catch(error){
        return error.response.data;
    }
}