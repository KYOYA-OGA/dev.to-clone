import Image from 'next/image'

const UserProfile = ({ user }) => {
  return (
    <div className="box-center">
      <Image
        src={user.photoURL || '/hacker.png'}
        className="card-img-center"
        alt={user.username}
        width={50}
        height={50}
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  )
}

export default UserProfile
