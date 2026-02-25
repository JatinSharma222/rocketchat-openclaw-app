import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

/**
 * Sends a message to a room as the App bot user.
 */
export async function sendMessage(
    modify: IModify,
    sender: IUser,
    room: IRoom,
    text: string,
): Promise<void> {
    const messageBuilder = modify.getCreator().startMessage()
        .setSender(sender)
        .setRoom(room)
        .setText(text);

    await modify.getCreator().finish(messageBuilder);
}

