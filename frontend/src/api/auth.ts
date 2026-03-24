import api from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  name: string
  password: string
  password2: string
  department?: string
}

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'agent' | 'client'
  avatar: string | null
  department: string
  is_active: boolean
  date_joined: string
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<{ access: string; refresh: string }>('/api/auth/token/', data),

  refresh: (refresh: string) =>
    api.post<{ access: string }>('/api/auth/token/refresh/', { refresh }),

  register: (data: RegisterPayload) =>
    api.post<User>('/api/users/register/', data),

  me: () => api.get<User>('/api/users/me/'),

  updateMe: (data: Partial<User> | FormData) =>
    api.patch<User>('/api/users/me/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/api/users/change-password/', data),

  listUsers: (params?: { role?: string; search?: string }) =>
    api.get<{ results: User[]; count: number }>('/api/users/', { params }),
}
