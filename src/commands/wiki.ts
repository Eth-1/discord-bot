import fetch, { Request } from 'node-fetch'
import * as qs from 'querystring'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

interface IWikiList { [key: string]: { title: string, fullurl: string } }

export default class WikiCommand implements IBotCommand {
    private readonly API_URL = '.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&titles='
    private readonly CMD_REGEXP = /^\/(wiki|w|вики|в)(?: |$)/im
    private readonly TIMEOUT = 5000
    private readonly LIMIT = 5
    private _bot: IBot

    public getHelp(): IBotCommandHelp {
        return {
            caption: '/wiki /w /вики /в {ключевые слова}',
            description: 'Поиск по википедии: /wiki - по английской, /вики - по русской.'
        }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(msg: string, answer: IBotMessage): Promise<void> {
        const matches = msg.match(this.CMD_REGEXP)!
        const keywords = msg.substr(matches[0].length).trim()
        if (!keywords) {
            answer.setTextOnly('укажи ключевые слова')
            return
        }
        const lang = matches[1].toLowerCase() === 'вики' || 'в' ? 'ru' : 'en'
        try {
            const url = `https://${lang}${this.API_URL}${qs.escape(keywords)}`
            const response = await fetch(url, { timeout: this.TIMEOUT })
            const rawData = await response.json()
            if (rawData) {
                const list = rawData.query.pages as IWikiList
                const pages = Object.keys(list)
                if (pages.length > 0 && pages[0] === '-1') {
                    answer.setTextOnly('Нет данных')
                    return
                }
                const max = Math.min(this.LIMIT, pages.length)
                for (let i = 0; i < max; i++) {
                    const page = list[pages[i]]
                    answer.addField(page.fullurl, page.title)
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