import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'
import { getRandomInt } from '../utils'

export default class KekCommand implements IBotCommand {
    private readonly CMD_REGEXP = /(kek|кек)(?:[ \.,]||$)/im
    private readonly ANSWERS = [
        'кукарек!',
        '4ебурек!',
        'кєк!',
        'кўк!',
        'кекекеке!'
    ]

    public help(): IBotCommandHelp {
        return { caption: 'kek / кек', description: 'Выводит случайный ответ на кек.' }
    }

    public init(bot: IBot): void { }

    public test(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async run(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTextOnly(this.ANSWERS[getRandomInt(0, this.ANSWERS.length - 1)])
    }
}