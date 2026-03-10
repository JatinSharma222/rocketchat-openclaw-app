import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';

import { SETTING_API_KEY, SETTING_SERVER_URL, SETTING_MODEL, SETTING_MOCK_MODE } from '../settings/settings';

export interface AsyncTaskResponse {
    taskId: string;
    mode: 'async';
}

export interface SyncTaskResponse {
    content: string;
    mode: 'sync' | 'mock';
}

export type OpenClawQueryResponse = AsyncTaskResponse | SyncTaskResponse;

export class OpenClawService {
    constructor(
        private readonly app: App,
        private readonly read: IRead,
        private readonly http: IHttp,
    ) {}

    public async query(prompt: string): Promise<OpenClawQueryResponse> {
        const isMockMode = await this.read.getEnvironmentReader().getSettings().getValueById(SETTING_MOCK_MODE);

        // MOCK MODE — returns a fake synchronous response (for dev/testing)
        if (isMockMode) {
            this.app.getLogger().info('[OpenClaw] Mock mode enabled — returning fake response');
            return {
                mode: 'mock',
                content: `[MOCK] OpenClaw received your prompt: "${prompt}". This is a simulated response.`,
            };
        }

        // REAL MODE — calls the OpenClaw API
        const serverUrl = await this.read.getEnvironmentReader().getSettings().getValueById(SETTING_SERVER_URL);
        const apiKey = await this.read.getEnvironmentReader().getSettings().getValueById(SETTING_API_KEY);
        const model = await this.read.getEnvironmentReader().getSettings().getValueById(SETTING_MODEL);

        if (!serverUrl || !apiKey) {
            throw new Error('OpenClaw server URL or API key is not configured.');
        }

        const endpoint = `${serverUrl.replace(/\/$/, '')}/v1/chat/completions`;

        const response = await this.http.post(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            data: {
                model: model || 'openclaw',
                messages: [
                    { role: 'user', content: prompt },
                ],
            },
        });

        if (!response || !response.data) {
            throw new Error('No response received from OpenClaw API.');
        }

        if (response.statusCode !== 200 && response.statusCode !== 202) {
            throw new Error(`OpenClaw API returned status ${response.statusCode}: ${JSON.stringify(response.data)}`);
        }

        if (response.data?.task_id) {
            this.app.getLogger().info(`[OpenClaw] Async task started: ${response.data.task_id}`);
            return {
                mode: 'async',
                taskId: response.data.task_id,
            };
        }

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('Unexpected response format from OpenClaw API.');
        }

        return { mode: 'sync', content };
    }
}