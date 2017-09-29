export interface ILoggerMethod {
    (msg: string, ...args: any[]): void
    (obj: object, msg?: string, ...args: any[]): void
}

export interface ILogger {
    debug: ILoggerMethod
    info: ILoggerMethod
    warn: ILoggerMethod
    error: ILoggerMethod
}

export interface IBotConfig {
    token: string
    commands: string[]
    game?: string
}

export interface IBotCommandHelp {
    caption: string
    description: string
}

export interface IBot {
    readonly logger: ILogger
    getCommands(): IBotCommand[]
    start(logger: ILogger, config: IBotConfig, rootPath: string): void
}

export interface IBotCommand {
    help(): IBotCommandHelp
    init(bot: IBot): void
    test(msg: string): boolean
    run(msg: string, answer: IBotMessage): Promise<void>
}

type MessageColor =
    [number, number, number]
    | number
    | string

export interface IBotMessage {
    setTextOnly(text: string): IBotMessage
    addField(name: string, value: string): IBotMessage
    addBlankField(): IBotMessage
    setColor(color: MessageColor): IBotMessage
    setDescription(description: string): IBotMessage
    setFooter(text: string, icon?: string): IBotMessage
    setImage(url: string): IBotMessage
    setThumbnail(url: string): IBotMessage
    setTitle(title: string): IBotMessage
    setURL(url: string): IBotMessage
}