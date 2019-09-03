import blurp from '../';

function _customModifier(payload, options) {
  // modify the payload then return it.
  return payload;
}

function _customFormat(payload, options) {
  // Do something and return a string.
  return payload.message;
}

const customModifier = blurp.createModifier(_customModifier);
const customFormat = blurp.createFormatter(_customFormat);

// You can also combine the transforms.
const combined = blurp.combine(
  customModifier(),
  customFormat({ my: 'option' })
);

const logger = blurp.createLogger('app', {
  transports: [
    new blurp.ConsoleTransport()
  ],
  transforms: [
    customModifier(),
    customFormat({ my: 'option' })
    // OR combined (see const combined above)
  ]
});
