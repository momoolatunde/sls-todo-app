import * as AWS from 'aws-sdk'
var AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
    ){}

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem>{

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async getTodos(userId: string): Promise<TodoItem[]> {

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
            
        }).promise()

        return result.Items as TodoItem[]
    }

}