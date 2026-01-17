import Gallery from '../components/Gallery'

export default function GalleryPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">A glimpse of our beautiful property</p>
        </div>
      </div>
      <Gallery />
    </main>
  )
}
