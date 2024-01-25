import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { isZodError, searchConfigPath } from '../src'

vi.mock('fs', () => ({
    existsSync: (path: string) => !path.includes('not-exists'),
}))

describe('isZodError', () => {
    it('should return true if the error is a ZodError', () => {
        expect(isZodError(z.string().safeParse(1)['error'])).toBe(true)
    })

    it('should return false if the error is not a ZodError', () => {
        expect(isZodError('string')).toBe(false)
        expect(isZodError(new Error('test'))).toBe(false)
    })
})

describe('searchConfigPath', () => {
    it('should return path if the file exists', () => {
        expect(searchConfigPath({ name: 'test', extensions: ['.json'], cwd: '.' })).toBe('test.json')
    })

    it('should return undefined if the file does not exist', () => {
        expect(searchConfigPath({ name: 'not-exists', extensions: ['.json'] })).toBe(void 0)
    })
})
