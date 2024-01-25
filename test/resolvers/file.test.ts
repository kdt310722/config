import { describe, expect, it, vi } from 'vitest'
import { FileResolver } from '../../src'

vi.mock('fs', () => ({
    readFileSync: (path: string) => path,
    existsSync: (path: string) => {
        return !path.includes('not-exists')
    },
}))

vi.mock('@kdt310722/utils/node', () => ({
    isReadable: (path: string) => {
        return !path.includes('not-readable')
    },
}))

class TestFileResolver extends FileResolver {
    protected parse(content: string): any {
        if (content.includes('throw')) {
            throw new Error('Test')
        }

        if (content.includes('invalid')) {
            return 'invalid'
        }

        return { success: true }
    }

    protected isValidPath(path: string) {
        return path !== 'invalid'
    }
}

describe('getConfigPath', () => {
    it('should using default path key when no options is provided', () => {
        expect(new TestFileResolver()['getConfigPath']({ configPath: 'foo' })).toBe('foo')
    })

    it('should using default path key when pathKey option set to true', () => {
        expect(new TestFileResolver({ pathKey: true })['getConfigPath']({ configPath: 'foo' })).toBe('foo')
    })

    it('should using path option when pathKey option set to false', () => {
        expect(new TestFileResolver({ path: 'bar', pathKey: false })['getConfigPath']({ configPath: 'foo' })).toBe('bar')
    })

    it('should using custom path key', () => {
        expect(new TestFileResolver({ pathKey: 'bar' })['getConfigPath']({ bar: 'foo' })).toBe('foo')
    })

    it('should using path option when pathKey is not contains in resolved config', () => {
        expect(new TestFileResolver({ path: 'bar' })['getConfigPath']({ foo: 'foo' })).toBe('bar')
    })

    it('should return undefined when pathKey is not contains in resolved config and path option is not provided', () => {
        expect(new TestFileResolver()['getConfigPath']({ foo: 'foo' })).toBeUndefined()
    })
})

describe('parseConfigPath', () => {
    it('should throw error when failed to parse config file', () => {
        expect(() => new TestFileResolver()['parseConfigPath']('throw')).toThrow()
    })

    it('should return config object when path is valid', () => {
        expect(new TestFileResolver()['parseConfigPath']('foo.json')).toEqual({ success: true })
    })
})

describe('resolve', () => {
    it('should return empty object when path is not provided', () => {
        expect(new TestFileResolver().resolve({})).toEqual({})
    })

    it('should return empty object when path is not valid', () => {
        expect(new TestFileResolver({ path: 'invalid' }).resolve({})).toEqual({})
    })

    it('should return empty object when is not exists', () => {
        expect(new TestFileResolver({ path: 'not-exists.json' }).resolve({})).toEqual({})
    })

    it('should return empty object when is not readable', () => {
        expect(new TestFileResolver({ path: 'not-readable.json' }).resolve({})).toEqual({})
    })

    it('should throw error when not an object', () => {
        expect(() => new TestFileResolver({ path: 'invalid.json' }).resolve({})).toThrow()
    })

    it('should return config object when path is valid', () => {
        expect(new TestFileResolver({ path: 'foo.json' }).resolve({})).toEqual({ success: true })
    })
})
