import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { App } from '@rocket.chat/apps-engine/definition/App';

import { OpenClawService } from '../services/OpenClawService';
import { sendMessage } from '../lib/sendMessage';
import { storeTask } from '../lib/taskMap';

export class OpenClawCommand implements ISlashCommand {
    public command = 'openclaw';
    public i18nDescription = 'Chat with OpenClaw AI';
    public i18nParamsExample = 'Ask me anything...';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
    ): Promise<void> {
        const prompt = context.getArguments().join(' ').trim();

        if (!prompt) {
            await sendMessage(
                modify,
                context.getSender(),
                context.getRoom(),
                'Please provide a prompt. Usage: `/openclaw <your question>`',
            );
            return;
        }

        await sendMessage(
            modify,
            context.getSender(),
            context.getRoom(),
            `⏳ OpenClaw is thinking...`,
        );

        try {
            const service = new OpenClawService(this.app, read, http);
            const result = await service.query(prompt);

            if (result.mode === 'async') {
                storeTask(result.taskId, {
                    userId: context.getSender().id,
                    roomId: context.getRoom().id,
                    timestamp: Date.now(),
                });

                this.app.getLogger().info(`[OpenClaw] Task queued: ${result.taskId}`);

                await sendMessage(
                    modify,
                    context.getSender(),
                    context.getRoom(),
                    `Task queued (ID: \`${result.taskId}\`). Response will appear here when ready.`,
                );

            } else {
                await sendMessage(
                    modify,
                    context.getSender(),
                    context.getRoom(),
                    `**OpenClaw:** ${result.content}`,
                );
            }

        } catch (error) {
            this.app.getLogger().error('[OpenClaw] Command error:', error);
            await sendMessage(
                modify,
                context.getSender(),
                context.getRoom(),
                'OpenClaw encountered an error. Please check your configuration.',
            );
        }
    }
}