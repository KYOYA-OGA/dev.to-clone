import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast'
import { useCollection } from 'react-firebase-hooks/firestore'

import AuthCheck from '../../components/AuthCheck'
import PostFeed from '../../components/PostFeed'
import { firestore, auth, serverTimestamp } from '../../lib/firebase'
import { UserContext } from '../../lib/context'
import styles from '../../styles/Admin.module.css'

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

export default AdminPostsPage

const PostList = () => {
  const ref = firestore
    .collection('users')
    .doc(auth?.currentUser.uid)
    .collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}
const CreateNewPost = () => {
  const [title, setTitle] = useState('')
  const { username } = useContext(UserContext)
  const router = useRouter()

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate title
  const isValid = title.length > 3 && title.length < 100

  const handleCreatePost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug)

    // default values
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await ref.set(data)

    toast.success('Post created')
    router.push(`/admin/${slug}`)
  }
  return (
    <form onSubmit={handleCreatePost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}
