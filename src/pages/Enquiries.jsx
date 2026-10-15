import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  RotateCw, 
  Eye, 
  Trash2, 
  Calendar, 
  Building2, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Inbox, 
  Download, 
  ExternalLink,
  ChevronDown,
  Phone,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import ProfileView from '../components/ProfileView';
import SettingsView from '../components/SettingsView';
import EnquiryDetailModal from '../components/EnquiryDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const STATUS_TABS = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new', label: 'New' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' }
];

export default function Enquiries() {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'profile' | 'settings'
  const [enquiries, setEnquiries] = useState([]);
  const [counts, setCounts] = useState({ all: 0, new: 0, in_progress: 0, contacted: 0, resolved: 0, closed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('-createdAt');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Modals state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEnquiries = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    setErrorMsg('');
    try {
      const res = await api.getEnquiries({
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortOrder
      });

      if (res.success) {
        setEnquiries(res.enquiries || []);
        if (res.pagination) {
          setPagination(prev => ({
            ...prev,
            total: res.pagination.total,
            totalPages: res.pagination.totalPages
          }));
        }
        if (res.counts) {
          setCounts(res.counts);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch inquiries.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, statusFilter, pagination.page, pagination.limit, sortOrder]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Inline Status Update Handler
  const handleInlineStatusChange = async (enquiryId, newStatus) => {
    setUpdatingStatusId(enquiryId);
    try {
      const res = await api.updateEnquiryStatus(enquiryId, { status: newStatus });
      if (res.success) {
        setEnquiries(prev => prev.map(item => item._id === enquiryId ? { ...item, status: newStatus } : item));
        fetchEnquiries(true);
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Full status update from detail modal
  const handleModalStatusUpdate = async (id, data) => {
    const res = await api.updateEnquiryStatus(id, data);
    if (res.success) {
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, ...data } : e));
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(prev => ({ ...prev, ...data }));
      }
      fetchEnquiries(true);
    }
    return res;
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await api.deleteEnquiry(deletingId);
      setEnquiries(prev => prev.filter(e => e._id !== deletingId));
      if (selectedEnquiry && selectedEnquiry._id === deletingId) {
        setSelectedEnquiry(null);
      }
      setDeletingId(null);
      fetchEnquiries(true);
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV Handler
  const handleExportCSV = () => {
    if (!enquiries || enquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }

    const headers = [
      'Full Name',
      'Organisation',
      'Work Email',
      'Phone',
      'Country/Region',
      'Service Interest',
      'Enquiry Type',
      'Status',
      'Date Submitted',
      'Admin Notes',
      'Client Requirement'
    ];

    const rows = enquiries.map(item => [
      `"${(item.fullName || '').replace(/"/g, '""')}"`,
      `"${(item.organisation || '').replace(/"/g, '""')}"`,
      `"${(item.workEmail || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.countryOrRegion || '').replace(/"/g, '""')}"`,
      `"${(item.serviceInterest || '').replace(/"/g, '""')}"`,
      `"${(item.enquiryType || '').replace(/"/g, '""')}"`,
      `"${(item.status || '').replace(/"/g, '""')}"`,
      `"${item.createdAt ? new Date(item.createdAt).toISOString() : ''}"`,
      `"${(item.adminNotes || '').replace(/"/g, '""')}"`,
      `"${(item.requirementDescription || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GGA_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for formatted dates
  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: '—', time: '' };
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      counts={counts}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onRefresh={() => fetchEnquiries(false)}
      isRefreshing={isRefreshing}
    >
      {/* Tab 1: Profile View */}
      {activeTab === 'profile' && (
        <ProfileView />
      )}

      {/* Tab 2: Settings View */}
      {activeTab === 'settings' && (
        <SettingsView />
      )}

      {/* Tab 3: Website Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Controls & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sand-border shadow-subtle space-y-4">
            
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-sand-border/80 scrollbar-none">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.id;
                const count = counts[tab.id] ?? 0;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab.id);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-sand-surface hover:bg-sand-border/40 text-charcoal'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-gold text-forest-dark' : 'bg-white border border-sand-border text-charcoal-muted'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters: Sort & CSV Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              
              {/* Mobile Search input */}
              <div className="md:hidden relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-charcoal-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-sand-surface rounded-xl border border-sand-border focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div className="text-xs text-charcoal-muted">
                Showing <strong className="text-forest">{enquiries.length}</strong> inquiries submitted from website form
              </div>

              {/* Right Side: Sort Order & CSV Export */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-sand-surface border border-sand-border text-xs rounded-xl px-3 py-2 text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={enquiries.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-gold" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button 
                type="button" 
                onClick={() => fetchEnquiries(false)} 
                className="underline font-bold text-rose-800"
              >
                Retry
              </button>
            </div>
          )}

          {/* Inquiries Table Card */}
          <div className="bg-white rounded-3xl border border-sand-border shadow-subtle overflow-hidden">
            {isLoading ? (
              <div className="p-16 text-center space-y-4">
                <RotateCw className="w-8 h-8 text-forest animate-spin mx-auto" />
                <p className="text-xs text-charcoal-muted font-mono">
                  Loading inquiries from website...
                </p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-sand-surface text-forest flex items-center justify-center mx-auto border border-sand-border">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-forest-dark">
                  No Website Inquiries Yet
                </h3>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto leading-relaxed">
                  Jab koi client aapki public website ke Contact form se inquiry submit karega, wo yahan real-time me show hoga.
                </p>
                <div className="pt-2">
                  <a
                    href={`${import.meta.env.VITE_SITE_URL || 'https://green-gate-advisory.vercel.app'}/en/contact`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition-colors"
                  >
                    <span>Test Website Form</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sand-border/80 bg-sand-surface/60 text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                      <th className="py-3.5 px-4 sm:px-6">Client / Organisation</th>
                      <th className="py-3.5 px-4">Service Required</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Submitted At</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-border/60 text-xs">
                    {enquiries.map((item) => {
                      const { date, time } = formatDateTime(item.createdAt);
                      const isUpdatingThis = updatingStatusId === item._id;

                      return (
                        <tr 
                          key={item._id}
                          className="hover:bg-sand-surface/50 transition-colors group"
                        >
                          {/* Client & Org */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-forest/10 border border-forest/20 text-forest font-bold font-mono text-xs flex items-center justify-center flex-shrink-0">
                                {item.fullName ? item.fullName.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-forest-dark block truncate">
                                  {item.fullName}
                                </span>
                                <span className="text-[11px] text-charcoal-muted flex items-center gap-1 truncate">
                                  <Building2 className="w-3 h-3 flex-shrink-0" />
                                  <span>{item.organisation || 'Independent'}</span>
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Service Required */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-forest/5 text-forest border border-forest/10 max-w-[180px] truncate">
                              {item.serviceInterest || 'General Inquiry'}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <a 
                                href={`mailto:${item.workEmail}`}
                                className="text-forest hover:text-gold-dark hover:underline flex items-center gap-1.5 font-medium truncate max-w-[190px]"
                                title={`Send email to ${item.workEmail}`}
                              >
                                <Mail className="w-3 h-3 flex-shrink-0 text-charcoal-muted" />
                                <span className="truncate">{item.workEmail}</span>
                              </a>
                              {item.countryOrRegion && (
                                <div className="flex items-center gap-1 text-[11px] text-charcoal-muted">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{item.countryOrRegion}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Submission Date */}
                          <td className="py-4 px-4 text-charcoal-muted font-mono text-[11px]">
                            <span className="block text-charcoal font-medium">{date}</span>
                            <span className="text-[10px] text-charcoal-muted">{time}</span>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-4 px-4">
                            <div className="relative inline-block">
                              <select
                                value={item.status || 'new'}
                                disabled={isUpdatingThis}
                                onChange={(e) => handleInlineStatusChange(item._id, e.target.value)}
                                className={`text-[11px] font-bold rounded-full py-1 pl-2.5 pr-6 appearance-none border transition-colors cursor-pointer ${
                                  item.status === 'new' 
                                    ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                    : item.status === 'in_progress' 
                                    ? 'bg-blue-50 text-blue-800 border-blue-300' 
                                    : item.status === 'contacted' 
                                    ? 'bg-teal-50 text-teal-800 border-teal-300' 
                                    : item.status === 'resolved' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                    : 'bg-slate-100 text-slate-800 border-slate-300'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="contacted">Contacted</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none opacity-60" />
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedEnquiry(item)}
                                className="p-2 rounded-xl text-forest hover:bg-forest/10 border border-sand-border transition-colors shadow-2xs"
                                title="View Full Details & Requirement"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeletingId(item._id)}
                                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-sand-border transition-colors shadow-2xs"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 bg-sand-surface/60 border-t border-sand-border flex items-center justify-between text-xs text-charcoal">
                <span>
                  Showing Page <strong className="text-forest">{pagination.page}</strong> of{' '}
                  <strong className="text-forest">{pagination.totalPages}</strong> ({pagination.total} records)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="p-1.5 rounded-lg border border-sand-border bg-white hover:bg-sand-surface disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="p-1.5 rounded-lg border border-sand-border bg-white hover:bg-sand-surface disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdateStatus={handleModalStatusUpdate}
        onDelete={(id) => {
          setSelectedEnquiry(null);
          setDeletingId(id);
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingId)}
        isDeleting={isDeleting}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  );
}
