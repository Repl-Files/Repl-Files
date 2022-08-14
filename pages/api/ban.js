import nc from 'next-connect';
import auth from '../../scripts/authenticate.js';
import { User, Message, Role } from '../../scripts/mongo';

const app = nc();
// Quick note: Prevent mods from banning each other, add deletion, and restoration of accounts
app.post(async (req, res) => {
  auth(req, res, async (currentUser) => {
    if(currentUser.userRoles.some(x => x.admin)){
      let u = await User.findOne({ username: req.body.username }).populate("userRoles");
      if(!u.userRoles.some(r => r.admin)){
        u.userRoles = [await Role.findOne({ name: "Banned" })];
        await u.save();
        await Message.deleteMany({ user: u._id });
        res.json({
          success: true
        });
      }
    }else{
      res.json({
        success: false
      })
    }
  })
});

export default app;
