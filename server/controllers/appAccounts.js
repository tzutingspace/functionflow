import * as DBAppAccount from '../models/appAccount.js';

export const getAppAccount = async (req, res) => {
  console.log('@getAppAccount', req.user);
  const userId = req.user.id;
  const result = await DBAppAccount.getAppAccountsByUserId(userId);
  return res.json({ data: result });
};
