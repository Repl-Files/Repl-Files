import Link from 'next/link'
import Avatar from './Avatar'

export default function FileCard({ file, user }) {
    return (
        <div className='flex justify-between flex-col border rounded-lg m-2 bg-[#1C2333] border-[#4E5569] hover:border-[#71788A] w-72 h-50 relative text-center '>
            <div>
                <h3 className='break-words border-b border-[#4E5569] mx-4'>{file.name}</h3>
                <h5 className='break-words mx-4'>{file.filename}</h5>
                <p className='break-words line-clamp-7 mx-4' >{file.description}</p>
            </div>

            <Link href='/{file.username}'>
                <a>
                    <div className='content-center justify-evenly cursor-pointer flex mx-4 rounded-md bg-[#0F1524] p-3 mb-4'>
                    <Avatar source={user.image} />
                    <h5 className='break-words truncate '>@{file.username}</h5>
                    </div>
                </a>
            </Link>
        </div>


    )
}