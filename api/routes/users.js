import { Router } from 'express';
import Users from '../models/users';

const router = Router();

// router.route('/login')
//   .post(Users.postLogin)

router.route('/register')
  .post(Users.register);

module.exports = router;
