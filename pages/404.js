import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <iframe
        src="https://giphy.com/embed/GFE5dagX3tKTqkRZg8"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <p>
        <a href="https://giphy.com/gifs/GFE5dagX3tKTqkRZg8">via GIPHY</a>
      </p>
      <Link href="/" passHref>
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  )
}

export default NotFoundPage
