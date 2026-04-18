import { useState, useEffect, useMemo, useRef } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Badge from "../components/Badge";
import ToastContainer from "../components/ToastContainer";
import SearchInput from "../components/SearchInput";
import { dummyResources } from "../data/dummyData";

const TYPE_CONFIG = {
  pdf: {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-red-500 to-pink-500",
    bg: "from-red-50 to-pink-50",
    border: "border-red-100",
    badge: "danger",
    label: "PDF",
  },
  link: {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    gradient: "from-sky-500 to-cyan-500",
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-100",
    badge: "info",
    label: "Link",
  },
};

const EMPTY_FORM = { title: "", type: "link", url: "", tags: "" };

function Resources() {
  const nextIdRef = useRef(0);
  const [resources, setResources] = useState(() => {
    // TODO: Replace with backend API
    const saved = localStorage.getItem("resources");
    return saved ? JSON.parse(saved) : dummyResources;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with backend API
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  const getNextId = () => {
    nextIdRef.current += 1;
    return nextIdRef.current;
  };

  const filtered = useMemo(() =>
    resources.filter((r) => {
      const q = searchQuery.toLowerCase();
      return !q || r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q));
    }),
    [resources, searchQuery]
  );

  const addToast = (message, type = "success") => {
    const id = getNextId();
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const openModal = () => { setForm(EMPTY_FORM); setFormErrors({}); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setFormErrors({}); };

  const validateUrl = (url) => {
    if (form.type === "link") { try { new URL(url); return true; } catch { return false; } }
    return url.trim().length > 0;
  };

  const handleUpload = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.url.trim()) errs.url = form.type === "link" ? "URL is required" : "File name is required";
    else if (form.type === "link" && !validateUrl(form.url)) errs.url = "Please enter a valid URL";
    setFormErrors(errs);
    if (Object.keys(errs).length) return addToast("Please fix form errors", "error");

    setIsLoading(true);
    setTimeout(() => {
      const newRes = {
        id: `resource-${getNextId()}`,
        title: form.title,
        type: form.type,
        url: form.url,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setResources((p) => [newRes, ...p]);
      setIsLoading(false);
      closeModal();
      addToast("Resource added!", "success");
    }, 300);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this resource?")) return;
    setResources((p) => p.filter((r) => r.id !== id));
    addToast("Resource deleted", "success");
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ─── Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resources</h1>
          <p className="text-slate-500 text-sm mt-1">Store and organise your study materials</p>
        </div>
        <Button onClick={openModal}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Add Resource
        </Button>
      </div>

      {/* ─── Search ──────────────────────────── */}
      {resources.length > 0 && (
        <Card variant="default" padding="md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or tag…"
          />
          {searchQuery && filtered.length !== resources.length && (
            <p className="text-xs text-slate-500 mt-3 font-medium">
              Showing <strong className="text-brand-600">{filtered.length}</strong> of <strong>{resources.length}</strong> resources
            </p>
          )}
        </Card>
      )}

      {/* ─── Empty States ────────────────────── */}
      {resources.length === 0 ? (
        <Card variant="brand" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-5 shadow-button">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No resources yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Add links and PDFs to build your study library</p>
            <Button onClick={openModal} size="lg">Add First Resource</Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card variant="subtle" padding="lg">
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No results</h3>
            <p className="text-slate-500 text-sm mb-5">Try a different search term</p>
            <Button variant="secondary" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((resource) => {
            const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.link;
            return (
              <Card key={resource.id} variant="default" padding="none" className="group overflow-hidden">
                {/* Type accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-button flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                      {cfg.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug mb-1 truncate">
                        {resource.title}
                      </h3>
                      <Badge variant={cfg.badge} size="xs">{cfg.label}</Badge>
                    </div>
                  </div>

                  {/* URL */}
                  {resource.type === "link" ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 mb-4 truncate font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {resource.url}
                    </a>
                  ) : (
                    <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF Document
                    </p>
                  )}

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="default" size="xs">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {resource.type === "link" && (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <button className="px-3 py-1 text-xs font-bold text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors">
                            Open
                          </button>
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Upload Modal ─────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add Resource"
        description="Save a link or PDF to your study library"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); if (formErrors.title) setFormErrors({ ...formErrors, title: "" }); }}
            placeholder="e.g. React Documentation"
            error={formErrors.title}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => { setForm({ ...form, type: e.target.value, url: "" }); setFormErrors({ ...formErrors, url: "" }); }}
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none input-focus-ring bg-white hover:border-slate-300"
            >
              <option value="link">Link / URL</option>
              <option value="pdf">PDF Document</option>
            </select>
          </div>

          <Input
            label={form.type === "link" ? "URL" : "File Name"}
            type={form.type === "link" ? "url" : "text"}
            value={form.url}
            onChange={(e) => { setForm({ ...form, url: e.target.value }); if (formErrors.url) setFormErrors({ ...formErrors, url: "" }); }}
            placeholder={form.type === "link" ? "https://example.com" : "document.pdf"}
            error={formErrors.url}
            required
          />

          <Input
            label="Tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="react, frontend, docs (comma separated)"
            hint="Add tags to make this resource easier to find"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? "Saving…" : "Add Resource"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Resources;
