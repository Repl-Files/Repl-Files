import { User } from './mongo.js';
export default async function auth(req, res, callback) {
  let id = req.headers["x-replit-user-id"];
  if(id.length > 0){
    let currentUser = await User.findOne({ userId: Number(id) }).populate("userRoles");
    if(currentUser && !currentUser.banned){
      callback(currentUser);
    }else{
      res.status(401).json({
        success: false,
        message: "Unauthorized attempt, please log in."
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized attempt, please log in."
    })
  }
}