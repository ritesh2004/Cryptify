import axios from "axios";

//----------------------- Fetch All Users -----------------------//

export const fetchAllUsers = async (token) => {
    try {
        console.log(token);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
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