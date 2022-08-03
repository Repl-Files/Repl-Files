import Header from '../components/Header'
import Head from '../components/Head'

export default function Dashboard({currentUser}) {
    console.log(currentUser)
    return(
        <div>
            <Head titleContent='Dashboard' />
            <Header currentUser={currentUser} />
        </div>
    )
}

import { User, Role } from '../scripts/mongo'
import Gql from '../scripts/gql'
export async function getServerSideProps({ req }) {
  const gql = new Gql(process.env.CONNECT_SID);
  const id = req.headers["x-replit-user-id"];

  let userInDb = await User.findOne({ userId: id }).populate("userRoles");

  if (userInDb && !userInDb.banned) {
    let userData = await gql.raw({
      query: `query user($id: Int!) {
        user(id: $id) {
          image bio isFollowingCurrentUser
        }
      }`,
      variables: {
        id: Number(id)
      }
    });
    let coolRole = userData?.data?.user?.isFollowingCurrentUser;
    if (userData?.data?.user?.image) userInDb.image = userData.data.user.image;
    if (userData?.data?.user?.bio) userInDb.bio = userData.data.user.bio;
    
    if (coolRole && !userInDb.userRoles.some(x => x.name === "Banned")) {
      if (!userInDb.userRoles.some(x => x.name === "Cool Person")) userInDb.userRoles.push(await Role.findOne({ name: "Cool Person" }))
    }
    userInDb.save();

    return {
      props: {
        currentUser: JSON.parse(JSON.stringify(userInDb)),
      }
    }
  } else {
    return {
      redirect: {
        destination: '/login'
      }
    }
  }
}