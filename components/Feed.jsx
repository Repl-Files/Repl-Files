import Link from 'next/link'
import FileCard from './FileCard'
import { Button } from './ui'

export default function Feed({ currentUser, user }) {
    return (
        <>
            <h2 className='text-center'>{user.username}'s Files</h2>
            {user.files.length >= 1 ? (
                <div className='flex flex-wrap space-x-3 mx-5 justify-evenly'>
                    {user.files.map((file) => (
                        <FileCard user={user} key={file.filename} file={file} />
                    ))}
                </div>
            ) : (
                <div className='flex mt-5 flex-col justify-center items-center space-y-4 text-center'>
                    {currentUser._id == user._id ? (
                        <>
                            <p className='text-4xl font-semibold'>You don't have any files yet.</p>
                            <Link href='/upload'>
                                <Button classes=''>Upload a file</Button>
                            </Link></>) : <><p className='text-4xl font-semibold'>{user.username} doesn't have any files yet.</p></>}
                </div>
            )
            }
        </>
    )
}
