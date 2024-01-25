import { tap } from '@kdt310722/utils/function'
import { type AnyObject, resolveNestedOptions } from '@kdt310722/utils/object'
import { ZodObject } from 'zod'
import type { TypeOf, ZodTypeAny } from 'zod'
import { type FromZodErrorOptions, fromZodError } from 'zod-validation-error'
import { ParseConfigError, ResolveConfigError } from './errors'
import type { Resolver } from './resolvers'
import type { ConfigSchema } from './types'
import { isZodError } from './utils'

export interface ConfigOptions {
    resolvers?: Resolver[]
    formatError?: FromZodErrorOptions | boolean
}

export class Config<S extends ConfigSchema = Record<string, ZodTypeAny>> {
    protected readonly resolvers: Set<Resolver>
    protected readonly formatError: FromZodErrorOptions | false

    public constructor(public readonly schema: S, options: ConfigOptions = {}) {
        this.resolvers = new Set(options.resolvers)
        this.formatError = resolveNestedOptions(options.formatError ?? {})
    }

    public addResolver(resolver: Resolver) {
        this.resolvers.add(resolver)

        return this
    }

    public resolve() {
        const resolved: AnyObject = {}

        for (const resolver of this.resolvers) {
            try {
                Object.assign(resolved, resolver.resolve(resolved))
            } catch (error) {
                throw tap(new ResolveConfigError('Failed to resolve config', { cause: error }), (err) => {
                    err.resolver = resolver
                })
            }
        }

        return resolved
    }

    public parse(): TypeOf<ZodObject<S>> {
        const resolved = this.resolve()
        const result = ZodObject.create(this.schema).safeParse(resolved)

        if (!result.success) {
            throw tap(new ParseConfigError('Failed to parse config', { cause: this.formatParseError(result.error) }), (err) => {
                err.schema = this.schema
                err.resolvers = [...this.resolvers]
                err.resolved = resolved
            })
        }

        return result.data
    }

    protected formatParseError(error: Error) {
        if (this.formatError !== false && isZodError(error)) {
            return fromZodError(error, this.formatError)
        }

        return error
    }
}
