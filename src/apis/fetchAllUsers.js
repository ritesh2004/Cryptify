import axios from "axios";

//----------------------- Fetch All Users -----------------------//

export const fetchAllUsers = async (token) => {
    try {
        const response = await axios.get("http://192.168.1.4:5000/api/v1/users",{
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