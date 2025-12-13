// Generic function to filter items based on a predicate
export function filterItems<T>(
    items: T[],
    predicate: (item: T) => boolean
): T[] {
    return items.filter(predicate);
}

// Generic function to create a paginated response
export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number
): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = data.slice(start, end);

    return {
        data: paginatedData,
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit),
    };
}

