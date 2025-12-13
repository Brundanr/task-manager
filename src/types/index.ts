export enum UserRole {
    MEMEBR = 'ROLE_MEMBER',
    ADMIN = 'ROLE_ADMIN'
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface ErrorLog {
    id: string;
    message: string;
    statusCode: number;
    userId: string;
    stack?: string;
    timestamp?: string;
}

export interface  PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'completed';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
    search: string;
    completed: boolean | null;
    sortField: SortField;
    sortOrder: SortOrder;
}

export interface ErrorScreenParams {
    error: string;
    statusCode: number;
}

export interface TaskDetailsParams {
    taskId?: string;
}