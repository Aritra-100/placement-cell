export function parsePagination(query, { defaultLimit = 20, maxLimit = 50 } = {}) {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = defaultLimit;
    if (limit > maxLimit) limit = maxLimit;

    return { page, limit, skip: (page - 1) * limit };
}

export function paginated(items, total, { page, limit }) {
    return {
        data: items,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
            hasNext: page * limit < total,
        },
    };
}