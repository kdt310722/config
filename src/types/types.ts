export type Primitive = string | number | bigint | boolean | Date | null | undefined

export type PrimitiveArray = Primitive[] | PrimitiveObject[] | PrimitiveSet[] | PrimitiveMap[] | PrimitiveArray[]

export type PrimitiveSet = Set<Primitive | PrimitiveArray | PrimitiveObject | PrimitiveMap | PrimitiveSet>

export type PrimitiveObject = {
    [key: string]: Primitive | PrimitiveArray | PrimitiveSet | PrimitiveMap | PrimitiveObject
}

export type PrimitiveMap = Map<string, Primitive | PrimitiveArray | PrimitiveSet | PrimitiveObject | PrimitiveMap>
