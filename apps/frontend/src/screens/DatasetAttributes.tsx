import { useLocation, Link } from 'react-router-dom'

export default function DatasetAttributes() {
  const location = useLocation()
  // this is what you pushed with navigate(..., { state: { data, ... } })
  const state = (location.state || {}) as any
  const rows = Array.isArray(state.data) ? state.data.length : 0

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Attribute Overview</h1>
      <p>Received <b>{rows}</b> rows.</p>
      <pre style={{background:'#111',color:'#ddd',padding:12,borderRadius:8,overflow:'auto'}}>
        {JSON.stringify(Object.keys((state.data?.[0] ?? {})), null, 2)}
      </pre>
      <Link to="/"><button>Back Home</button></Link>
    </div>
  )
}
