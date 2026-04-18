import { useState, useEffect, useMemo, useRef } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
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
    gradient: "from-red-400 to-pink-400",
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
    gradient: "from-sky-400 to-cyan-400",
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
  const resourceStats = useMemo(() => {
    const linkCount = resources.filter((resource) => resource.type === "link").length;
    const pdfCount = resources.filter((resource) => resource.type === "pdf").length;
    const totalTags = new Set(resources.flatMap((resource) => resource.tags)).size;

    return [
      { label: "Total Resources", value: resources.length, tone: "text-slate-700 bg-slate-100 border-slate-200" },
      { label: "Links", value: linkCount, tone: "text-sky-700 bg-sky-50 border-sky-200" },
      { label: "PDFs", value: pdfCount, tone: "text-rose-700 bg-rose-50 border-rose-200" },
      { label: "Topics", value: totalTags, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    ];
  }, [resources]);

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
    <div className="space-y-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ─── Header ──────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-900">Study library</h1>
            <p className="mt-1 text-sm text-slate-600">Store and organise your study materials</p>
          </div>
          <Button onClick={openModal}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Add Resource
          </Button>
        </div>

        {resources.length > 0 && (
          <div className="max-w-3xl">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or tag…"
            />
            {searchQuery && filtered.length !== resources.length && (
              <p className="mt-3 text-xs font-medium text-slate-600">
                Showing <strong className="text-brand-600">{filtered.length}</strong> of <strong>{resources.length}</strong> resources
              </p>
            )}
          </div>
        )}
      </div>

      <Card variant="default" padding="lg" className="border-slate-200 bg-white/95 shadow-card">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Study library</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-none tracking-tight text-slate-900">Keep useful notes, links, and references in one clean place.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              This module is intentionally lightweight so you can quickly save learning material, tag it clearly, and return to it during study sessions or collaboration rooms.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {resourceStats.map((item) => (
              <div key={item.label} className={`rounded-3xl border px-4 py-4 ${item.tone}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">{item.label}</p>
                <p className="mt-2 font-ui text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ─── Empty States ────────────────────── */}
      {resources.length === 0 ? (
        <Card variant="default" padding="lg">
          <div className="text-center py-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-white shadow-button">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">No resources yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">
              Build a simple study library by saving your most useful links, notes, and PDFs here.
            </p>
            <Button className="mt-6" onClick={openModal}>
              Add First Resource
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card variant="subtle" padding="lg">
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching resources</h3>
            <p className="mt-2 text-sm text-slate-600">Try a different keyword or clear the current search.</p>
            <Button variant="secondary" className="mt-5" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((resource) => {
            const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.link;
            return (
              <Card key={resource.id} variant="default" padding="none" className="group overflow-hidden transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-card-hover">
                {/* Type accent bar */}
                <div className={`h-0.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

                <div className="p-6">
                  {/* Header row */}
                  <div className="mb-5 flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-button flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.03]`}>
                      {cfg.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1.5 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-600 truncate">
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
                      className="mb-5 flex items-center gap-1.5 truncate text-xs font-medium text-brand-600 hover:text-brand-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {resource.url}
                    </a>
                  ) : (
                    <p className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF Document
                    </p>
                  )}

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="default" size="xs">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {resource.type === "link" && (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <button className="rounded-xl border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50">
                            Open
                          </button>
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="rounded-xl p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
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
