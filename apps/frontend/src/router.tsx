import { createBrowserRouter } from 'react-router-dom'
import Home from './screens/Home'
import DataLoading from './screens/DataLoading'
import DatasetAttributes from './screens/DatasetAttributes'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/data-loading', element: <DataLoading /> },
  { path: '/dataset-attributes', element: <DatasetAttributes /> },
])
