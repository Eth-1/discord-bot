import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'
import { getRandomInt } from '../utils'

export class ChoiceCommand implements IBotCommand {
    private readonly CMD_REGEXP = /(.+)(?: или )(.+)/i

    public help(): IBotCommandHelp {
        return { caption: '{1} или {2}', description: 'Выбирает случайный вариант 1 или 2.' }
    }

    public init(bot: IBot): void { }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async run(msg: string, answer: IBotMessage): Promise<void> {
        if (msg.toLowerCase().split(' или ').length > 2) {
            answer.setTextOnly('сложный выбор. Предложи два варианта и я определюсь.')
            return
        }
        const matches = msg.match(this.CMD_REGEXP)!
        answer.setTextOnly(getRandomInt(1, 100) > 50 ? matches[1] : matches[2])
    }
}