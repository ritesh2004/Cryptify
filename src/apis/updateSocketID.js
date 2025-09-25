import axios from "axios";

//----------------------- Update Socket ID -----------------------//

export const updateSocketID = async (socketId, token) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/edit/socket`, {
            socketId
        }, {
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