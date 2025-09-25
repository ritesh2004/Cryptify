import axios from "axios";

//----------------------- Fetch All Messages for Specific User -----------------------//

export const fetchChatsForUser = async (id, token) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/chat/get/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        // console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};