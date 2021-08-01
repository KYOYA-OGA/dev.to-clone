import { useState } from 'react'
import { auth, STATE_CHANGED, storage } from '../lib/firebase'

import Loader from './Loader'

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState(null)

  //! Creates a Firebase Upload Task
  const handleUploadFile = (e) => {
    const file = Array.from(e.target.files)[0]
    const extension = file.type.split('/')[1]

    // makes reference to the file in firebase storage
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    )
    setUploading(true)

    // Starts the upload
    const task = ref.put(file)

    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0)
      setProgress(pct)

      // get download url after task resolves
      task
        .then(() => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url)
          setUploading(false)
        })
    })
  }
  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Image
            <input
              type="file"
              onChange={handleUploadFile}
              accept="image/x-png,image/gif,image/jpg,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  )
}

export default ImageUploader
