import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import { Contexts } from './common/contexts'
import { Routes } from './common/routes'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/*"
      element={
        <Contexts>
          <Routes />
          {import.meta.env.MODE !== 'test' && <ReactQueryDevtools />}
        </Contexts>
      }
    />,
  ),
)

export function App(): JSX.Element {
  return <RouterProvider router={router} />
}
