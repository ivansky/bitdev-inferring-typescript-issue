import {
  InferServerSideUnitResult,
  ServerSideUnit,
  ServerSideUnitRef,
} from '@ivanmar/libs.ssp-units';
import { cRef } from '@ivanmar/libs.c';

export const dRef = new ServerSideUnitRef<
  InferServerSideUnitResult<typeof dUnit>
>(`b`);

// resolve cycle typescript dependency
const ref = dRef as ServerSideUnitRef<any>;

export const dUnit = ServerSideUnit.createServerSideUnit(
  [cRef],
  async (ctx, c) => {
    return {
      props: {
        d: c.props.c,
      },
    };
  },
  ref
);
