import { describe, expect, it } from 'vitest'
import { ArgvResolver } from '../../src'

describe('getConfig', () => {
    it('should return an object', () => {
        expect(new ArgvResolver()['getConfig']()).toEqual({ _: [] })
    })
})
