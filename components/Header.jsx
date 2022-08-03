import Link from 'next/link'
import {useRouter} from 'next/router'
import { useForm } from "react-hook-form";
import { ChevronDownIcon, HomeIcon, SearchIcon } from '@heroicons/react/solid'
import { CloudUploadIcon } from '@heroicons/react/outline'
import Avatar from './Avatar'
import {Button} from './ui'


export default function Header({ currentUser }) {
    const router = useRouter()
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => router.push(`https://replit.com/search?query=${data.query}`);
    
    return (
        <header className=' h-[60px] sticky top-0 z-50 flex bg-[#1D2332] px-4 py-2 shadow-sm  items-center'>
            <div className="h-10 w-10 relative flex-shrink-0 cursor-pointer">
                <Link href="/">
                    <a className="">
                        <Avatar priority background='1D2332' />
                    </a>
                </Link>
            </div>

            <div className="mx-7 space-x-2 flex items-center xl:min-w-[300px]">
                <HomeIcon onClick={() => router.push('/')} className="h-5 w-5" />
                <p className="ml-2 hidden lg:inline">Home</p>
            </div>

            <div className='hidden sm:inline flex items-center flex-1 rounded-md bg-[#2B3245] p-[4px] pl-[8px] max-w-[60vw] '>
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-[4px] pl-[8px] space-x-2">
                    <svg className='css-1gcl232' preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="#9DA2A6" style={{ verticalAlign: "middle" }} aria-hidden="true" ><path d="M5 3C5 1.89543 5.89543 1 7 1H9C10.1046 1 11 1.89543 11 3V5C11 6.10457 10.1046 7 9 7H7C5.89543 7 5 6.10457 5 5V3Z"></path><path d="M13 11C13 9.89543 13.8954 9 15 9H17C18.1046 9 19 9.89543 19 11V13C19 14.1046 18.1046 15 17 15H15C13.8954 15 13 14.1046 13 13V11Z"></path><path d="M7 17C5.89543 17 5 17.8954 5 19V21C5 22.1046 5.89543 23 7 23H9C10.1046 23 11 22.1046 11 21V19C11 17.8954 10.1046 17 9 17H7Z"></path></svg>
                    <input
                        className="flex-1 bg-transparent outline-none"
                        type="text"
                        placeholder="Search Replit"
                        {...register("query")}
                    />
                    <button hidden type="submit" />
                </form>
            </div>
            
                

            <div className="ml-auto flex-shrink-0 items-center justify-between flex relative cursor-pointer">

                    <Button classes='mx-2 text-xl hidden sm:inline'>Upload</Button>
                    <Button classes='mx-2 text-xl sm:hidden inline'>+</Button>
                <Link  href={`/@${currentUser.username}`}>
                    <a className='mr-0 flex'>
                <p className="hidden sm:inline ml-2 mr-4 truncate">{currentUser.displayName} | @{currentUser.username}</p>
                        <Avatar source={currentUser.image} priority background='1D2332' />
                    </a>
                </Link>
            </div>
        </header>
    )
}