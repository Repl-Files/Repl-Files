import Link from 'next/link'
import Avatar from './Avatar'
import { XCircleIcon } from '@heroicons/react/solid'
import { Post } from '../scripts/fetch'
import Swal from 'sweetalert2'
import {useRouter} from 'next/router'

export default function FileCard({ file, user, currentUser }) {
    const router = useRouter()
    const handleDelete = () => {
        const response = Post('https://replapps.api.dillonb07.studio/files/delete', { '_id': user._id, 'username': user.username, 'file': file?.filename }).then((r) => {

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
                icon: r.type || 'error',
                title: r.msg || 'Something weird happened...'
            })
        })
        router.push('/dashboard')
    }
    return (
        <Link href={`/${file?.username}/${file?.name}`}>
            <div className='cursor-pointer flex justify-between flex-col border rounded-lg m-2 bg-[#1C2333] border-[#4E5569] hover:border-[#71788A] w-72 h-50 relative text-center '>

                <div>
                    <h3 className='break-words border-b border-[#4E5569] mx-4'>{file.name}</h3>

                    <h5 className='break-words mx-4'>{file.filename}</h5>
                    <p className='break-words line-clamp-7 mx-4' >{file.description}</p>
                </div>

                <div className='content-center justify-evenly flex mx-4 rounded-md bg-[#0F1524] p-3 mb-4'>
                    <Link href={`/${file.username}`}>
                        <a>
                            <div className='content-center justify-evenly cursor-pointer flex mx-4 rounded-md '>
                                <Avatar source={user.image} />
                                <h5 className='ml-1 break-words truncate '>@{file.username}</h5>
                            </div>
                        </a>
                    </Link>
                    {/*(currentUser.userId == user.userId || currentUser.moderator) && <button onClick={handleDelete}><XCircleIcon className='text-red-500 h-8 w-8 cursor-pointer' /></button>*/}
                </div>
            </div>
        </Link>
    )
}