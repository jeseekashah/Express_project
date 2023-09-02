import { Router } from 'express';
import { User } from '../services/db';

const GetUserRouter = Router();

GetUserRouter.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Failed to get user.', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user.',
    });
  }
});

export default GetUserRouter;
