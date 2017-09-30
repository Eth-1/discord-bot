import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class HelpCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/(help|помощь)(?: |$)/im
    private _bot: IBot

    public help(): IBotCommandHelp {
        return { caption: '/help /помощь', description: 'Эта команда.' }
    }

    public init(bot: IBot): void {
        this._bot = bot
    }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async run(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTitle('Список поддерживаемых команд:')
        for (const cmd of this._bot.commands) {
            const help = cmd.help()
            answer.addField(help.caption, help.description)
        }
    }
}