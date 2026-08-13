import { DesktopOnlyGate } from '@/app/desktop-only-gate';
import { AppProviders } from '@/app/providers';
import { AppRouter } from '@/app/router';

export default function App() {
  return (
    <DesktopOnlyGate>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </DesktopOnlyGate>
  );
}
