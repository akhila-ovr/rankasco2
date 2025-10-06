import { createBrowserRouter } from 'react-router-dom'
import Home from './screens/Home'
import DataLoading from './screens/DataLoading'
import DatasetAttributes from './screens/DatasetAttributes'
import NotFound from './screens/NotFound'

export const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <NotFound /> },
  { path: '/data-loading', element: <DataLoading /> },
  { path: '/dataset-attributes', element: <DatasetAttributes /> },
  { path: '*', element: <NotFound /> }, // catch-all
])
