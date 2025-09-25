import axios from "axios";

//----------------------- Fetch Secret Key -----------------------//

export const fetchSecretKey = async (id,token) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/secret/${id}`,{
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