import type { DocumentOptions, ParseOptions, SchemaOptions, ToJSOptions } from 'yaml'
import { parse } from 'yaml'
import { FileResolver, type FileResolverOptions } from './file'

export type YamlResolverOptions = FileResolverOptions & ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions

export class YamlResolver extends FileResolver {
    public constructor(protected override readonly options: YamlResolverOptions = {}) {
        super(options)
    }

    protected parse(content: string) {
        return parse(content, this.options)
    }

    protected isValidPath(path: string) {
        return /\.ya?ml$/.test(path)
    }
}
