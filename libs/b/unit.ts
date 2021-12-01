import {
  InferServerSideUnitResult,
  ServerSideUnit,
  ServerSideUnitRef,
} from '@ivanmar/libs.ssp-units';
import { aRef } from '@ivanmar/libs.a';

export const bRef = new ServerSideUnitRef<
  InferServerSideUnitResult<typeof bUnit>
>(`b`);

// resolve cycle typescript dependency
const ref = bRef as ServerSideUnitRef<any>;

export const bUnit = ServerSideUnit.createServerSideUnit(
  [aRef],
  async (ctx, a) => {
    console.log(a);
    return {
      props: {
        b: 'bany',
      },
    };
  },
  ref
);
