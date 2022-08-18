import nc from 'next-connect';
import Gql from '../../scripts/gql';
import { User } from '../../scripts/mongo'
import parseRoles from '../../scripts/parseroles';

const app = nc();
const gql = new Gql("");

app.post(async (req, res) => {
  let id = req.headers['x-replit-user-id'];
  let userData = await gql.raw({
    query: `query user($id: Int!) {
      user(id: $id) {
        username image displayName roles { name } isBannedFromBoards id isHacker
      }
    }`,
    variables: {
      id: Number(id)
    }
  });

  if(userData.data){
    let { user } = userData.data;
    if(user.isBannedFromBoards) {
      res.json({ success: false, message: "It seems as though you've been banned from replit, so unfortunately you can't have access to ReplFiles. If you would like to appeal, please do so at https://contact.moderation.repl.co" });
    }
    else {
      let testForUser = await User.findOne({ userId: id });
      if(testForUser) {
        res.json({ success: true });
      }
      else {
        let parsedRoles = await parseRoles(user);
        let newUser = new User({
          username: user.username,
          displayName: user.displayName,
          userId: id,
          image: user.image,
          cool: false,
          userRoles: parsedRoles,
          spaceUsed: 0,
          moderator: false,
          count: 0
        })
        console.log("NEW USER", newUser)
        await newUser.save();
        res.json({ success: true });
      }
    }
    
    
  }
});

export default app;
