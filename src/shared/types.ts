export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

export type FormMode = 'edit' | 'create'
