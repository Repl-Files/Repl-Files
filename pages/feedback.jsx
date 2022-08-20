import Avatar from '../components/Avatar'
import Header from '../components/Header'
import Head from '../components/Head'
import { Button } from '../components/ui'

export default function Feedback({ currentUser }) {
    return (
        <>
            <Head titleContent='Feedback' description='Submit feedback for Repl Files' />
            <Header currentUser={currentUser} />
          <div className='mx-[10vw] sm:mx-[20vw]'>
            <h1 className='text-center' >Submit Feedback</h1>
            <form
                encType="multipart/form-data"
                autoComplete="off"
                method="post"
                action='https://replfiles.api.dillonb07.studio/feedback'
                className="sticky top-16 md:top-20 z-50 shadow-sm border rounded-md border-[#4F5567] p-2 bg-[#2B3245] hover:border-[#71788A] transition duration-300 "
            >
                <div className="flex items-center space-x-3">
                    <input
                        required
                        className="p-2 pl-5 outline-none flex-1 rounded-md bg-[#0F1524]"
                        type="text"
                        placeholder='Feedback Title'
                        name='title'
                    />

                    
                </div>

                
                    <div className="flex flex-col py-2">
                        <div className='flex flex-col py-2'>
                            <div className='flex items-center px-2'>
                                <p className='min-w-[90px]'>Type:</p>
                                <select className='rounded-md bg-[#0F1524] p-2' name='type' required>
                                    <option value='bug'>Bug</option>
                                    <option value='feedback'>Feedback</option>
                                    <option value='suggestion'>Suggestion</option>
                                    <option value='report'>Report</option>
                                    <option value='other'>Other </option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Feedback:</p>
                            <textarea
                                required
                                className="m-2 flex-1 bg-[#0F1524] p-2 outline-none rounded-md"
                                name='content'
                                placeholder='Put your feedback here...'
                            ></textarea>
                        </div>                      


                        <input hidden type='text' className='rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none cursor-not-allowed' name='username'  value={currentUser.username} />
                        
                            <Button
                                btnType="submit"
                            >
                                Submit
                            </Button>
                        
                    </div>
                
            </form>
          </div>
        </>
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