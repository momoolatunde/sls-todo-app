import * as AWS from 'aws-sdk'
var AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('todo-access')

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly createdIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async createTodo(todoItem: TodoItem): Promise<TodoItem>{

        logger.info('creating a new todo: ', todoItem)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async getTodos(userId: string): Promise<TodoItem[]> {

        logger.info('getting all todos for user: ', userId)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.createdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
            
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async updateTodo(todoId:string, userId:string, todoUpdate:TodoUpdate): Promise<TodoUpdate>{

        logger.info('updating a todo: ', todoId)

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression:'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues:{
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
        }).promise()

        return result.Attributes as TodoUpdate
    }

    async deleteTodo(userId:string, todoId:string): Promise<string> {

        logger.info('deleting a todo: ', todoId)
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                userId,
                todoId
            }
        }).promise()

        return todoId
    }

    async uploadFile(userId:string, todoId:string, url: string) {

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': url
            }
        }).promise()
        
    }
}


export function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('creating a local dynamodb instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}