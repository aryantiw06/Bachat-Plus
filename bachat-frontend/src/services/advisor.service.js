import analyticsService from './analytics.service';

export const advisorService = {
  getAdvisorInsights: async () => {
    try {
      const analytics = await analyticsService.getAnalytics();
      const { totalSaved, totalSpent, transactionCount } = analytics;

      let advice = 'Start making small daily payments to watch your round-up savings grow!';
      if (totalSaved > 500) {
        advice = 'Great milestone! Your round-ups are building a strong financial cushion.';
      } else if (totalSaved > 100) {
        advice = 'Consistent savings! You are automatically building wealth on every transaction.';
      }

      return {
        success: true,
        insights: advice,
        metrics: { totalSaved, totalSpent, transactionCount }
      };
    } catch (error) {
      return {
        success: false,
        insights: 'Focus on consistent round-up investments.',
        metrics: { totalSaved: 0, totalSpent: 0, transactionCount: 0 }
      };
    }
  }
};

export default advisorService;
