import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const SETTING_SERVER_URL = 'openclaw_server_url';
export const SETTING_API_KEY = 'openclaw_api_key';
export const SETTING_MODEL = 'openclaw_model';
export const SETTING_MOCK_MODE = 'openclaw_mock_mode';

export const settings: ISetting[] = [
    {
        id: SETTING_SERVER_URL,
        type: SettingType.STRING,
        packageValue: '',
        required: false,
        public: false,
        i18nLabel: 'OpenClaw Server URL',
        i18nDescription: 'The base URL of your OpenClaw server (e.g. https://your-openclaw-server.com)',
    },
    {
        id: SETTING_API_KEY,
        type: SettingType.PASSWORD,
        packageValue: '',
        required: false,
        public: false,
        i18nLabel: 'OpenClaw API Key',
        i18nDescription: 'Your OpenClaw API key for authentication.',
    },
    {
        id: SETTING_MODEL,
        type: SettingType.STRING,
        packageValue: 'openclaw',
        required: false,
        public: false,
        i18nLabel: 'OpenClaw Model Name',
        i18nDescription: 'The model to use for completions (default: openclaw).',
    },
    {
        id: SETTING_MOCK_MODE,
        type: SettingType.BOOLEAN,
        packageValue: true,
        required: false,
        public: false,
        i18nLabel: 'Mock Mode',
        i18nDescription: 'Enable mock mode to test the integration without a real OpenClaw server. Disable this in production.',
    },
];