import { fetchChatsForUser } from "../apis/fetchChatsForUser";
import { DecodeAll } from "./DecodeAll";
import { batchInsertMessages } from "./databaseUtils";

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

        // Use batch insert for efficient bulk storage
        const result = await batchInsertMessages(db, decodedChats);

        if (result.success) {
            console.log(`Successfully loaded ${result.inserted}/${result.total} messages to local database`);
            if (result.errors) {
                console.warn(`${result.errors.length} messages failed to insert`);
            }
        } else {
            console.error("Failed to load messages to database:", result.error);
        }

        return decodedChats;
    } catch (error) {
        console.error("Error loading database:", error);
        return [];
    }
}