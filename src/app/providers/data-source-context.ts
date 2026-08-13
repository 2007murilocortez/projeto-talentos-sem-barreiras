import { createContext, useContext } from 'react';

import type { DataSource } from '@/data/ports';

export const DataSourceContext = createContext<DataSource | null>(null);

export function useDataSource(): DataSource {
  const dataSource = useContext(DataSourceContext);

  if (dataSource === null) {
    throw new Error('useDataSource precisa estar dentro de <AppProviders>.');
  }

  return dataSource;
}
