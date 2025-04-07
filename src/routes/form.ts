import { FastifyInstance } from 'fastify'
import { Form, Prisma } from '@prisma/client'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'

interface CreateFormBody {
  name: string;
  fields: Prisma.InputJsonValue;
}

async function formRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formRoutes' })

  // ENDPOINT 1: Create a form
  app.post<{
    Body: CreateFormBody
    Reply: Form
  }>('/', {
    async handler(req, reply) {
      const { body } = req
      log.debug('create form')
      try {
        const form = await prisma.form.create({
          data: {
            name: body.name,
            fields: body.fields
          }
        })
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create form', 400)
      }
    },
  })

  // ENDPOINT 2: Fetch a form by ID
  app.get<{
    Params: IEntityId
    Reply: Form
  }>('/:id', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get form by id')
      try {
        const form = await prisma.form.findUniqueOrThrow({ where: { id } })
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch form', 400)
      }
    },
  })

  // ENDPOINT 3: Fetch all forms
  app.get<{
    Reply: Form[]
  }>('/', {
    async handler(req, reply) {
      log.debug('get all forms')
      try {
        const forms = await prisma.form.findMany()
        reply.send(forms)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch forms', 400)
      }
    },
  })
}

export default formRoutes
