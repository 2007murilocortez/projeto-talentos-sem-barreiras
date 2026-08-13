import { createBrowserRouter, RouterProvider } from 'react-router';

import { AppShell } from '@/app/layouts/app-shell';
import { HomePage } from '@/app/pages/home-page';
import { NotFoundPage } from '@/app/pages/not-found-page';
import { AdminHomePage, CandidateHomePage, CompanyHomePage } from '@/app/pages/role-pages';
import { SignInPage } from '@/app/pages/sign-in-page';
import { RequireRole } from '@/app/router/require-role';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'entrar', element: <SignInPage /> },
      {
        element: <RequireRole allowed={['candidate']} />,
        children: [{ path: 'candidato', element: <CandidateHomePage /> }],
      },
      {
        element: <RequireRole allowed={['company']} />,
        children: [{ path: 'empresa', element: <CompanyHomePage /> }],
      },
      {
        element: <RequireRole allowed={['admin']} />,
        children: [{ path: 'admin', element: <AdminHomePage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
