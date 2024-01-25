import type { Resolver } from '../resolvers'

export class ResolveConfigError extends Error {
    public declare resolver: Resolver
}
