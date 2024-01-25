import type { AnyObject } from '@kdt310722/utils/object'
import minimist, { type Opts } from 'minimist'
import { UnflattenResolver, type UnflattenResolverOptions } from './unflatten'

export interface ArgvResolverOptions extends Opts, UnflattenResolverOptions {
    argv?: string[]
}

export class ArgvResolver extends UnflattenResolver {
    protected readonly argv: string[]

    public constructor(protected readonly options: ArgvResolverOptions = {}) {
        super(options)

        this.argv = options.argv ?? process.argv.slice(2)
        this.addExcludeCamelCaseKey('_')
        this.addExcludeCamelCaseKey('--')
    }

    protected getConfig(): AnyObject {
        return minimist(this.argv, this.options)
    }
}
