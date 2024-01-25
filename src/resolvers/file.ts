import { existsSync, readFileSync } from 'node:fs'
import { isReadable } from '@kdt310722/utils/node'
import { type AnyObject, isObject } from '@kdt310722/utils/object'
import { InvalidConfigFileError } from '../errors'
import { Resolver } from './resolver'

export interface FileResolverOptions {
    path?: string
    pathKey?: string | boolean
}

export abstract class FileResolver extends Resolver {
    public constructor(protected readonly options: FileResolverOptions = {}) {
        super()
    }

    public resolve(resolved: AnyObject) {
        const path = this.getConfigPath(resolved)

        if (!path || !this.isValidPath(path) || !existsSync(path) || !isReadable(path)) {
            return {}
        }

        const config = this.parseConfigPath(path)

        if (!isObject(config)) {
            throw new InvalidConfigFileError(path, 'Not an object')
        }

        return config
    }

    protected abstract parse(content: string, path: string): AnyObject

    protected abstract isValidPath(path: string): boolean

    protected parseConfigPath(path: string) {
        try {
            return this.parse(readFileSync(path, { encoding: 'utf8' }), path)
        } catch (error) {
            throw new InvalidConfigFileError(path, 'Failed to parse config file', { cause: error })
        }
    }

    protected getConfigPath(resolved: AnyObject): string | undefined {
        const pathKey = (this.options.pathKey === true ? undefined : this.options.pathKey) ?? 'configPath'

        if (pathKey === false) {
            return this.options.path
        }

        return resolved[pathKey] ?? this.options.path
    }
}
