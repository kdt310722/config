import type { AnyObject } from '@kdt310722/utils/object'

export abstract class Resolver {
    public abstract resolve(resolved: AnyObject): AnyObject
}
