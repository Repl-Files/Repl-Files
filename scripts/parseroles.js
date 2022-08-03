import Gql from './gql.js';
import { Role } from './mongo.js'

const gql = new Gql(process.env.CONNECT_SID)

export default async function parseRoles(user) {
  const id = Number(user.id);
  let isFollowing = await gql.raw({
    query: `query user($id: Int!) { user(id: $id) { isFollowingCurrentUser } }`,
    variables: {
      id
    }
  });
  const coolRole = (isFollowing.data && isFollowing.data.user && isFollowing.data.user.isFollowingCurrentUser) || (user.username === "DillonB07");
  const hackerRole = user.isHacker;
  const ownerRole = user.username === "DillonB07" || user.username === "VulcanWM";
  const contentCreator = user.roles.some(x => x.name === "content creator");
  const explorerRole = user.roles.some(x => x.name === "explorer");
  const adminRole = user.roles.some(x => x.name === "admin");

  let roles = [await Role.findOne({ name: "everyone" })];

  roles = roles.concat(await Role.find({
    $or: [
      { name: coolRole ? "Cool Person" : "no-role" },
      { name: hackerRole ? "Hacker" : "no-role" },
      { name: ownerRole ? "Owner" : "no-role" },
      { name: contentCreator ? "Content Creator" : "no-role" },
      { name: explorerRole ? "Explorer" : "no-role" },
      { name: adminRole ? "Replit Team" : "no-role" },
    ]
  }))

  return roles;
}