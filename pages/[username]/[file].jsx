import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Head from '../../components/Head'
import Avatar from '../../components/Avatar'
import { useRouter } from 'next/router'
import { User, Role } from '../../scripts/mongo'
import Gql from '../../scripts/gql'
import { Post } from '../../scripts/fetch'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/solid'
import {DownloadIcon} from '@heroicons/react/outline'
import {Button} from '../../components/ui'

export default function UserPage({ currentUser, pageUser }) {
    const handleDelete = () => {
        const response = Post('https://replfiles.api.dillonb07.studio/delete', { '_id': pageUser._id, 'username': pageUser.username, 'file': file?.filename }).then((r) => {

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 8000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: response.type || 'error',
                title: response.msg || 'Something weird happened...'
            })
        })
    }

    const router = useRouter()
    const [file, setFile] = useState()

    useEffect(() => {
        async function getFiles() {
            try {
                const res = await fetch(`https://replfiles.api.dillonb07.studio/get/${router?.query?.username}/${router?.query?.file}`);
                const data = await res.json();

                // Set the new component state using the data
                setFile(data);

                if (data?.type === 'error' && data?.msg === 'File not found') {
                    router.push('/dashboard?type=error&msg=File%20not%20found')
                }
            } catch (err) {
                console.log(err);
            }
        }
        getFiles();
    }, [router]);

    return (
        <>
            <Head avatar={pageUser?.image} titleContent={file?.name} description={`${pageUser?.username}'s Repl Files profile`} />
            <Header currentUser={currentUser} />
            <div className='flex flex-col items-center justify-center space-y-5'>
                <div className='flex items-center justify-center space-x-7'>
                    <div className='sm:inline hidden'>
                    <Avatar source='/docs.png' large />
                    </div>
                    <h1 className='truncate break-words'>{file?.name}</h1>
                </div>
                    <h2 className='hidden sm:inline truncate break-words'>Uploaded by <a rel='noreferrer' href={`/${file?.username}`} target='_blank'>@{file?.username}</a></h2>
                <h2 className='sm:hidden inline truncate break-words'><a href={`/${file?.username}`} rel='noreferrer' target='_blank'>@{file?.username}</a></h2>
                <div className='flex justify-between flex-col border rounded-lg m-2 mt-4 bg-[#1C2333] border-[#4E5569] hover:border-[#71788A] w-72 h-50 relative text-center '>

                    <div>
                        <h3 className='break-words border-b border-[#4E5569] mx-4'>{file?.name}</h3>

                        <h5 className='break-words mx-4'>{file?.filename}</h5>
                        <p className='break-words line-clamp-7 mx-4' >{file?.description}</p>
                    </div>

                    <Link href={`/${file?.username}`}>
                        <a>
                            <div className='content-center justify-evenly cursor-pointer flex mx-4 rounded-md bg-[#0F1524] p-3 mb-4'>
                                <Avatar source={pageUser?.image} />
                                <h5 className='break-words truncate '>@{file?.username}</h5>
                                {/* (currentUser?.userId == pageUser?.userId || currentUser?.moderator) && <button onClick={handleDelete}><XCircleIcon className='text-red-500 h-8 w-8' /></button> */}
                            </div>
                        </a>
                    </Link>
                </div>
                <a href={file?.file} download={file?.filename}>
                <Button classes='flex text-xl font-semibold justify-center items-center'>Download <DownloadIcon  className='h-8 w-8 ml-3'/></Button>
                </a>
           {currentUser?.username !== file?.username &&( <div className='bg-[#D33C2F]/75 p-5 mt-4 rounded-md'>
                
                <p className='mx-3 max-w-[50vw] font-semibold'>
                    WARNING: ReplFiles is not responsible for the security of files. Do not download files that you don&apos;t trust. If you believe that a file is malware or is dangerous, report it <a href='/feedback' target='_blank' rel='noreferrer'>here</a> and a moderator will look at the report as soon as possible.
                </p>
            </div>)}
            </div>
        </>
    )
}

export async function getServerSideProps({ params, req }) {
    const gql = new Gql(process.env.CONNECT_SID);
    const id = req.headers["x-replit-user-id"];


    let userInDb = await User.findOne({ userId: id }).populate("userRoles");
    let pageUserInDb = await User.findOne({ username: params.username }).populate('userRoles');

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

        let pageUser = JSON.parse(JSON.stringify(pageUserInDb))


        return {
            props: {
                currentUser: JSON.parse(JSON.stringify(userInDb)),
                pageUser
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