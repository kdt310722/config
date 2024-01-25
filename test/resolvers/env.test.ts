import { beforeEach, describe, expect, it } from 'vitest'
import { EnvResolver } from '../../src'

beforeEach(() => {
    process.env = { a: '1', TEST_B: '2' }
})

describe('getConfig', () => {
    it('should return all env variables when prefix is not set', () => {
        expect(new EnvResolver()['getConfig']()).toEqual(process.env)
    })

    it('should return all env variables when prefix is empty', () => {
        expect(new EnvResolver({ prefix: '' })['getConfig']()).toEqual(process.env)
    })

    it('should return only env variables with prefix', () => {
        expect(new EnvResolver({ prefix: 'TEST_', trimPrefix: false })['getConfig']()).toEqual({ TEST_B: '2' })
    })

    it('should return only env variables with prefix and trim prefix', () => {
        expect(new EnvResolver({ prefix: 'TEST_', trimPrefix: true })['getConfig']()).toEqual({ B: '2' })
    })
})
