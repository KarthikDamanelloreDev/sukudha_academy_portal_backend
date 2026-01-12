const Transaction = require('./transaction.schema');
const ERROR_MESSAGES = require('../../utils/error-messages');

class TransactionService {
    /**
     * Get transaction statistics
     */
    async getTransactionStats() {
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalRevenue: { $sum: '$amount' },
                    completedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    pendingTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    failedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                    },
                    completedRevenue: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalTransactions: 0,
            totalRevenue: 0,
            completedTransactions: 0,
            pendingTransactions: 0,
            failedTransactions: 0,
            completedRevenue: 0
        };
    }
}

module.exports = new TransactionService();
