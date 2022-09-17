export type KeysOfType<Type, KeyType> = Extract<keyof Type, KeyType>
export type StringKeys<Type> = KeysOfType<Type, string>
export type NumberKeys<Type> = KeysOfType<Type, number>
export type SymbolKeys<Type> = KeysOfType<Type, symbol>
