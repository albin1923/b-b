import './Preloader.css'

export default function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader-inner">
        <div className="preloader-logo">B&B</div>
        <div className="preloader-text">Apartments</div>
        <div className="preloader-bar">
          <div className="preloader-progress"></div>
        </div>
      </div>
    </div>
  )
}
