import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'
import { getRandomInt } from '../utils'

interface IMountain {
    name: string
    height: number
    img?: string
}

export default class GrowlCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/(ор)(?: |$)/im
    private mountains: IMountain[]

    public getHelp(): IBotCommandHelp {
        return { caption: '/ор', description: 'Показывает уровень ора.' }
    }

    public init(bot: IBot, dataPath: string): void {
        this.mountains = (require(`${dataPath}/mountains.json`) as IMountain[]).sort((a, b) => a.height - b.height)
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }
    public async process(msg: string, answer: IBotMessage): Promise<void> {
        const id = getRandomInt(0, this.mountains.length)
        const low = id > 0 ? this.mountains[id - 1] : undefined
        const hi = id < this.mountains.length - 1 ? this.mountains[id + 1] : undefined
        if (!hi) {
            if (low && low.img) {
                answer.setImage(low.img)
            }
            answer.setDescription('Ваш ор выше всех гор!')
            return
        }
        if (hi && hi.img) {
            answer.setImage(hi.img)
        }
        if (!low) {
            answer.setDescription('Ваш ор ниже всех гор!')
            return
        }
        answer.setDescription(`Ваш ор выше "${low.name}" (${low.height}м) и ниже "${hi.name}" (${hi.height}м)!`)
    }
}