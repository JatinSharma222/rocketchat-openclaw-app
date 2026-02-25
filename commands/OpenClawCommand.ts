import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { App } from '@rocket.chat/apps-engine/definition/App';

import { OpenClawService } from '../services/OpenClawService';
import { sendMessage } from '../lib/sendMessage';

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
        const [, ...args] = context.getArguments();
        const prompt = context.getArguments().join(' ').trim();

        if (!prompt) {
            await sendMessage(modify, context.getSender(), context.getRoom(), 'Please provide a prompt. Usage: `/openclaw <your question>`');
            return;
        }

        // Show a "thinking" message
        await sendMessage(modify, context.getSender(), context.getRoom(), `OpenClaw is thinking...`);

        try {
            const service = new OpenClawService(this.app, read, http);
            const response = await service.query(prompt);
            await sendMessage(modify, context.getSender(), context.getRoom(), `**OpenClaw:** ${response}`);
        } catch (error) {
            this.app.getLogger().error('OpenClaw command error:', error);
            await sendMessage(modify, context.getSender(), context.getRoom(), `OpenClaw encountered an error. Please check your configuration.`);
        }
    }
}