import { IBot, IBotConfig, ILogger } from './api'
import { Bot } from './bot'
import { ChoiceCommand } from './commands/choice'
import { GrowlCommand } from './commands/growl'
import { HaipItNewsCommand } from './commands/haipit-news'
import { HelpCommand } from './commands/help'
import { KekCommand } from './commands/kek'
import { KillCommand } from './commands/kill'
import { SourcesCommand } from './commands/sources'
import { WikiCommand } from './commands/wiki'

const logger: ILogger = console

const startup = async () => {
    let cfg = require('./../bot.json') as IBotConfig
    try {
        const cfgProd = require('./../bot.prod.json') as IBotConfig
        cfg = { ...cfg, ...cfgProd }
    } catch {
        logger.info('no production config found...')
    }

    new Bot()
        .addCommand(new HelpCommand())
        .addCommand(new HaipItNewsCommand())
        .addCommand(new WikiCommand())
        .addCommand(new GrowlCommand())
        .addCommand(new KekCommand())
        .addCommand(new ChoiceCommand())
        .addCommand(new KillCommand())
        .addCommand(new SourcesCommand())
        .start(logger, cfg)
}

startup()