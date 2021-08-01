import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'
import MetaTags from '../components/Metatags'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  return (
    <>
      <UserContext.Provider value={userData}>
        <MetaTags />
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
