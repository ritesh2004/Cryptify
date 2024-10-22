import axios from "axios";

//----------------------- Update Socket ID -----------------------//

export const updateSocketID = async (socketId, token) => {
    try {
        const response = await axios.post("http://192.168.1.4:5000/api/v1/user/edit/socket", {
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