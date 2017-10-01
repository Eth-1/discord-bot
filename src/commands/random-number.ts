import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class RandomNumberCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/getrandomnumber(?: |$)/im

    public getHelp(): IBotCommandHelp {
        return { caption: '/getrandomnumber', description: 'Выводит гарантированно случайное число.' }
    }

    public init(bot: IBot, dataPath: string): void { }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async process(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTextOnly('42')
    }
}