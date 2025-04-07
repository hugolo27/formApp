import { FastifyInstance } from 'fastify'
import { SourceRecord, SourceData } from '@prisma/client'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'

interface CreateSourceRecordBody {
  formId: string;
  answers: {
    fieldId: string;
    value: string;
  }[];
}

async function sourceRecordRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)
  const log = app.log.child({ component: 'sourceRecordRoutes' })

  // ENDPOINT 3: Create a source record
  app.post<{
    Body: CreateSourceRecordBody
    Reply: { sourceRecord: SourceRecord; sourceData: SourceData[] }
  }>('/', {
    async handler(req, reply) {
      const { body } = req
      log.debug('create source record')
      try {
        // First verify that the form exists
        const form = await prisma.form.findUniqueOrThrow({
          where: { id: body.formId }
        });

        // Create the source record
        const sourceRecord = await prisma.sourceRecord.create({
          data: {
            formId: body.formId
          }
        });

        // Create the source data entries
        const sourceData = await prisma.sourceData.createMany({
          data: body.answers.map(answer => ({
            question: answer.fieldId,
            answer: answer.value,
            sourceRecordId: sourceRecord.id
          }))
        });

        // Fetch the created source data
        const createdSourceData = await prisma.sourceData.findMany({
          where: { sourceRecordId: sourceRecord.id }
        });

        reply.send({ sourceRecord, sourceData: createdSourceData });
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create source record', 400)
      }
    },
  })

  // ENDPOINT 2: Fetch source records by form ID
  app.get<{
    Params: { formId: string }
    Reply: { sourceRecords: (SourceRecord & { sourceData: SourceData[] })[] }
  }>('/form/:formId', {
    async handler(req, reply) {
      const { formId } = req.params
      log.debug('get source records by form id')
      try {
        // First verify that the form exists
        await prisma.form.findUniqueOrThrow({
          where: { id: formId }
        });

        // Fetch source records with their source data
        const sourceRecords = await prisma.sourceRecord.findMany({
          where: { formId },
          include: {
            sourceData: true
          }
        });

        reply.send({ sourceRecords });
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch source records', 400)
      }
    },
  })
}

export default sourceRecordRoutes 