import { resolveNestedOptions } from '@kdt310722/utils/object'
import { Config, type ConfigOptions } from './config'
import { ArgvResolver, type ArgvResolverOptions, EnvResolver, type EnvResolverOptions, JsonResolver, type JsonResolverOptions, YamlResolver, type YamlResolverOptions } from './resolvers'
import type { ConfigSchema } from './types'
import { type SearchConfigPathOptions, searchConfigPath } from './utils'

export interface DefineConfigOption extends ConfigOptions {
    argv?: ArgvResolverOptions | boolean
    env?: EnvResolverOptions | boolean
    json?: JsonResolverOptions | boolean
    yaml?: YamlResolverOptions | boolean
    search?: Omit<SearchConfigPathOptions, 'extensions'> & { extensions?: string[] } | false
}

export function defineConfig<S extends ConfigSchema>(schema: S, options: DefineConfigOption = {}) {
    const { argv = true, env = true, json = true, yaml = true, search = false, ...configOptions } = options
    const argvOptions = resolveNestedOptions(argv)
    const envOptions = resolveNestedOptions(env)
    const jsonOptions = resolveNestedOptions(json)
    const yamlOptions = resolveNestedOptions(yaml)
    const searchOptions = resolveNestedOptions(search)

    const config = new Config(schema, configOptions)

    if (argvOptions) {
        config.addResolver(new ArgvResolver(argvOptions))
    }

    if (envOptions) {
        config.addResolver(new EnvResolver(envOptions))
    }

    if (jsonOptions || yamlOptions) {
        let path: string | undefined

        if (searchOptions) {
            path = searchConfigPath({
                ...searchOptions,
                extensions: [
                    ...(searchOptions.extensions ?? []),
                    ...(jsonOptions ? ['.json', '.jsonc', '.json5'] : []),
                    ...(yamlOptions ? ['.yaml', '.yml'] : []),
                ],
            })
        }

        if (jsonOptions) {
            config.addResolver(new JsonResolver({ ...jsonOptions, path: jsonOptions.path ?? path }))
        }

        if (yamlOptions) {
            config.addResolver(new YamlResolver({ ...yamlOptions, path: yamlOptions.path ?? path }))
        }
    }

    return config
}
