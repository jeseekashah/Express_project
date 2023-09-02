import { Router } from 'express';
import { User } from '../services/db';

const EditUserRouter = Router();

EditUserRouter.put('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  const { firstName, lastName, email, phoneNumber, address } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    // Update user attributes
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.address = address;

    await user.save();

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Failed to update user.', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user.',
    });
  }
});

export default EditUserRouter;
