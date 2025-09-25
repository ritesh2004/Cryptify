import { decrypt } from "./decryption";

export const DecodeAll = (chats, user) => {
    try {
        if (!user) return [];
        // console.log(chats);
        // console.log(user);
        console.log("Decrypting all...");
        let decodedMsgs = chats.map((msg, id) => {
            if (msg.from_id === user?.id) {
                return {
                    id : msg.chatid,
                    from_id: msg.from_id,
                    to_id: msg.to_id,
                    message: decrypt(msg.message, user, true),
                    message_time: msg.message_time
                }
            } else {
                return {
                    id : msg.chatid,
                    from_id: msg.from_id,
                    to_id: msg.to_id,
                    message: decrypt(msg.message, user, false),
                    message_time: msg.message_time
                }
            }
        })
        console.log("Decoded all messages");
        // console.log(decodedMsgs);
        return decodedMsgs;
    } catch (error) {
        console.log(error);
        return [];
    }
}