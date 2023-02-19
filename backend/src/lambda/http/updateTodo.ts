import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { updatedTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatingTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    await updatedTodo(todoId, updatingTodo, userId)

    return{
      statusCode:204,
      body:''
    }
  }
)

handler
  .use(
    cors({
      credentials: true
    })
  )
