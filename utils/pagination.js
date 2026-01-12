const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('./constants');

/**
 * Pagination utility function
 * @param {Object} query - Request query parameters
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (query) => {
    const page = parseInt(query.page) || DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Create pagination response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Paginated response
 */
const createPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage,
            hasPrevPage
        }
    };
};

module.exports = {
    getPaginationParams,
    createPaginatedResponse
};
