export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'completed';

export type SortOrder = 'asc' | 'desc';

export interface FilterState {
    search: string;
    completed: boolean | null;
    sortField: SortField;
    sortOrder: SortOrder;
}