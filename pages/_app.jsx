import '../styles/globals.scss'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
    const router = useRouter()

    const params = router.query
    console.log(params)

    if (params.type && params.msg) {


        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
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
            <Component {...pageProps} />

        </>
    )
}

export default MyApp
