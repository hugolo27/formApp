import fastify from 'fastify'

import formRoutes from './routes/form'
import sourceRecordRoutes from './routes/source-record'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(formRoutes, { prefix: '/forms' })
  app.register(sourceRecordRoutes, { prefix: '/source-records' })

  app.setErrorHandler(errorHandler)

  return app
}

export default build
