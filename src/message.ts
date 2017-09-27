import { RichEmbed } from 'discord.js'
import { IBotMessage } from './api'

export class BotMessage implements IBotMessage {
    public richText?: RichEmbed
    public text?: string

    public setTextOnly(text: string): IBotMessage {
        if (this.richText) { throw new Error('one of rich text methods was used') }
        this.text = text
        return this
    }

    public addField(name: string, value: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().addField(name, value)
        return this
    }

    public addBlankField(): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().addBlankField()
        return this
    }

    public setColor(color: string | number | [number, number, number]): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setColor(color)
        return this
    }

    public setDescription(description: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setDescription(description)
        return this
    }

    public setFooter(text: string, icon?: string | undefined): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setFooter(text, icon)
        return this
    }

    public setImage(url: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setImage(url)
        return this
    }

    public setThumbnail(url: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setThumbnail(url)
        return this
    }

    public setTitle(title: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setTitle(title)
        return this
    }

    public setURL(url: string): IBotMessage {
        if (this.text) { throw new Error('setTextOnly method was used') }
        this.validateRichText().setURL(url)
        return this
    }

    private validateRichText(): RichEmbed {
        if (!this.richText) { this.richText = new RichEmbed() }
        return this.richText
    }
}