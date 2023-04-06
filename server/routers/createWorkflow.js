import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  console.log('object');
  return res.send('asd');
});

export { router };
