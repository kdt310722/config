import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { ZodError } from 'zod'

export function isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError || (error instanceof Error && error.name === 'ZodError')
}

export interface SearchConfigPathOptions {
    name: string
    extensions: string[]
    cwd?: string
}

export function searchConfigPath(options: SearchConfigPathOptions) {
    const { name, extensions, cwd = process.cwd() } = options

    for (const ext of extensions) {
        const path = join(cwd, `${name}${ext}`)

        if (existsSync(path)) {
            return path
        }
    }

    return void 0
}
