import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export class RandomNumberCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/getrandomnumber(?: |$)/im

    public help(): IBotCommandHelp {
        return { caption: '/getrandomnumber', description: 'Выводит гарантированно случайное число.' }
    }

    public init(bot: IBot): void { }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async run(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTextOnly('42')
    }
}