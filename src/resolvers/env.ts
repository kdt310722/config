import { type AnyObject, filter, map, resolveNestedOptions } from '@kdt310722/utils/object'
import { hasPrefix, stripPrefix } from '@kdt310722/utils/string'
import { UnflattenResolver, type UnflattenResolverOptions } from './unflatten'

export interface EnvResolverOptions extends UnflattenResolverOptions {
    env?: AnyObject
    prefix?: string
    trimPrefix?: boolean
}

export class EnvResolver extends UnflattenResolver {
    protected readonly env: NodeJS.ProcessEnv
    protected readonly prefix?: string
    protected readonly trimPrefix: boolean

    public constructor(options: EnvResolverOptions = {}) {
        const unflattenOptions = resolveNestedOptions(options.unflatten ?? {})

        super({ ...options, unflatten: unflattenOptions ? { delimiter: '__', ...unflattenOptions } : false })

        this.env = options.env ?? process.env
        this.prefix = options.prefix
        this.trimPrefix = options.trimPrefix ?? true
    }

    protected getConfig() {
        const prefix = this.prefix

        if (!prefix?.length) {
            return this.env
        }

        const config = filter(this.env, (key) => hasPrefix(String(key), prefix))

        if (this.trimPrefix) {
            return map(config, (key, value) => [stripPrefix(String(key), prefix), value])
        }

        return config
    }
}
