import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Badge from "../components/Badge";
import ToastContainer from "../components/ToastContainer";
import SearchInput from "../components/SearchInput";
import { dummyResources } from "../data/dummyData";

function Resources() {
  // Load from localStorage or use dummy data
  const loadResources = () => {
    const saved = localStorage.getItem("resources");
    return saved ? JSON.parse(saved) : dummyResources;
  };

  const [resources, setResources] = useState(loadResources);
  const [searchQuery, setSearchQuery] = useState("");

  // Save to localStorage whenever resources change
  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  // Filter resources based on search
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [resources, searchQuery]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    type: "link",
    url: "",
    tags: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  const validateUrl = (url) => {
    if (uploadFormData.type === "link") {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
    return url.trim().length > 0;
  };
  
  const handleUpload = () => {
    const errors = {};
    if (!uploadFormData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!uploadFormData.url.trim()) {
      errors.url = uploadFormData.type === "link" ? "URL is required" : "File name is required";
    } else if (uploadFormData.type === "link" && !validateUrl(uploadFormData.url)) {
      errors.url = "Please enter a valid URL";
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      addToast("Please fix the form errors", "error");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newResource = {
        id: resources.length + 1,
        title: uploadFormData.title,
        type: uploadFormData.type,
        url: uploadFormData.url,
        tags: uploadFormData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setResources([newResource, ...resources]);
      setUploadFormData({ title: "", type: "link", url: "", tags: "" });
      setFormErrors({});
      setIsUploadModalOpen(false);
      setIsLoading(false);
      addToast("Resource uploaded successfully", "success");
    }, 300);
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter(r => r.id !== id));
      addToast("Resource deleted successfully", "success");
    }
  };
  
  const handleOpenModal = () => {
    setUploadFormData({ title: "", type: "link", url: "", tags: "" });
    setFormErrors({});
    setIsUploadModalOpen(true);
  };
  
  const getTypeIcon = (type) => {
    return type === "pdf" ? "📄" : "🔗";
  };
  
  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Resources
          </h1>
          <p className="text-lg text-gray-600">Store and organize your study materials</p>
        </div>
        <Button onClick={handleOpenModal} size="lg" className="shadow-lg">
          <span className="mr-2">+</span> Upload Resource
        </Button>
      </div>
      
      {/* Search */}
      {resources.length > 0 && (
        <Card variant="glass" className="border-0">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title or tags..."
            className="w-full"
          />
          {filteredResources.length !== resources.length && (
            <p className="text-sm font-medium text-gray-600 mt-3">
              Showing <span className="font-bold text-indigo-600">{filteredResources.length}</span> of <span className="font-bold">{resources.length}</span> resources
            </p>
          )}
        </Card>
      )}
      
      {/* Empty State */}
      {resources.length === 0 ? (
        <Card variant="gradient" className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
          <div className="text-center py-16">
            <div className="text-7xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No resources yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start organizing your study materials</p>
            <Button onClick={handleOpenModal} size="lg">
              Upload Your First Resource
            </Button>
          </div>
        </Card>
      ) : filteredResources.length === 0 ? (
        <Card variant="gradient" className="bg-gradient-to-br from-amber-50 to-orange-50 border-0">
          <div className="text-center py-16">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No resources found</h3>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your search</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} size="lg">
              Clear Search
            </Button>
          </div>
        </Card>
      ) : (
        /* Resources Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
          <Card key={resource.id} variant="gradient" className="bg-gradient-to-br from-white to-indigo-50/30 border-0 hover-lift group">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg ${
                resource.type === "pdf" 
                  ? "bg-gradient-to-br from-red-500 to-pink-500" 
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}>
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {resource.title}
                </h3>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{resource.type}</p>
              </div>
            </div>
            
            {resource.type === "link" ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 block truncate font-medium"
              >
                🔗 {resource.url}
              </a>
            ) : (
              <p className="text-sm text-gray-600 mb-4 font-medium">📄 PDF Document</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="default">{tag}</Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500">
                📅 {new Date(resource.uploadedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                {resource.type === "link" && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Open</Button>
                  </a>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(resource.id)}
                >
                  🗑
                </Button>
              </div>
            </div>
          </Card>
          ))}
        </div>
      )}
      
      {/* Upload Resource Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setFormErrors({});
        }}
        title="Upload Resource"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={uploadFormData.title}
            onChange={(e) => {
              setUploadFormData({ ...uploadFormData, title: e.target.value });
              if (formErrors.title) {
                setFormErrors({ ...formErrors, title: "" });
              }
            }}
            placeholder="Enter resource title"
            error={formErrors.title}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={uploadFormData.type}
              onChange={(e) => {
                setUploadFormData({ ...uploadFormData, type: e.target.value, url: "" });
                setFormErrors({ ...formErrors, url: "" });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          
          <Input
            label={uploadFormData.type === "link" ? "URL" : "File Name"}
            type={uploadFormData.type === "link" ? "url" : "text"}
            value={uploadFormData.url}
            onChange={(e) => {
              setUploadFormData({ ...uploadFormData, url: e.target.value });
              if (formErrors.url) {
                setFormErrors({ ...formErrors, url: "" });
              }
            }}
            placeholder={uploadFormData.type === "link" ? "https://example.com" : "document.pdf"}
            error={formErrors.url}
            required
          />
          
          <Input
            label="Tags (comma-separated)"
            value={uploadFormData.tags}
            onChange={(e) => setUploadFormData({ ...uploadFormData, tags: e.target.value })}
            placeholder="react, frontend, documentation"
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => {
              setIsUploadModalOpen(false);
              setFormErrors({});
            }} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Resource"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Resources;

