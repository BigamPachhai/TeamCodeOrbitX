import { useState } from "react";
import { FileText, ChevronRight, Check } from "lucide-react";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export default function IssueTemplates({ onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["issue-templates"],
    queryFn: async () => {
      const { data } = await api.get("/issues/templates");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    if (onSelectTemplate) {
      onSelectTemplate({
        category: template.category,
        description: template.description,
        name: template.name,
      });
    }
  };

  if (!templates || templates.length === 0) {
    return null;
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quick Report Templates
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Select a template to quickly report common issues
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-[#003865] mb-3 uppercase tracking-wide border-b border-gray-200 pb-2">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 border-2 rounded-lg text-left hover:border-[#003865] transition-all ${
                      selectedTemplate === template.id
                        ? "border-[#003865] bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900 text-sm">
                            {template.name}
                          </h5>
                          {selectedTemplate === template.id && (
                            <Check className="w-4 h-4 text-[#003865] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 ${
                          selectedTemplate === template.id
                            ? "text-[#003865]"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Template selected!</strong> The form will be pre-filled when you continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

