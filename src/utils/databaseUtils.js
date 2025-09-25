// Insert a new decrypted message into the database
export const insertMessage = async (db, messageData) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return false;
        }

        const { id, from_id, to_id, message, message_time } = messageData;

        // Check if message already exists to avoid duplicates
        const existingMessage = await db.getFirstAsync(
            'SELECT id FROM chats WHERE id = ?',
            [id]
        );

        if (existingMessage) {
            console.log(`Message with id ${id} already exists`);
            return false;
        }

        // Insert new message
        await db.runAsync(
            'INSERT INTO chats (id, from_id, to_id, message, message_time) VALUES (?, ?, ?, ?, ?)',
            [id, from_id, to_id, message, message_time]
        );

        console.log(`Message inserted successfully: ${id}`);
        return true;
    } catch (error) {
        console.error("Failed to insert message:", error);
        return false;
    }
};

// Get all messages between two users
export const getMessagesForUsers = async (db, userId1, userId2) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return [];
        }
        const messages = await db.getAllAsync(
            `SELECT * FROM chats
             WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)
             ORDER BY message_time ASC`,
            [userId1, userId2, userId2, userId1]
        );
        // console.log(messages);
        return messages;
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return [];
    }
};

// Insert a real-time message (for messages sent/received during chat)
export const insertRealtimeMessage = async (db, fromId, toId, decryptedMessage, timestamp = null) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return false;
        }
        const messageTime = timestamp || new Date().toISOString();
        // Generate a temporary ID (you might want to update this with server ID later)
        const tempId = Date.now();

        const messageData = {
            id: tempId,
            from_id: fromId,
            to_id: toId,
            message: decryptedMessage,
            message_time: messageTime
        };

        return await insertMessage(db, messageData);
    } catch (error) {
        console.error("Failed to insert realtime message:", error);
        return false;
    }
};

// Update message ID when server responds (for sent messages)
export const updateMessageId = async (db, tempId, actualId) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return false;
        }
        await db.runAsync(
            'UPDATE chats SET id = ? WHERE id = ?',
            [actualId, tempId]
        );

        console.log(`Message ID updated from ${tempId} to ${actualId}`);
        return true;
    } catch (error) {
        console.error("Failed to update message ID:", error);
        return false;
    }
};

// Clear all messages (for debugging/reset purposes)
export const clearAllMessages = async (db) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return false;
        }
        await db.runAsync('DELETE FROM chats');
        console.log("All messages cleared");
        return true;
    } catch (error) {
        console.error("Failed to clear messages:", error);
        return false;
    }
};

// Get message count for a conversation
export const getMessageCount = async (db, userId1, userId2) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return 0;
        }
        const result = await db.getFirstAsync(
            `SELECT COUNT(*) as count FROM chats
             WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)`,
            [userId1, userId2, userId2, userId1]
        );

        return result?.count || 0;
    } catch (error) {
        console.error("Failed to get message count:", error);
        return 0;
    }
};