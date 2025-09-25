import { fetchChatsForUser } from "../apis/fetchChatsForUser";
import { DecodeAll } from "./DecodeAll";
import { insertMessage } from "./databaseUtils";

// -------------- Load all data from Remote Database to Local Database --------------

export const loadDatabase = async (db, user, selector) => {
    try {
        // Fetch chats
        const { chats } = await fetchChatsForUser(user?.id, selector);
        if (!chats || chats.length === 0) {
            console.log("No chats found for user");
            return [];
        }

        // Decode all messages
        const decodedChats = DecodeAll(chats, user);

        // Insert data using the new database utility
        decodedChats.forEach(chat => {
            insertMessage(db, {
                id: chat.id,
                from_id: chat.from_id,
                to_id: chat.to_id,
                message: chat.message,
                message_time: chat.message_time
            });
        });

        console.log(`Loaded ${decodedChats.length} messages to local database`);
        return decodedChats;
    } catch (error) {
        console.error("Error loading database:", error);
        return [];
    }
}