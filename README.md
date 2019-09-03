# Blurp

Fast, flexible stream based Logger using extendable Transports.

## Why Blurp?

In short code help. If using VS Code for example the code help is quite good. If you are a [Typescript](https://www.typescriptlang.org/) fan you will particularly appreciate the care that's been taken for accurate typings. Comments are detailed and building Transform parsers for various outputs are quite flexible.

## Installation

```sh
npm install blurp
```

## Usage

The easiest way to use **blurp** is to use the default logger instance. 

By default the following log levels are enabled:

> fatal, error, warn, info, debug, trace

```ts
import blurp from 'blurp';
blurp.log('hello blurp');
```

## Loggers

Beyond the default Logger you can create new Loggers as well as Child Loggers which allow the creation of Loggers using a parent but with injected metadata making the querying of logs more comprehensive.

### Create a Logger

The below will create a Logger labled **"syslog"** using standard syslog levels. We add the ConsoleTransport and the pre-bundled Transform stack **console** to build our message.

```ts
import blurp, { transforms } from 'blurp';
const syslog = blurp.createLogger('express', {
  level: 'warning',
  levels: ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'],
  transports: [
    new ConsoleTransport()
  ],
  transforms: [
    transforms.stack.console()
  ]
});

syslog.warn('My name is %s', 'John', { age: 33 });
```

The above, using the **console()** Transform will output the following:

```sh
16:57:15.1 WARN: default: My name is John age: 33
```

### Child Loggers

Child Loggers are simply Loggers that share all of its parent settings but insert meta data or you might think of them as flags for each logged method.

```ts
const child = blurp.child({ module: 'user' });
child.warn('My name is %s', 'John', { age: 33 });
// "module" is added as metadata automatically 
// on each logged message.
{
  level: "warn", 
  message: "My name is John", 
  age: 33, 
  module: "user"
}
```

## Transports

One of the main reasons to use a Logger such as **blurp** is that it uses Transports. Transports allow a single logged message to be output to muliple destinations automatically. All with unique transforms (formatting) and destinations.

Blurp has two common built in Transports as follows:

> ConsoleTransport, FileTransport

### Custom Transports

To create a custom Transport import the base Transport class and extend.

```ts
import { Transport } from 'blurp';

class MyTransport extends Transport {

  constructor(options) {
    super('my-transport-name', options);
  }

  log(payload: IPayload<L>, cb: Callback) {

  const { [SOURCE]: source, [OUTPUT]: output } = payload;
  console.log(output);

  cb();

  }

}
```

**Same as above but using Typescript**

```ts
import { Transport } from 'blurp';

interface IMyTransportOptions<L extends string> extends ITransportOptions<L> {
  // your options here
}

const DEFAULTS: IMyTransportOptions<any> = {
  // defaults here
};

class MyTransport<L extends string> extends Transport<L, IMyTransportOptions<L>> {

  constructor(options?: IMyTransportOptions<L>) {
    super('my-transport-name', { ...DEFAULTS, ...options });
  }

  log(payload: IPayload<L>, cb: Callback) {
    const { [SOURCE]: source, [OUTPUT]: output } = payload;
    console.log(output);
    cb();
  }

}
```

## Log Payload (Object)

To understand how **blurp** works it is necessary to understand how each log message is bundled into its payload object.

**I know how it goes, no one closely reads these things but please read the following closely, it will pay off!**

### ILogPayload<L> (Typescript Interface Name)

If not using Typescript it is not necessary to remember the above interface name, just there to make more sense of things for Typescript users. Before explaining the payload let's take a quick look at one.

**Basic Payload**

```js
const payload = {
  [CONFIG]: {
    label: 'default',
    levels: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    colors: {
      fatal: ['bgRed', 'yellow'],
      error: ['red', 'bold'],
      warn: 'yellow',
      info: 'cyan',
      debug: 'magenta',
      trace: 'blue'
    },
    elapsed: 1000
  }
  [SOURCE]: {
    level: 'info',
    message: 'Some log message'
  }
  [OUTPUT]: 'info Some log message' // example if using .console() Transform on ConsoleTransport
  level: 'info',
  message: 'Some log message'
}
```

### Payload [CONFIG]

Each payload contains an object decorated by a Symbol. Why a Symbol? Symbols won't be enumerated when outputing the payload object in say pretty print. However they allow us to add the info we need on a single object that our Transforms may need.

You may wonder if our Logger knows of it's log levels why attach in the payload? Our Transforms would need the log levels passed in order to use the colors you've already defined. Hence adding the handful of basic properties is quite helpful and simplifies our Transform methods.

### Payload [SOURCE]

Why duplicate the source of the primary payload properites? These properties are READ ONLY and are used for checking original values that have not been mutated. For example say you want your log levels to display in uppercase with ansi colors, that would render using the <code>payload.level</code> useless for checking the log payload's current level. The same goes for other properties.

### Payload [OUTPUT]

The output key is a string value that is to be used as the final output value. This value is set by returning the value from a **Format Transform**. More on that below. The output property is always a string as it is used to log to a console, or to write to a file such as JSON or perhaps in a PUT/POST to a server.

### Payload Default Properties

There are only TWO default properties. **level & message**. Every other property must be extended by you using a custom Transform or using one of the built in helper Transforms. This is by design and makes **blurp** far less opinionated. 

## Transforms

Transforms are simple functions that can be combined that manipulate your log payload **(shown above)** formatting it to the desired output for your Transport.

There are two basic forms of Transforms:

> Modifier, Format

There is a third form of sorts called a **Stack**. Ultimately it is a Format Transform but a stack merely combines multiple modifier and format Transforms to create a singular method for all internally bundled Transforms.

### Modifier Transform

Although there's a built in sort Transform we'll use it to illustrate how simple it is to create it. A modifier Transform does exactly what it sounds like. It modifies the payload object then returns the modified payload object to continue down the stack.

```ts
const options = {
  props: ['timestamp', 'level', 'message']
};
function sortTransform(payload, options?) {

  // Let's get any props not defined in our options, we'll append them.
  const remainingProps = Object.keys(payload).filter(k => !options.props.includes(k));

  // Append our remaining props.
  const props = [...options.props, ...remainingProps];

  // Reduce into new ordered object and then 
  // return the newly ordered Payload for next Transform
  return props.reduce((sorted, prop) => {
    sorted[prop] = payload[prop];
    return sorted;
  }, {});

}
```

**see /src/transforms/modifiers/sort.ts** - for creating this Transform in Typescript.

### Format Transform

Format Transforms format the log payload for final output. Unlike modifier Transforms instead of returning the payload object, they return a string value that automatically gets set to the **[OUTPUT]** property key in the payload.

```ts
import { inspect } from 'util';
const options = {
  colorize: true
};
function prettyFormat(payload, options?) {
  return inspect(payload, null, null, options.colorize);
}
```

**see /src/transforms/formats/pretty.ts** - for creating this Transform in Typescript.

### Using Custom Transform

To use the transform we need to call a special method that wraps for use with blurp.

```ts
const sort = blurp.createModifier(sortTransform);
const pretty = blurp.createFormatter(prettyFormat);
```

Now that each Transform is wrapped we can use them and even combine them into a single method!

```ts
// Duplicate of above here so you it all together.
const { combine } = blurp;
const sort = blurp.createModifier(sortTransform);
const pretty = blurp.createFormatter(prettyFormat);

// Call our Transforms passing in any options.
const combined = combine(
  sort(),
  pretty({ colorize: false })
);

const logger = blurp.createLogger('app', {
  transports: [
    new ConsoleTransport()
  ],
  transforms: [
    combined
  ]
})
```

## Errors & Rejections

Blurp can automatically handle **uncaughtException** and **uncaughtRejection** errors on the Node process. Simply pass <code>{ exceptions: true, rejections: true }</code> in your options when initializing the Logger or add to an existing Logger as shown below:

```ts
const consoleTransport = blurp.transports.get('console');
blurp.exceptions.handle(consoleTransport);
```

## Streaming All Transports (Firehose)

It is possible to stream activity on all Transports. To do this we use the **firehose**. 

```ts
blurp.firehose(); // bind to all Transports.

const options {
  // your opts to pass to each
  // Transport.firehose() method.
};
blurp.firehose(options, 'console', 'file'); // bind w/ options to ONLY console and file.
```

## Query Logs

Each Transport can create a <code>.query()</code> method which allows the parent Logger to bind to it for querying previous logs. Much like the Transport itself you will need to define how this is to happen. That said there are some helpers that make the heavy lifting a little easier.

**NOTE** Some additional filtering capabilities beyond the below will be available soon!

```ts
const options = {
  timestampKey: 'ts',        // key containing timestamps.
  level: undefined,          // the level to query (default: undefined or all levels)
  from: undefined,           // including this date (default: previous 24 hrs from now)         
  to: undefined,             // including this date (default: Date.now())      
  limit: 10,                 // max rows (0 = unlimited)                  
  start: 0,                  // starting row by 0 index          
  sort: 'desc',              // ascending or descending order.
  transform: JSON.parse      // parse each row using JSON.parse.
};
const query = blurp.query(options);
```

**The above creates the query instance. This makes queries reusable. Let's get the results.**

```ts
// Example results object
const results = {
  queried: 10,      // total number queried.
  success: 8,       // the total successfully matched.
  skipped: 2,       // how many were skipped didn't match criteria.
  rows: [],         // your parsed rows will be here.
  filtered: [],     // coming soon!
  errors: [],       // Errors are defined as tuples [transform.label, error]
  show: Function    // helper function to show the resutls in terminal/console.
};

const query = blurp.query(options);

// Get results and show in console.
query.exec((results) => {
  results.show(); // or query.show();
});
```

**Same as above but with async/await**

```ts
async function queryLogs() {
  const query = blurp.query(options);
  const results = await query.exec();
  // Do something with results.
}
```

**Same as above but as a Promise**

```ts
const query = blurp.query(options);
query.exec().then(results => {
  // do something.
});
```

## What's Missing?

A lot unfortunately. As time permits we'll improve the Readme and create real docs.

## Tests

Tests are coming and are for sure needed. This lib will be used in a production app so they are coming to make at a min us warm and fuzzy ha ha.

## License

See [LICENSE.md](LICENSE)
