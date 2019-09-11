import {
  IPayload, TransformType, TransformResultCallback,
  FormatCallback, ModifierCallback, TransformCallback,
  OUTPUT,
  SOURCE
} from './types';

// CREATE & WRAP //

/**
 * Creates a transform callback handler for modifiers and formatters.
 * 
 * @param type the type of helper to be created.
 * @param fn the callback function to be executed.
 */
function createTransform<L extends string, O>(type: TransformType, fn: TransformCallback<L>) {

  return (options: O = {} as O) => {

    function wrapper(payload: IPayload<L>) {

      const result = {
        payload,
        errors: []
      };

      const applied = fn(payload, options);

      if ((applied as any) === false || typeof applied === 'undefined' ||
        applied === null || applied instanceof Error) {
        result.errors = [...result.errors, [fn.name, applied]];
      }

      else {

        if (type === 'format') {
          result.payload[OUTPUT] = applied as string;
        }
        else {
          result.payload = applied as IPayload<L>;
        }

      }

      return result;

    }

    // Bind name, type and options to funcion.
    wrapper._name = fn.name;
    wrapper._type = type;
    wrapper._options = options;

    return wrapper;

  };

}

/**
 * Creates a modifier callback wrapper.
 * 
 * @param fn the callback the Logger will call to transform the payload.
 */
export function createModifier<L extends string, O>(fn: ModifierCallback<L>) {
  return createTransform<L, O>('transform', fn);
}

/**
 * Creates a format callback wrapper.
 * 
 * @param fn the callback the Logger will call to format the result.
 */
export function createFormatter<L extends string, O>(fn: FormatCallback<L>) {
  return createTransform<L, O>('format', fn);
}

// UTILS //

/**
 * Expands callbacks by type.
 * 
 * @param stack the stack of transforms, formats and combined stacks to expand.
 */
function expand<L extends string>(stack: Array<TransformResultCallback<L>>) {

  return stack.reduce((result, fn) => {

    // If already combined flatten.
    // @ts-ignore
    if (fn._stack) {
      // @ts-ignore
      const flattened = expand(fn._stack);
      result.transforms = [...result.transforms, ...flattened.transforms];
      result.formats = [...result.formats, ...flattened.formats];
    }
    else {

      if (!fn._type)
        throw new Error(`Transform or format ${fn._name || 'unknown'} missing "_type" property, use "createTransform", "createFormat", "blurp.format()" or "blurp.transform()"`);

      else if (fn._type === 'transform')
        result.transforms.push(fn);

      else if (fn._type === 'format')
        result.formats.push(fn);
    }

    return result;

  }, { transforms: [], formats: [] });

}

/**
 * Combines callback functions into single function for convenience, creates & sorts stack.
 * Format _type is sorted to last.
 * 
 * @param stack the helper callback stack of functions to be combined.
 */
export function combine<L extends string>(...stack: Array<TransformResultCallback<L>>) {

  // Expand by type then flatten.
  const expanded = expand(stack);
  stack = [...expanded.transforms, ...expanded.formats] as Array<TransformResultCallback<L>>;

  function combineWrapper(payload: IPayload<L>) {

    const _result = stack.$reduceBreak((result, fn) => {

      const tmp = fn(result.payload);
      if (tmp.errors.length) {
        result.errors = [ ...result.errors, ...tmp.errors];
        return '--b' as any;
      }
      // Overwrite with new values.
      return { ...result, ...tmp };

    }, { payload, errors: [] });

    // Default output to message.
    let { [OUTPUT]: output, [SOURCE]: source } = _result.payload;
    const { err } = source;
    if (!output)
      output = err ? err.stack || err.message : _result.payload.message;
    _result.payload[OUTPUT] = output;

    return _result;

  }

  combineWrapper._stack = stack;

  return combineWrapper;

}
