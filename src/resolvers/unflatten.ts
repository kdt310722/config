import { type AnyObject, resolveNestedOptions } from '@kdt310722/utils/object'
import camelCase, { type Options } from 'camelcase'
import { type UnflattenOptions as BaseUnflattenOptions, unflatten } from 'flat'
import { Resolver } from './resolver'

export interface CamelCaseOptions extends Options {
    exclude?: string[]
}

export interface UnflattenOptions extends BaseUnflattenOptions {
    camelCase?: CamelCaseOptions | boolean
}

export interface UnflattenResolverOptions {
    unflatten?: UnflattenOptions | boolean
}

export abstract class UnflattenResolver extends Resolver {
    protected readonly unflattenOptions: UnflattenOptions | false
    protected readonly camelCaseOptions: CamelCaseOptions | false
    protected readonly excludeCamelCaseKeys: string[] = []

    public constructor(options: UnflattenResolverOptions = {}) {
        super()

        this.unflattenOptions = resolveNestedOptions(options.unflatten ?? {})
        this.camelCaseOptions = this.unflattenOptions === false ? false : resolveNestedOptions(this.unflattenOptions.camelCase ?? {})
    }

    public resolve(resolved: AnyObject): AnyObject {
        const config = this.getConfig(resolved)

        if (this.unflattenOptions === false) {
            return config
        }

        return unflatten(config, { ...this.unflattenOptions, transformKey: this.getKeyTransformer(this.unflattenOptions) })
    }

    protected abstract getConfig(resolved: AnyObject): AnyObject

    protected addExcludeCamelCaseKey(key: string) {
        this.excludeCamelCaseKeys.push(key)
    }

    protected getKeyTransformer(options: UnflattenOptions) {
        if (this.camelCaseOptions !== false) {
            const camelCaseOptions = { ...this.camelCaseOptions, locale: this.camelCaseOptions.locale ?? false }
            const exclude = new Set([...(camelCaseOptions.exclude ?? []), ...this.excludeCamelCaseKeys])

            return (key: string) => {
                if (!exclude.has(key)) {
                    key = camelCase(key, camelCaseOptions)
                }

                if (options.transformKey) {
                    key = options.transformKey(key)
                }

                return key
            }
        }

        return options.transformKey
    }
}
