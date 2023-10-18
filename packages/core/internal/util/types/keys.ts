export type KeyOfType<Type, KeyType> = Extract<keyof Type, KeyType>
export type StringKeyOf<Type> = KeyOfType<Type, string>
export type NumberKeyOf<Type> = KeyOfType<Type, number>
export type SymbolKeyOf<Type> = KeyOfType<Type, symbol>

export type KeyOfValueType<Type, ValueType> = {
  [Key in keyof Type]: Type[Key] extends ValueType ? Key : never
}[keyof Type]
