export type ConcreteConstructor<
  Args extends any[] = any[],
  Instance extends any = any
> = new (...args: Args) => Instance

export type AbstractConstructor<
  Args extends any[] = any[],
  Instance extends any = any
> = abstract new (...args: Args) => Instance

/**
 *  The type of an un-instantiated class.
 *
 *  Note that this allows for either an abstract or concrete constructor,
 *  so separate types are available for only those.
 */
export type Constructor<
  Args extends any[] = any[],
  Instance extends any = any
> = ConcreteConstructor<Args, Instance> | AbstractConstructor<Args, Instance>
