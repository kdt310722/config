import type { AnyObject } from '@kdt310722/utils/object'
import type { Resolver } from '../resolvers'
import type { ConfigSchema } from '../types'

export class ParseConfigError extends Error {
    public declare schema: ConfigSchema
    public declare resolvers: Resolver[]
    public declare resolved: AnyObject
}
