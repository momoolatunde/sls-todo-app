import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create todo')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('creating a new todo: ', event)    

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  
  const newTodoItem = await createTodo(userId, newTodo)

    return{
      statusCode:201,
      body: JSON.stringify({
        item: newTodoItem
      })
    } 
  }
)

handler.use(
  cors({
    credentials: true
  })
)
