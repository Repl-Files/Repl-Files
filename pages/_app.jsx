import '../styles/globals.scss'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
    const router = useRouter()

    const params = router.query

    if (params.type && params.msg) {


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
            icon: params.type || 'error',
            title: params.msg || 'Something weird happened...'
        })
    }

    return (
        <>
            {/* <header className='text-center h-[60px] sticky top-0 z-50 flex bg-green-500 px-4 py-2 shadow-sm  items-center justify-center'><p className='text-center text-black'><span className='font-semibold'>ALERT:</span>Maintenance is over! If you find any issues, please use the feedback form to report them.</p></header>*/}
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
