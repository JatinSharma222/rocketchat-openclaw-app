import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
    ApiSecurity,
    ApiVisibility,
} from '@rocket.chat/apps-engine/definition/api';
import { ApiEndpoint } from '@rocket.chat/apps-engine/definition/api';

import { getTask, deleteTask } from '../lib/taskMap';
import { sendMessageToRoomId } from '../lib/sendMessage';

export class OpenClawCallbackEndpoint extends ApiEndpoint {
    public path = 'openclaw/callback';
    public security = ApiSecurity.UNSECURE;
    public visibility = ApiVisibility.PUBLIC;

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
    ): Promise<IApiResponse> {
        const { task_id, result } = request.content as { task_id?: string; result?: string };

        console.log(`[OpenClaw] Callback received — task_id=${task_id}`);

        // --- Validate payload ---
        if (!task_id || !result) {
            console.error('[OpenClaw] Callback missing task_id or result');
            return this.json({
                status: 400,
                content: { error: 'Missing task_id or result in payload' },
            });
        }

        // --- Look up the task ---
        const task = getTask(task_id);

        if (!task) {
            console.error(`[OpenClaw] Callback: task not found for id=${task_id}`);
            return this.json({
                status: 404,
                content: { error: `Task ${task_id} not found` },
            });
        }

        console.log(`[OpenClaw] Routing result to room=${task.roomId}, user=${task.userId}`);

        // --- Deliver the message to the correct room ---
        try {
            await sendMessageToRoomId(modify, read, task.roomId, `**OpenClaw:** ${result}`);
        } catch (err) {
            console.error('[OpenClaw] Failed to send callback message:', err);
            return this.json({
                status: 500,
                content: { error: 'Failed to deliver message to room' },
            });
        }

        // --- Clean up ---
        deleteTask(task_id);

        return this.json({
            status: 200,
            content: { ok: true },
        });
    }
}