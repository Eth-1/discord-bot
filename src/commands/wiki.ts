import fetch, { Request } from 'node-fetch'
import * as qs from 'querystring'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

interface IWikiList { [key: string]: { fullurl: string } }

export default class WikiCommand implements IBotCommand {
    private readonly API_URL = '.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&titles='
    private readonly CMD_REGEXP = /^\/(wiki|w|вики|в)(?: |$)/im
    private readonly TIMEOUT = 5000
    private _bot: IBot

    public getHelp(): IBotCommandHelp {
        return {
            caption: '/wiki /w /вики /в {ключевые слова}',
            description: 'Поиск по википедии: /wiki /w - по английской, /вики /в - по русской.'
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
        const cmd = matches[1].toLowerCase()
        const lang = cmd === 'вики' || cmd === 'в' ? 'ru' : 'en'
        try {
            const url = `https://${lang}${this.API_URL}${qs.escape(keywords)}`
            const response = await fetch(url, { timeout: this.TIMEOUT })
            const rawData = await response.json()
            if (rawData) {
                const list = rawData.query.pages as IWikiList
                const pages = Object.keys(list)
                if (pages.length === 0 || pages[0] === '-1') {
                    answer.setTextOnly('Нет данных')
                } else {
                    answer.setTextOnly(list[pages[0]].fullurl)
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