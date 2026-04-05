import './News.css'

function formatDate(dateInput) {
  const date = new Date(dateInput)

  if (Number.isNaN(date.getTime())) {
    return dateInput
  }

  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export default function NewsPage({ newsItems = [] }) {
  return (
    <section className="news section" id="news">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">News</span>
          <h2 className="section-title">News & <span className="text-gradient">Events</span></h2>
          <p className="section-subtitle">Latest updates and upcoming happenings at B&B Apartments</p>
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <article className="news-card" key={item.id}>
              <img src={item.imageUrl} alt={item.title} loading="lazy" />
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-date">{formatDate(item.date)}</p>
                <p className="news-excerpt">{item.excerpt}</p>
              </div>
            </article>
          ))}

          {newsItems.length === 0 && (
            <article className="news-card">
              <div className="news-content">
                <h3 className="news-title">No news items published yet</h3>
                <p className="news-excerpt">
                  New announcements and events will appear here once they are published.
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
