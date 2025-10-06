import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>RankASco 2.0 — Data Load</h1>
      <p>Load a CSV from your computer, or try the bundled demo.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            // pass the File via router state
            navigate('/data-loading', { state: { file } })
          }}
        />
        <button
          onClick={() =>
            navigate('/data-loading', {
              state: { filename: '/data/demo.csv', categorical: [], numerical: [] },
            })
          }
        >
          Use demo CSV
        </button>
      </div>
    </div>
  )
}
