import fetch from 'node-fetch'
import * as qs from 'querystring'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

interface INewsItem {
    title: string
    url: string
}

export default class HaipItNewsCommand implements IBotCommand {
    private readonly API_URL = 'https://api.haipit.news/api/v1/'
    private readonly PLATFORM = 'discord-bot'
    private readonly CMD_REGEXP = /^\/(news|новости)(?: |$)/im
    private readonly TIMEOUT = 5000
    private readonly LIMIT = 5
    private _bot: IBot

    public getHelp(): IBotCommandHelp {
        return {
            caption: '/news /новости [ключевые слова]',
            description: 'Новости с haipit.news. Если не указаны ключевые слова - будет показана одна случайная новость.'
        }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(msg: string, answer: IBotMessage): Promise<void> {
        const cmdMatches = msg.match(this.CMD_REGEXP)!
        const keywords = msg.substr(cmdMatches[0].length).trim()
        try {
            const url = keywords ?
                `${this.API_URL}find?platform=${this.PLATFORM}&limit=${this.LIMIT}&keywords=${qs.escape(keywords)}` :
                `${this.API_URL}news/random`
            const response = await fetch(url, { timeout: this.TIMEOUT })
            const rawData = await response.json()
            if (rawData && Array.isArray(rawData.result) && rawData.result.length > 0) {
                const newsList = rawData.result as INewsItem[]
                const max = Math.min(this.LIMIT, newsList.length)
                for (let i = 0; i < max; i++) {
                    answer.addField(newsList[i].url, newsList[i].title)
                }
            } else {
                answer.setTextOnly('Нет данных')
            }
        } catch (ex) {
            this._bot.logger.warn(ex)
            answer.setTextOnly('Нет данных')
        }
    }
}