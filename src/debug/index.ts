import blurp from '../';

const { transforms } = blurp;

const logger = blurp.createLogger('other', {

  transports: [

    new blurp.ConsoleTransport({

      transforms: [
        transforms.stack.console({
          timestamp: true,
          level: {
            pad: true,
            case: 'upper'
          },
          label: true,
          errorify: 'detailstack'
        })
      ]

    }),

    new blurp.FileTransport({

      transforms: [
        transforms.stack.file({
          timestamp: true,
          label: true
        })
      ]

    })

  ]

});

logger.error('some warning.')
