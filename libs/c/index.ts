import {
  InferServerSideUnitResult,
  ServerSideUnit,
  ServerSideUnitRef,
} from '@ivanmar/libs.ssp-units';
import { aRef } from '@ivanmar/libs.a';
import { bRef } from '@ivanmar/libs.b';

export const cRef = new ServerSideUnitRef<
  InferServerSideUnitResult<typeof cUnit>
>(`b`);

// resolve cycle typescript dependency
const ref = cRef as ServerSideUnitRef<any>;

export const cUnit = ServerSideUnit.createServerSideUnit(
  [aRef, bRef],
  async (ctx, a, b) => {
    console.log(a.props.a, b.props.b);

    return {
      props: {
        c: 'cany_another',
      },
    };
  },
  ref
);
