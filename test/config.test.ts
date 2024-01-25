import type { AnyObject } from '@kdt310722/utils/object'
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import { ZodError, z } from 'zod'
import type { ConfigSchema } from '../src'
import { Config, Resolver } from '../src'

interface ConfigTestContext {
    schema: ConfigSchema
    config: Config
}

const noopResolver = class extends Resolver {
    public constructor(protected readonly value: AnyObject) {
        super()
    }

    public resolve() {
        return this.value
    }
}

beforeEach<ConfigTestContext>((context) => {
    context.schema = { a: z.string(), b: z.number() }
    context.config = new Config(context.schema)
})

describe('resolvers', () => {
    it('can initialize with resolvers', () => {
        const resolver = new noopResolver({})
        const config = new Config({}, { resolvers: [resolver] })

        expect(config['resolvers']).toContainEqual(resolver)
    })

    it('can add resolver', () => {
        const resolver = new noopResolver({})
        const config = new Config({}).addResolver(resolver)

        expect(config['resolvers']).toContainEqual(resolver)
    })

    it('should not add duplicate resolver', () => {
        const resolver = new noopResolver({})
        const config = new Config({}, { resolvers: [resolver] }).addResolver(resolver).addResolver(resolver)

        expect(config['resolvers']).toHaveLength(1)
    })

    it<ConfigTestContext>('can resolve config', ({ config }) => {
        config.addResolver(new noopResolver({ test1: 'test' }))
        config.addResolver(new noopResolver({ test2: 'test 2' }))

        expect(config.resolve()).toStrictEqual({ test1: 'test', test2: 'test 2' })
    })

    it<ConfigTestContext>('should throw valid error when resolver fails', ({ config }) => {
        const resolver = class extends Resolver {
            public resolve(): never {
                throw new Error('test')
            }
        }

        expect(() => config.addResolver(new resolver()).resolve()).toThrowError('Failed to resolve config')
    })
})

describe('parse', () => {
    it('should return valid type', () => {
        const resolver = new noopResolver({ a: 1 })
        const config = new Config({ a: z.number() }).addResolver(resolver)

        expectTypeOf(config.parse()).toEqualTypeOf<{ a: number }>()
    })

    it('can parse config', () => {
        const resolver = new noopResolver({ a: 1 })
        const config = new Config({ a: z.number() }).addResolver(resolver)

        expect(config.parse()).toStrictEqual({ a: 1 })
    })

    it('should throw valid error when resolved config is invalid', () => {
        const resolver = new noopResolver({ b: 1 })
        const config = new Config({ a: z.number() }).addResolver(resolver)

        expect(() => config.parse()).toThrowError('Failed to parse config')
    })

    it('should not format error', () => {
        const resolver = new noopResolver({ b: 1 })
        const config = new Config({ a: z.number() }, { formatError: false }).addResolver(resolver)

        const getError = (): Error => {
            try {
                config.parse()

                return new Error('No error')
            } catch (error) {
                return error as Error
            }
        }

        expect(getError().cause).toBeInstanceOf(ZodError)
    })
})
