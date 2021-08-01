import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import debounce from 'lodash.debounce'
import Image from 'next/image'

const EnterPage = () => {
  const { user, username } = useContext(UserContext)

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

export default EnterPage

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image
        src={'/google.png'}
        alt="google"
        width={30}
        height={30}
        style={{ marginRight: '1rem' }}
      />
      Sign in with Google
    </button>
  )
}
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign out</button>
}
function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()

    // create refs
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // commit both docs
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e) => {
    // validation
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // check validation
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        console.log('firestore read executed')
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Loading...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available</p>
  } else if (username && !isValid) {
    return <p className="text-danger">{username} is taken</p>
  } else {
    return null
  }
}
