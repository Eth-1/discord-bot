import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export class KillCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/(kill|убить)(?: |$)/im
    private _bot: IBot

    public help(): IBotCommandHelp {
        return { caption: '/kill /убить {цель}', description: 'Угрожает цели.' }
    }

    public init(bot: IBot): void {
        this._bot = bot
    }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async run(msg: string, answer: IBotMessage): Promise<void> {
        const cmdMatches = msg.match(this.CMD_REGEXP)!
        const userName = msg.substr(cmdMatches[0].length).trim()
        if (userName) {
            answer.setTextOnly(`заказ принят. ${userName} - умри, жывотнайе!`)
        }
    }
}