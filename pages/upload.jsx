import { useState } from 'react'
import { PhotographIcon } from '@heroicons/react/outline'
import Avatar from '../components/Avatar'
import Header from '../components/Header'
import Head from '../components/Head'
import { Button } from '../components/ui'

export default function Upload({ currentUser }) {
    // const [imageBoxOpen, setImageBoxOpen] = useState(false)


    return (
        <>
            <Head titleContent='Upload' description='Upload file to Repl Files' />
            <Header currentUser={currentUser} />
          <div className='mx-[10vw] sm:mx-[20vw]'>
            <h1 className='text-center' >File Upload</h1>
            <form
                encType="multipart/form-data"
                method="post"
                action='https://replfiles.api.dillonb07.studio/upload'
                className="sticky top-16 md:top-20 z-50 shadow-sm border rounded-md border-[#4F5567] p-2 bg-[#2B3245] hover:border-[#71788A] transition duration-300"
            >
                <div className="flex items-center space-x-3">
                    <Avatar />
                    <input
                        required
                        className="p-2 pl-5 outline-none flex-1 rounded-md bg-[#0F1524]"
                        type="text"
                        placeholder='File Nickname'
                        name='name'
                    />

                    {/*<PhotographIcon
                        onClick={() => setImageBoxOpen(!imageBoxOpen)}
                        className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && "text-blue-300"
                            }`}
                    />*/}
                </div>

                
                    <div className="flex flex-col py-2">
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">File:</p>
                            <label className='flex-1 bg-[#0F1524] m-2 rounded-md'>
                            <input
                                required
                                className=" rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none"
                                type="file"
                                name='file'
                            />
                            </label>
                        </div>

                        <div className='flex flex-col py-2'>
                            <div className='flex items-center px-2'>
                                <p className='min-w-[90px]'>Description:</p>
                                <input name='description' className=' rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none' type='text' placeholder='Description (Optional)' />
                            </div>
                        </div>


                        
                        {/* imageBoxOpen && (
                <div className="flex flex-col py-2">
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image:</p>
                            <label className='flex-1 bg-[#0F1524] m-2 rounded-md'>
                            <input
                                required
                                className=" rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none"
                                type="file"
                                name='image'
                                accept='image/*'
                            />
                            </label>
                        </div></div>
                        )*/} 

                        <div className="flex items-center px-2 mb-2">
                                <p className="min-w-[90px]">Username:</p>
                        <input readOnly type='text' className='rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none cursor-not-allowed' name='username'  value={currentUser.username} />
                            <input readOnly hidden type='text' className='none ' name='userid'  value={currentUser.userId} />
                            </div>
                        
                            <Button
                                btnType="submit"
                                classes='mt-2'
                            >
                                Upload File
                            </Button>
                        
                    </div>
                
            </form>
          </div>
        </>
    )
}
                            // <div className="flex items-center px-2">
                            //     <p className="min-w-[90px]">Image URL:</p>
                            //     <input
                            //         className="rounded-md m-2 flex-1 bg-[#0F1524] p-2 outline-none"
                            //         type="url"
                            //         name='imageUrl'
                            //         placeholder="Text (Optional)"
                            //     />
                            // </div>

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