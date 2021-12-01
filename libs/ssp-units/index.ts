import { SortTreeNode, topologicalGroupedSort } from '@ivanmar/libs.topo-sort';

export interface IServerSideUnitResult<P = any> {
  props?: P;
}

export type InferServerSideFn<
  U extends ServerSideUnit<any> | ServerSideUnitRef<IServerSideUnitResult<any>>
> = U extends ServerSideUnit<infer F1>
  ? F1
  : U extends ServerSideUnitRef<infer F2>
  ? F2
  : never;

export type InferServerSideUnitResult<
  U extends ServerSideUnit<any> | ServerSideUnitRef<IServerSideUnitResult<any>>
> = U extends ServerSideUnit<(...args: any[]) => Promise<infer R>>
  ? R
  : U extends ServerSideUnitRef<infer R2>
  ? R2
  : never;

export type ServerSideUnitWithResult<R extends IServerSideUnitResult> =
  R extends IServerSideUnitResult<infer P>
    ? ServerSideUnit<(...args: any[]) => Promise<IServerSideUnitResult<P>>>
    : never;

export class ServerSideUnit<
  F extends (...args: any[]) => Promise<IServerSideUnitResult<any>>
> extends SortTreeNode<F, ServerSideUnit<any>> {
  private constructor(
    fn,
    deps,
    public readonly ref = new ServerSideUnitRef('unknown')
  ) {
    super(fn, deps);
  }

  static createServerSideUnit<
    F extends (ctx: any) => Promise<IServerSideUnitResult<any>>
  >(deps: null, fn: F, ref?: ServerSideUnitRef<any>): ServerSideUnit<F>;
  static createServerSideUnit<
    U0 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    F extends (
      ctx: any,
      u0: InferServerSideUnitResult<U0>
    ) => Promise<IServerSideUnitResult<any>>
  >(deps: [U0], fn: F, ref?: ServerSideUnitRef<any>): ServerSideUnit<F>;
  static createServerSideUnit<
    U0 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U1 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    F extends (
      ctx: any,
      u0: InferServerSideUnitResult<U0>,
      u1: InferServerSideUnitResult<U1>
    ) => Promise<IServerSideUnitResult<any>>
  >(deps: [U0, U1], fn: F, ref?: ServerSideUnitRef<any>): ServerSideUnit<F>;
  static createServerSideUnit<
    U0 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U1 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U2 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    F extends (
      ctx: any,
      u0: InferServerSideUnitResult<U0>,
      u1: InferServerSideUnitResult<U1>,
      u2: InferServerSideUnitResult<U2>
    ) => Promise<IServerSideUnitResult<any>>
  >(deps: [U0, U1, U2], fn: F, ref?: ServerSideUnitRef<any>): ServerSideUnit<F>;
  static createServerSideUnit<
    U0 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U1 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U2 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U3 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    F extends (
      ctx: any,
      u0: InferServerSideUnitResult<U0>,
      u1: InferServerSideUnitResult<U1>,
      u2: InferServerSideUnitResult<U2>,
      u3: InferServerSideUnitResult<U3>
    ) => Promise<IServerSideUnitResult<any>>
  >(
    deps: [U0, U1, U2, U3],
    fn: F,
    ref?: ServerSideUnitRef<any>
  ): ServerSideUnit<F>;
  static createServerSideUnit<
    U0 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U1 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U2 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U3 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    U4 extends
      | ServerSideUnit<any>
      | ServerSideUnitRef<IServerSideUnitResult<any>>,
    F extends (
      ctx: any,
      u0: InferServerSideUnitResult<U0>,
      u1: InferServerSideUnitResult<U1>,
      u2: InferServerSideUnitResult<U2>,
      u3: InferServerSideUnitResult<U3>,
      u4: InferServerSideUnitResult<U4>
    ) => Promise<IServerSideUnitResult<any>>
  >(
    deps: [U0, U1, U2, U3, U4],
    fn: F,
    ref?: ServerSideUnitRef<any>
  ): ServerSideUnit<F>;
  static createServerSideUnit(
    deps: readonly ServerSideUnit<any>[],
    fn: (...args: any[]) => Promise<IServerSideUnitResult<any>>,
    ref?: ServerSideUnitRef<any>
  ) {
    return new ServerSideUnit(fn, deps || undefined, ref);
  }
}

export class ServerSideUnitRef<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  R extends IServerSideUnitResult<any>
> {
  constructor(public readonly id: string) {}
}

export class ServerSideUnitsTree {
  readonly groups: ServerSideUnit<any>[][];

  private unitById = new WeakMap<
    ServerSideUnitRef<IServerSideUnitResult<any>>,
    ServerSideUnit<any>
  >();

  constructor(
    private units: ServerSideUnit<any>[],
    private initialProps: object = {}
  ) {
    // save units to map by reference
    units.forEach(unit => {
      this.unitById.set(unit.ref, unit);
    });

    // resolve references to units for each one
    units.forEach(unit => {
      unit.deps = unit.deps.map(dep => {
        if (dep instanceof ServerSideUnitRef) {
          const realUnit = this.unitById.get(dep);

          if (!realUnit) {
            throw `Could not find unit by reference '${dep.id}' for '${unit.ref.id}'`;
          }

          return realUnit;
        }

        return dep;
      });
    });

    this.groups = topologicalGroupedSort(units);
    this.run.bind(this);
  }

  async run(ctx: any): Promise<any> {
    const byIds = new WeakMap<
      ServerSideUnitRef<IServerSideUnitResult<any>>,
      IServerSideUnitResult<any>
    >();
    const byItself = new WeakMap<
      ServerSideUnit<any>,
      IServerSideUnitResult<any>
    >();

    for (const group of this.groups) {
      await Promise.all(
        group.map(unit => {
          return unit
            .value(
              ctx,
              ...unit.deps.map(dep => byItself.get(dep) || byIds.get(dep.ref))
            )
            .then(result => {
              byItself.set(unit, result);
              byIds.set(unit.ref, result);
              return result;
            });
        })
      );
    }

    const pageProps: any = {
      props: this.initialProps,
    };

    for (const unit of this.units) {
      const { props = {} } = byItself.get(unit) || byIds.get(unit.ref);

      Object.assign(pageProps.props, props || {});
    }

    pageProps.props = Object.fromEntries(
      Object.entries(pageProps.props).map(([key, value]) => {
        return [key, typeof value === 'function' ? value() : value];
      })
    );

    return pageProps;
  }
}

// const a = ServerSideUnit.createServerSideUnit(null, async function () {
//   return { payload: { some: 'a' } };
// });
//
// const u = ServerSideUnit.createServerSideUnit([a], async function (ctx, a) {
//   return {};
// });
