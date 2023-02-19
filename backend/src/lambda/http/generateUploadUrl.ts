import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createImagePresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const url = await createImagePresignedUrl(userId, todoId)
    

    return{
      statusCode:201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler.use(
    cors({
    credentials: true
    })
)