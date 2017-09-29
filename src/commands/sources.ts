import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class SourcesCommand implements IBotCommand {
    private _link: string

    public help(): IBotCommandHelp {
        return { caption: 'Исходный код', description: this._link }
    }

    public init(bot: IBot): void {
        this._link = require('./../../package.json').repository.url
    }

    public test(msg: string): boolean { return false }
    public async run(msg: string, answer: IBotMessage): Promise<void> { }
}