import {
  InferServerSideUnitResult,
  ServerSideUnit,
  ServerSideUnitRef,
} from '@ivanmar/libs.ssp-units';

export const aRef = new ServerSideUnitRef<
  InferServerSideUnitResult<typeof aUnit>
>(`a`);

// resolve cycle typescript dependency
const ref = aRef as ServerSideUnitRef<any>;

export const aUnit = ServerSideUnit.createServerSideUnit(
  null,
  async ctx => {
    return {
      props: {
        a: 'any_another',
      },
    };
  },
  ref
);
