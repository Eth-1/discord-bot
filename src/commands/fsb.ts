import { IBot, IBotCommand, IBotCommandHelp, IBotMessage, IUser } from '../api'
import { getRandomInt, getUserString } from '../utils'

export default class FsbCommand implements IBotCommand {
    private readonly CMD_REGEXP = /\/(fsb|фсб|гебня|гэбня)(?:[ \.,]||$)/im
    private readonly TIMEOUT = 24 * 60 * 60 * 1000
    private _bot: IBot
    private _agent: IUser

    public help(): IBotCommandHelp {
        return { caption: '/fsb /фсб /гебня /гэбня', description: 'Выводит текущего агента фсб, обновляется раз в сутки.' }
    }

    public init(bot: IBot): void {
        this._bot = bot
        setInterval(this.findAgent.bind(this), this.TIMEOUT)
    }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async run(msg: string, answer: IBotMessage): Promise<void> {
        if (!this._agent) {
            this.findAgent()
        }
        answer.setTextOnly(`Агентом кровавой гэбни у нас на сегодня назначен ${getUserString(this._agent)}`)
    }

    private findAgent() {
        const users = this._bot.allUsers
        this._agent = users[getRandomInt(0, users.length - 1)]
    }
}