import { describe, expect, it } from 'vitest'
import { YamlResolver } from '../../src'

describe('isValidPath', () => {
    it('should return true when path is valid', () => {
        expect(new YamlResolver()['isValidPath']('foo.yml')).toBeTruthy()
        expect(new YamlResolver()['isValidPath']('foo.yaml')).toBeTruthy()
    })

    it('should return false when path is not valid', () => {
        expect(new YamlResolver()['isValidPath']('foo')).toBeFalsy()
        expect(new YamlResolver()['isValidPath']('foo.json')).toBeFalsy()
        expect(new YamlResolver()['isValidPath']('foo.yxml')).toBeFalsy()
    })
})

describe('parse', () => {
    it('can parse YAML string', () => {
        expect(new YamlResolver()['parse']('test: true')).toEqual({ test: true })
    })
})
