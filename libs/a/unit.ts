import {
  InferServerSideUnitResult,
  ServerSideUnit,
  ServerSideUnitRef,
} from '@ivanmar/libs.ssp-units';
import type { IAa } from '@ivanmar/libs.aa';

export const aRef = new ServerSideUnitRef<
  InferServerSideUnitResult<typeof aUnit>
>(`a`);

// resolve cycle typescript dependency
const ref = aRef as ServerSideUnitRef<any>;

export const aUnit = ServerSideUnit.createServerSideUnit(
  null,
  async ctx => {
    function someAFn(): IAa {
      return {
        a: 'a',
      };
    }

    return {
      props: {
        a: someAFn,
      },
    };
  },
  ref
);
