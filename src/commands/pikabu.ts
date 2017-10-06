import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import * as qs from 'querystring'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class PikabuCommand implements IBotCommand {
    private readonly API_URL1 = 'https://pikabu.ru/search.php?q='
    private readonly API_URL2 = 'https://pikabu.ru/'
    private readonly CMD_REGEXP = /^\/(pikabu|пикабу)(?: |$)/im
    private readonly TIMEOUT = 5000
    private readonly LIMIT = 5
    private _bot: IBot

    public getHelp(): IBotCommandHelp {
        return {
            caption: '/pikabu /пикабу [ключевые слова]',
            description: 'Статьи с pikabu.ru. Если не указаны ключевые слова - будут показаны последние.'
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
            const url = keywords ? `${this.API_URL1}${qs.escape(keywords)}` : this.API_URL2
            const response = await fetch(url, { timeout: this.TIMEOUT })
            const html = await response.text()
            const $ = cheerio.load(html)
            const posts = $('.story__title-link')
            const max = Math.min(this.LIMIT, posts.length)
            if (max > 0) {
                for (let i = 0; i < max; i++) {
                    answer.addField(posts[i].attribs.href, $(posts[i]).text())
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