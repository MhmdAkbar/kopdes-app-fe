// src/components/templates/DashboardLayout.jsx
import { Navigation } from '../organisms/Navigation.jsx';
import { PageTransition } from '../atoms/PageTransition.jsx';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-base flex selection:bg-kop-main selection:text-white">
      <Navigation />
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
};