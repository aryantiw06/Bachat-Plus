import * as investmentService from '../services/investment.service.js';

export const createInvestment = async (req, res) => {
  const { amount, investmentType, riskLevel } = req.body || {};
  const parsedAmount = typeof amount === 'number' ? amount : Number(amount);
  const result = await investmentService.createInvestment(req.user.uid, {
    amount: parsedAmount,
    investmentType,
    riskLevel,
  });
  res.status(201).json(result);
};

export const getInvestments = async (req, res) => {
  const investments = await investmentService.getInvestmentHistory(req.user.uid);
  res.status(200).json({ success: true, investments });
};
