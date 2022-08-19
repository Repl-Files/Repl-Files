import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Head from '../../components/Head'
import Avatar from '../../components/Avatar'
import Feed from '../../components/Feed'
import { useRouter } from 'next/router'
import { User, Role } from '../../scripts/mongo'
import Gql from '../../scripts/gql'

export default function UserPage({ currentUser, pageUser }) {
    const router = useRouter()
    console.log(pageUser)

    return (
        <>
            <Head avatar={pageUser.image} titleContent={pageUser.username} description={`${pageUser}'s Repl Files profile`} />
                <Header currentUser={currentUser} />
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center space-x-7'>
                    <Avatar source={pageUser.image} large />
                    {pageUser.username === 'Bookie0' ? <h1>@{pageUser.username}</h1> : <h1>{pageUser.displayName} | @{pageUser.username}</h1>}
                </div>
                    <Feed currentUser={currentUser} user={pageUser} />
            </div>
        </>
    )
}

export async function getServerSideProps({ params, req }) {
    const gql = new Gql(process.env.CONNECT_SID);
    const id = req.headers["x-replit-user-id"];

    let userInDb = await User.findOne({ userId: id }).populate("userRoles");
    let pageUserInDb = await User.findOne({ username: params.username }).populate('userRoles');
    console.log(pageUserInDb)

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


    } else {
        return {
            redirect: {
                destination: '/login'
            }
        }
    }

    if (pageUserInDb && !pageUserInDb.banned) {
        let pageUserData = await gql.raw({
            query: `query user($id: Int!) {
        user(id: $id) {
          image bio isFollowingCurrentUser
        }
      }`,
            variables: {
                id: Number(pageUserInDb.userId)
            }
        });
        let coolRole = pageUserData?.data?.user?.isFollowingCurrentUser;
        if (pageUserData?.data?.user?.image) pageUserInDb.image = pageUserData.data.user.image;
        if (pageUserData?.data?.user?.bio) pageUserInDb.bio = pageUserData.data.user.bio;

        if (coolRole && !pageUserInDb.userRoles.some(x => x.name === "Banned")) {
            if (!pageUserInDb.userRoles.some(x => x.name === "Cool Person")) pageUserInDb.userRoles.push(await Role.findOne({ name: "Cool Person" }))
        }
        pageUserInDb.save();

        if (JSON.parse(JSON.stringify(userInDb)).userId == JSON.parse(JSON.stringify(pageUserInDb)).userId) {
            return {
                redirect: {
                    destination: '/dashboard'
                }
            }
        } else {
            return {
                props: {
                    currentUser: JSON.parse(JSON.stringify(userInDb)),
                    pageUser: JSON.parse(JSON.stringify(pageUserInDb))
                }    
            }
        }
    } else {
        return {
            redirect: {
                destination: '/dashboard?type=error&msg=User not found'
            }
        }
    }
}