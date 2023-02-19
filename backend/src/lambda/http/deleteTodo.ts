import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const userId = getUserId(event)
    await deleteTodo(userId, todoId)
    
    return{
      statusCode: 204,
      body: ''
    }
  }
)

handler.use(
    cors({
      credentials: true
    })
  )
  