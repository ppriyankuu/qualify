"use client";

import React from "react";
import { Plus, Trash2, FileCheck } from "lucide-react";
import { ScholarshipDocument } from "@/types/scholarship";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface DocumentEditorProps {
  documents: ScholarshipDocument[];
  onChange: (docs: ScholarshipDocument[]) => void;
}

export function DocumentEditor({ documents, onChange }: DocumentEditorProps) {
  const addDocument = () => {
    const newDoc: ScholarshipDocument = {
      id: `doc-${Date.now()}`,
      documentName: "",
      isMandatory: true,
      instructions: "",
    };
    onChange([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  const updateDocument = (
    id: string,
    updatedFields: Partial<ScholarshipDocument>
  ) => {
    onChange(
      documents.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div>
          <h3 className="font-display font-black text-lg text-black">
            Required Documents Checklist
          </h3>
          <p className="text-xs font-medium text-neutral-600">
            Define certificates and records students must prepare before applying.
          </p>
        </div>

        <button
          type="button"
          onClick={addDocument}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-neo-yellow px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add Required Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-black/30 p-8 text-center space-y-2">
          <FileCheck className="mx-auto h-8 w-8 text-neutral-400" />
          <p className="text-xs font-bold text-neutral-600">
            No required documents added yet. Click &quot;Add Required Document&quot; above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div
              key={doc.id}
              className="rounded-2xl border-2 border-black bg-white p-4 shadow-neo-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="mint" size="sm">
                  Document #{idx + 1}
                </Badge>

                <button
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  title="Remove Document"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-neutral-600 shadow-neo-sm hover:bg-neo-red hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <Input
                    label="Document Name"
                    placeholder="e.g. Income Certificate / Domicile Certificate"
                    value={doc.documentName}
                    onChange={(e) =>
                      updateDocument(doc.id, { documentName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <Input
                    label="Issuing Authority / Guidelines"
                    placeholder="e.g. Issued by competent Tehsildar or SDO"
                    value={doc.instructions || ""}
                    onChange={(e) =>
                      updateDocument(doc.id, { instructions: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <Checkbox
                  checked={doc.isMandatory}
                  onCheckedChange={(checked) =>
                    updateDocument(doc.id, { isMandatory: !!checked })
                  }
                  label="Mandatory Certificate"
                  description="Required for successful scholarship submission."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
