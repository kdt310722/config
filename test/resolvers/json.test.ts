import { describe, expect, it } from 'vitest'
import { JsonResolver } from '../../src'

describe('isValidPath', () => {
    it('should return true when path is valid', () => {
        expect(new JsonResolver()['isValidPath']('foo.json')).toBeTruthy()
        expect(new JsonResolver()['isValidPath']('foo.json5')).toBeTruthy()
        expect(new JsonResolver()['isValidPath']('foo.jsonc')).toBeTruthy()
    })

    it('should return false when path is not valid', () => {
        expect(new JsonResolver()['isValidPath']('foo')).toBeFalsy()
        expect(new JsonResolver()['isValidPath']('foo.json1')).toBeFalsy()
        expect(new JsonResolver()['isValidPath']('foo.jsonx')).toBeFalsy()
    })
})

describe('parse', () => {
    it('can parse JSON string', () => {
        expect(new JsonResolver()['parse']('{ test: true }')).toEqual({ test: true })
    })
})
