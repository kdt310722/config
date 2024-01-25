import { type JsonDeserializer, parseJson } from '@kdt310722/utils/json'
import { FileResolver, type FileResolverOptions } from './file'

export interface JsonResolverOptions extends FileResolverOptions {
    deserializers?: JsonDeserializer | JsonDeserializer[]
}

export class JsonResolver extends FileResolver {
    public constructor(protected override readonly options: JsonResolverOptions = {}) {
        super(options)
    }

    protected parse(content: string) {
        return parseJson(content, this.options.deserializers)
    }

    protected isValidPath(path: string) {
        return /\.json[5c]?$/.test(path)
    }
}
