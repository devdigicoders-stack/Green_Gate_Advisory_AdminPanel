import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  counts, 
  searchTerm, 
  setSearchTerm, 
  onRefresh, 
  isRefreshing,
  onSelectServiceFilter 
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="min-h-screen bg-sand-surface flex font-sans text-charcoal selection:bg-gold/30">
      {/* Fixed Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        onSelectServiceFilter={onSelectServiceFilter}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          counts={counts}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
