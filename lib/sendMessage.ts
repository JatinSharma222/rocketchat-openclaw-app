import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

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

/**
 * Sends a message to a room identified only by its roomId.
 * Used by the callback handler where we only have the stored roomId string.
 */
export async function sendMessageToRoomId(
    modify: IModify,
    read: import('@rocket.chat/apps-engine/definition/accessors').IRead,
    roomId: string,
    text: string,
): Promise<void> {
    const room = await read.getRoomReader().getById(roomId);
    if (!room) {
        console.error(`[sendMessageToRoomId] Room not found: ${roomId}`);
        return;
    }

    const appUser = await read.getUserReader().getAppUser();
    if (!appUser) {
        console.error('[sendMessageToRoomId] App user not found');
        return;
    }

    const messageBuilder = modify.getCreator().startMessage()
        .setSender(appUser)
        .setRoom(room)
        .setText(text);

    await modify.getCreator().finish(messageBuilder);
}