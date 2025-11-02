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

// Batch insert messages for efficient bulk operations
export const batchInsertMessages = async (db, messagesArray) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return { success: false, inserted: 0 };
        }

        if (!messagesArray || messagesArray.length === 0) {
            console.log("No messages to insert");
            return { success: true, inserted: 0 };
        }

        let insertedCount = 0;
        const errors = [];

        // Use transaction for atomic operation
        await db.withTransactionAsync(async () => {
            for (const messageData of messagesArray) {
                try {
                    const { id, from_id, to_id, message, message_time } = messageData;

                    // Normalize timestamp
                    const normalizedTime = normalizeTimestamp(message_time);

                    // Check if message already exists to avoid duplicates
                    const existingMessage = await db.getFirstAsync(
                        'SELECT id FROM chats WHERE id = ?',
                        [id]
                    );

                    if (existingMessage) {
                        console.log(`Message with id ${id} already exists, skipping`);
                        continue;
                    }

                    // Insert new message
                    await db.runAsync(
                        'INSERT INTO chats (id, from_id, to_id, message, message_time) VALUES (?, ?, ?, ?, ?)',
                        [id, from_id, to_id, message, normalizedTime]
                    );

                    insertedCount++;
                } catch (error) {
                    console.error(`Error inserting message ${messageData.id}:`, error);
                    errors.push({ id: messageData.id, error: error.message });
                }
            }
        });

        console.log(`Batch insert completed: ${insertedCount}/${messagesArray.length} messages inserted`);

        if (errors.length > 0) {
            console.warn(`Encountered ${errors.length} errors during batch insert:`, errors);
        }

        return {
            success: true,
            inserted: insertedCount,
            total: messagesArray.length,
            errors: errors.length > 0 ? errors : null
        };
    } catch (error) {
        console.error("Failed to batch insert messages:", error);
        return { success: false, inserted: 0, error: error.message };
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

// Validate and normalize timestamp
const normalizeTimestamp = (timestamp) => {
    if (!timestamp) {
        return new Date().toISOString();
    }

    try {
        // If it's already a Date object
        if (timestamp instanceof Date) {
            return timestamp.toISOString();
        }

        // If it's a string, try to parse it
        if (typeof timestamp === 'string') {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                console.warn(`Invalid timestamp string: ${timestamp}, using current time`);
                return new Date().toISOString();
            }
            return date.toISOString();
        }

        // If it's a number (Unix timestamp in milliseconds)
        if (typeof timestamp === 'number') {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                console.warn(`Invalid timestamp number: ${timestamp}, using current time`);
                return new Date().toISOString();
            }
            return date.toISOString();
        }

        console.warn(`Unknown timestamp format: ${typeof timestamp}, using current time`);
        return new Date().toISOString();
    } catch (error) {
        console.error("Error normalizing timestamp:", error);
        return new Date().toISOString();
    }
};

// Insert a real-time message (for messages sent/received during chat)
export const insertRealtimeMessage = async (db, fromId, toId, decryptedMessage, timestamp = null) => {
    try {
        if (!db) {
            console.error("Database is not initialized");
            return false;
        }

        const messageTime = normalizeTimestamp(timestamp);
        // Generate a temporary ID (you might want to update this with server ID later)
        const tempId = parseInt(`${Date.now()}${Math.floor(Math.random() * 1000)}`, 10);// Add random to avoid collisions

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