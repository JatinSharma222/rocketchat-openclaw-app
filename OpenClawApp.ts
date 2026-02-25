import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { OpenClawCommand } from './commands/OpenClawCommand';
import { settings } from './settings/settings';

export class OpenClawApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        // Register all settings
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));

        // Register slash command
        await configuration.slashCommands.provideSlashCommand(new OpenClawCommand(this));
    }
}