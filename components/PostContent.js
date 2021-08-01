import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

const PostContent = ({ post }) => {
  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate()
  return (
    <div className="card">
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}`}>
          <a>@{post.username}</a>
        </Link>
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  )
}

export default PostContent
