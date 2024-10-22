import axios from "axios";

//----------------------- Fetch Secret Key -----------------------//

export const fetchSecretKey = async (id,token) => {
    try {
        const response = await axios.get(`http://192.168.1.4:5000/api/v1/user/secret/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }   
}