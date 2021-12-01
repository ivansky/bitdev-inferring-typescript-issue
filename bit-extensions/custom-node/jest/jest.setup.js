import { configure } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
// set a default Timezone.
process.env.TZ = 'GMT';

// set custom test id
configure({
  testIdAttribute: 'data-id',
});

// @sinonjs/fake-timers will be used as implementation
// will be the default behavior in Jest 27.
// @see https://jestjs.io/docs/en/jest-object#jestusefaketimersimplementation-modern--legacy
// jest.useFakeTimers('modern');
// should be defined in config: timers
