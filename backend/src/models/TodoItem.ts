export interface TodoItem {
  name: string
  userId: string
  todoId: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  createdAt: string
}
