import * as uuid from 'uuid'

import { TodosAccess } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem>{

    const todoId = uuid.v4()
    
    const newTodo: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: '',
        ...createTodoRequest
    }

    try { await todosAccess.createTodoItem(newTodo)} 
    catch (error) { console.log('Error creating todo item: ', error)}
    
    return newTodo as TodoItem
}

export async function getTodos(userId: string): Promise<TodoItem[]>{
    return todosAccess.getTodos(userId)
}

export async function updatedTodo(todoId:string, updateTodoRequest:UpdateTodoRequest, userId:string): Promise<TodoUpdate> {

    return todosAccess.updateTodo(todoId, userId, updateTodoRequest)
}
