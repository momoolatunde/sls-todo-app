export interface CreateTodoRequest {
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  createdAt: string
}
