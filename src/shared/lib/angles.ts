import { z, type $brand } from 'zod'


export type Degrees = number & $brand<'Degrees'>
export type Radians = number & $brand<'Radians'>

/** Type cast. */
export const deg = (n: number): Degrees => n as Degrees
/** Type cast. */
export const rad = (n: number): Radians => n as Radians

export const degrees = z.number().brand<'Degrees'>()

export const degToRad = (d: Degrees): Radians => rad((d * Math.PI) / 180)
export const radToDeg = (r: Radians): Degrees => deg((r * 180) / Math.PI)

/** Угол вектора (dx, dy) в градусах. */
export const angleOf = (dy: number, dx: number): Degrees => radToDeg(rad(Math.atan2(dy, dx)))
