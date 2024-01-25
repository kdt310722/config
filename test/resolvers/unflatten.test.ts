import type { AnyObject } from '@kdt310722/utils/object'
import { describe, expect, it } from 'vitest'
import { UnflattenResolver } from '../../src'

class TestResolver extends UnflattenResolver {
    protected getConfig(resolved: AnyObject) {
        return { test_key: true, ...resolved }
    }
}

describe('addExcludeCamelCaseKey', () => {
    it('can add exclude key from camel case', () => {
        const resolver = new TestResolver()

        resolver['addExcludeCamelCaseKey']('test_key')
        expect(resolver['excludeCamelCaseKeys']).toEqual(['test_key'])
    })
})

describe('getKeyTransformer', () => {
    it('should do nothing if unflatten is false', () => {
        expect(new TestResolver({ unflatten: false })['getKeyTransformer']({})).toBeUndefined()
    })

    it('should do nothing if camelCase is false', () => {
        expect(new TestResolver({ unflatten: { camelCase: false } })['getKeyTransformer']({})).toBeUndefined()
    })

    it('should transform key to camel case', () => {
        expect(new TestResolver()['getKeyTransformer']({})?.('test_key')).toBe('testKey')
    })

    it('should combine camel case and transformKey option', () => {
        expect(new TestResolver()['getKeyTransformer']({ transformKey: (key) => `${key}__` })?.('test_key')).toBe('testKey__')
    })

    it('should exclude key from camel case', () => {
        const resolver = new TestResolver({ unflatten: { camelCase: { exclude: ['test_key'] } } })

        resolver['addExcludeCamelCaseKey']('test_key_2')

        expect(resolver['getKeyTransformer']({})?.('test_key')).toBe('test_key')
        expect(resolver['getKeyTransformer']({})?.('test_key_2')).toBe('test_key_2')
    })

    it('should transform key to camel case with locale', () => {
        expect(new TestResolver({ unflatten: { camelCase: { locale: 'tr' } } })['getKeyTransformer']({})?.('test_key')).toBe('testKey')
    })
})

describe('resolve', () => {
    it('should return config if unflatten option is false', () => {
        expect(new TestResolver({ unflatten: false }).resolve({})).toEqual({ test_key: true })
    })

    it('should return unflattened config', () => {
        expect(new TestResolver().resolve({})).toEqual({ testKey: true })
    })

    it('should return unflattened config when unflatten option is true', () => {
        expect(new TestResolver({ unflatten: true }).resolve({})).toEqual({ testKey: true })
    })

    it('should return unflattened config including array', () => {
        expect(new TestResolver().resolve({ 'test_key_2.0': true })).toEqual({ testKey: true, testKey2: [true] })
    })
})
