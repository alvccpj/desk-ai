import api from './client'
import type { User } from './auth'

export interface Category {
  id: number
  name: string
  description: string
  color: string
  ticket_count: number
  created_at: string
}

export interface Attachment {
  id: number
  file: string
  filename: string
  uploaded_by: User
  uploaded_at: string
}

export interface Comment {
  id: number
  ticket: number
  author: User
  content: string
  is_internal: boolean
  created_at: string
  updated_at: string
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface TicketList {
  id: number
  title: string
  category: Category | null
  status: TicketStatus
  priority: TicketPriority
  created_by: User
  assigned_to: User | null
  comment_count: number
  created_at: string
  updated_at: string
}

export interface TicketDetail extends TicketList {
  description: string
  ai_suggestion: string
  attachments: Attachment[]
  comments: Comment[]
}

export interface TicketsParams {
  status?: TicketStatus
  priority?: TicketPriority
  category?: number
  search?: string
  assigned_to?: number
  page?: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const ticketsApi = {
  listCategories: () =>
    api.get<Category[]>('/api/categories/'),

  createCategory: (data: Partial<Category>) =>
    api.post<Category>('/api/categories/', data),

  updateCategory: (id: number, data: Partial<Category>) =>
    api.patch<Category>(`/api/categories/${id}/`, data),

  deleteCategory: (id: number) =>
    api.delete(`/api/categories/${id}/`),

  listTickets: (params?: TicketsParams) =>
    api.get<PaginatedResponse<TicketList>>('/api/tickets/', { params }),

  getTicket: (id: number) =>
    api.get<TicketDetail>(`/api/tickets/${id}/`),

  createTicket: (data: {
    title: string
    description: string
    category_id?: number | null
    priority?: TicketPriority
  }) => api.post<TicketDetail>('/api/tickets/', data),

  updateTicket: (id: number, data: Partial<TicketDetail & { category_id: number; assigned_to_id: number }>) =>
    api.patch<TicketDetail>(`/api/tickets/${id}/`, data),

  deleteTicket: (id: number) =>
    api.delete(`/api/tickets/${id}/`),

  aiSuggest: (id: number) =>
    api.post<{ suggestion: string }>(`/api/tickets/${id}/ai_suggest/`),

  summarize: (id: number) =>
    api.get<{ summary: string }>(`/api/tickets/${id}/summarize/`),

  autoCategorize: (title: string, description: string) =>
    api.post<{ category: string; detail?: string }>('/api/tickets/auto_categorize/', {
      title,
      description,
    }),

  uploadAttachment: (id: number, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post<Attachment>(`/api/tickets/${id}/attach/`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  listComments: (ticketId: number) =>
    api.get<Comment[]>(`/api/tickets/${ticketId}/comments/`),

  createComment: (ticketId: number, data: { content: string; is_internal?: boolean }) =>
    api.post<Comment>(`/api/tickets/${ticketId}/comments/`, data),

  updateComment: (ticketId: number, commentId: number, data: { content: string }) =>
    api.patch<Comment>(`/api/tickets/${ticketId}/comments/${commentId}/`, data),

  deleteComment: (ticketId: number, commentId: number) =>
    api.delete(`/api/tickets/${ticketId}/comments/${commentId}/`),
}
