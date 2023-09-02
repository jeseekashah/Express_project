import { Router } from 'express';
import { User } from '../services/db';

const DeleteUserRouter = Router();

DeleteUserRouter.delete('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await user.destroy();

    return res.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('Failed to delete user.', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
    });
  }
});

export default DeleteUserRouter;
