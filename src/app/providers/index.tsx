import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';

import { env } from '@/app/config/env';
import { AuthProvider } from '@/app/providers/auth-provider';
import { DataSourceContext } from '@/app/providers/data-source-context';
import { createDataSource } from '@/data/adapters/create-data-source';

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function AppProviders({ children }: { children: ReactNode }) {
  const dataSource = useMemo(() => createDataSource(env.dataSource), []);
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <DataSourceContext value={dataSource}>
        <AuthProvider>{children}</AuthProvider>
      </DataSourceContext>
    </QueryClientProvider>
  );
}
