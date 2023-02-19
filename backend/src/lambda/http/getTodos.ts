import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodos } from '../../helpers/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('get todos')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('getting todos: ', event)
    
    const userId = getUserId(event)
    const todos = await getTodos(userId)

    return{
    statusCode: 200,
    body: JSON.stringify({
        items: todos
    })
    }
})

handler.use(
    cors({
    credentials: true
    })
)