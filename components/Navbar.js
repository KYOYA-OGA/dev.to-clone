import { useContext } from 'react'
import Link from 'next/link'
import { UserContext } from '../lib/context'
import classes from './Navbar.module.scss'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/dist/client/router'
import Image from 'next/image'

const Navbar = () => {
  const { user, username } = useContext(UserContext)
  const router = useRouter()

  const signOut = () => {
    auth.signOut()
    router.reload()
  }

  return (
    <nav className={classes.navbar}>
      <ul>
        <li>
          <Link href="/" passHref>
            <button className="">FEED</button>
          </Link>
        </li>

        {/* user is signed in  */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin" passHref>
                <button onClick={signOut}>Sign out</button>
              </Link>
            </li>
            <li className="push-left">
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                <Image
                  src={user?.photoURL || '/hacker.png'}
                  alt="profile"
                  width={40}
                  height={40}
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed in */}
        {!username && (
          <li>
            <Link href="/enter" passHref>
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
