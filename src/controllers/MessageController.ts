import { User } from '../models/User';
import { Message } from '../models/Message';
export class MessageController {
    async createMessage(texte: string, senderId: string, receiverId: string) {
        const sender = await User.findOne(senderId);
        const receiver = await User.findOne(receiverId);
        const newMessage = Message.create({
            texte,
            destinataire: receiver,
            user: sender
        });
        return await newMessage.save();
    } 
}
