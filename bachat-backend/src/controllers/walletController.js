import walletService from '../services/walletService.js';

export const getWallet = async (req, res, next) => {
  try {
    const userId = req.user?.uid;
    const wallet = await walletService.getWallet({ userId });

    return res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

export const resetWallet = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Reset endpoint is disabled in production environment'
      });
    }

    const userId = req.user?.uid;
    const wallet = await walletService.resetWallet({ userId });

    return res.status(200).json({
      success: true,
      message: 'Wallet reset successfully',
      wallet
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getWallet,
  resetWallet
};
