import * as uuid from 'uuid'

import { TodosAccess } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

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

