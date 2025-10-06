import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Papa, { ParseResult } from 'papaparse'

type LocState = {
  file?: File
  filename?: string
  categorical?: string[]
  numerical?: string[]
}

function prettyBool(val: unknown) {
  if (val === 'TRUE') return 'True value'
  if (val === 'FALSE') return 'False value'
  return val
}

export default function DataLoading() {
  const navigate = useNavigate()
  const location = useLocation()
  const { file, filename, categorical = [], numerical = [] } = (location.state || {}) as LocState

  const [dataSet, setDataSet] = React.useState<any[]>([])
  const [rowsLoaded, setRowsLoaded] = React.useState(0)
  const [parsing, setParsing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function run() {
      if (file) {
        parseFile(file)
      } else if (filename) {
        parseFromUrl(filename)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, filename])

  const parseFile = (file: File) => {
    setParsing(true)
    setRowsLoaded(0)
    setError(null)
    const collected: any[] = []

    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      worker: true,
      skipEmptyLines: 'greedy',
      chunkSize: 1024 * 1024,
      chunk: (res: ParseResult<Record<string, unknown>>) => {
        for (const row of res.data) {
          const r: Record<string, unknown> = {}
          for (const k of Object.keys(row)) r[k] = prettyBool(row[k])
          collected.push(r)
        }
        setRowsLoaded((n) => n + res.data.length)
      },
      complete: () => {
        setParsing(false)
        // drop trailing empty row(s)
        const clean = collected.filter((r) => Object.keys(r).length > 0)
        setDataSet(clean)
      },
      error: (err) => {
        setParsing(false)
        setError(`CSV parse error: ${err.message}`)
      },
    })
  }

  const parseFromUrl = async (url: string) => {
    try {
      setParsing(true)
      setRowsLoaded(0)
      setError(null)
      const res = await fetch(url, { headers: { 'content-type': 'text/csv;charset=UTF-8' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      const collected: any[] = []
      Papa.parse<Record<string, unknown>>(text, {
        header: true,
        worker: true,
        skipEmptyLines: 'greedy',
        chunkSize: 1024 * 1024,
        chunk: (res) => {
          for (const row of res.data) {
            const r: Record<string, unknown> = {}
            for (const k of Object.keys(row)) r[k] = prettyBool(row[k])
            collected.push(r)
          }
          setRowsLoaded((n) => n + res.data.length)
        },
        complete: () => {
          setParsing(false)
          const clean = collected.filter((r) => Object.keys(r).length > 0)
          setDataSet(clean)
        },
        error: (err) => {
          setParsing(false)
          setError(`CSV parse error: ${err.message}`)
        },
      })
    } catch (e: any) {
      setParsing(false)
      setError(`Fetch error: ${e.message}`)
    }
  }

  const navigateNext = () => {
    // mirror your old logic: build overallResult from ids
    const overallResult = dataSet
      .filter((r) => r && r.id !== undefined && r.id !== null)
      .map((r) => ({ id: r.id }))

    navigate('/dataset-attributes', {
      state: {
        data: dataSet,
        overallResult,
        selectedAttributes: [],
        options: {},
        categorical,
        numerical,
      },
    })
  }

  return (
    <>
      <div className="largeHeader" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Data Loading</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/"><button className="nextButton button" type="button">Back</button></Link>
          <button className="nextButton button" type="button" onClick={navigateNext} disabled={parsing || dataSet.length === 0}>
            Next
          </button>
        </div>
      </div>

      <div>
        <p className="text">
          {parsing
            ? <>Loading… parsed <b>{rowsLoaded}</b> items so far.</>
            : <>So far there have been <b>{Math.max(0, dataSet.length)}</b> items loaded. Click Next when loading has finished.</>}
        </p>
        <p className="text">If you want to choose another data set, click Back.</p>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </div>

      <div style={{ paddingBottom: '40%' }} />
    </>
  )
}
