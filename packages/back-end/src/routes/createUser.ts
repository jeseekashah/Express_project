import { Router } from 'express';
import { User } from '../services/db';

const CreateUserRouter = Router();

CreateUserRouter.post('/', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address } = req.body;

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
    });

    return res.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Failed to create user.', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user.',
    });
  }
});

export default CreateUserRouter;

