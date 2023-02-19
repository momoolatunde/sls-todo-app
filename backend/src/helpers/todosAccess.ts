import * as AWS from 'aws-sdk'
var AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly createdIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async createTodo(todoItem: TodoItem): Promise<TodoItem>{

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async getTodos(userId: string): Promise<TodoItem[]> {

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.createdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
            
        }).promise()

        return result.Items as TodoItem[]
    }

    async updateTodo(todoId:string, userId:string, todoUpdate:TodoUpdate): Promise<TodoUpdate>{

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
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                userId,
                todoId
            }
        }).promise()

        return todoId
    }


}