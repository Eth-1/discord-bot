import * as discord from 'discord.js'
import { RichEmbed } from 'discord.js'
import { IBot, IBotCommand, IBotConfig, ILogger } from './api'
import { BotMessage } from './message'

export class Bot implements IBot {
    public get logger() { return this._logger }

    private readonly _commands: IBotCommand[] = []
    private _client: discord.Client
    private _config: IBotConfig
    private _logger: ILogger
    private _botId: string

    public getCommands(): IBotCommand[] {
        return this._commands
    }

    public start(logger: ILogger, config: IBotConfig, commandsPath: string) {
        this._logger = logger
        this._config = config

        this.loadCommands(commandsPath)

        if (!this._config.token) { throw new Error('invalid discord token') }

        this._client = new discord.Client()

        this._client.on('ready', () => {
            this._botId = this._client.user.id
            if (this._config.game) {
                this._client.user.setGame(this._config.game)
            }
            this._client.user.setStatus('online')
            this._logger.info('started...')
        })

        this._client.on('message', async (message) => {
            if (message.author.id !== this._botId) {
                const text = message.cleanContent
                this._logger.debug(`[${message.author.tag}] ${text}`)
                for (const cmd of this._commands) {
                    try {
                        if (cmd.test(text)) {
                            const answer = new BotMessage()
                            await cmd.run(text, answer)
                            message.reply(answer.text || { embed: answer.richText })
                            break
                        }
                    } catch (ex) {
                        this._logger.error(ex)
                        return
                    }
                }
            }
        })

        this._client.login(this._config.token)
    }

    private loadCommands(commandsPath: string) {
        if (!this._config.commands || !Array.isArray(this._config.commands) || this._config.commands.length === 0) {
            throw new Error('Invalid / empty commands list')
        }
        for (const cmdName of this._config.commands) {
            const cmdClass = require(`${commandsPath}/${cmdName}`).default
            const command = new cmdClass() as IBotCommand
            command.init(this)
            this._commands.push(command)
            this._logger.info(`command "${cmdName}" loaded...`)
        }
    }
}