import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'
import { getRandomInt } from '../utils'

export default class ChoiceCommand implements IBotCommand {
    private readonly CMD_REGEXP = /(.+)(?: или )(.+)/i

    public getHelp(): IBotCommandHelp {
        return { caption: '{1} или {2}', description: 'Выбирает случайный вариант 1 или 2.' }
    }

    public init(bot: IBot, dataPath: string): void { }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async process(msg: string, answer: IBotMessage): Promise<void> {
        if (msg.toLowerCase().split(' или ').length > 2) {
            answer.setTextOnly('сложный выбор. Предложи два варианта и я определюсь.')
            return
        }
        const matches = msg.match(this.CMD_REGEXP)!
        answer.setTextOnly(getRandomInt(1, 100) > 50 ? matches[1] : matches[2])
    }
}