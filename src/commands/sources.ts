import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class SourcesCommand implements IBotCommand {
    private _link: string

    public getHelp(): IBotCommandHelp { return { caption: 'Исходный код', description: this._link } }

    public init(bot: IBot, dataPath: string): void {
        this._link = require('./../../package.json').repository.url
    }

    public isValid(msg: string): boolean { return false }

    public async process(msg: string, answer: IBotMessage): Promise<void> { }
}