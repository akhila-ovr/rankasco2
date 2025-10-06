import { Link, useRouteError } from 'react-router-dom'

export default function NotFound() {
  const err = useRouteError() as any
  return (
    <div style={{ maxWidth: 700, margin: '10vh auto', padding: 24, textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p style={{opacity:0.7}}>The route you tried to open doesn’t exist.</p>
      {err?.status && <p>Status: {err.status} {err.statusText}</p>}
      <Link to="/"><button>Go Home</button></Link>
    </div>
  )
}
