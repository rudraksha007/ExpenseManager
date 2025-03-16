"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import React, { useState } from "react";
import { string } from "zod";

export type FormField = {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "file" | "textarea";
  required?: boolean;
  readOnly?: boolean;
  value?: string | number;
  min?: number;
  max?: number;
  accept?: string;
  multiple?: boolean;
  rows?: number;
};

interface button {
  label: string;
  submit?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
export type FormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  title: string;
  fields: FormField[] | null;
  loading?: boolean;
  element?: React.ReactElement<FormDialogProps>;
  buttons?: button[]
};

export function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  element,
  loading = false,
  buttons
}: FormDialogProps) {  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(formRef.current as HTMLFormElement);   
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          form.append(key, file);
        });
      } else {
        form.append(key, value);
      }
    });


    onSubmit(form);
  };

  const handleInputChange = (
    field: FormField,
    value: string | number | FileList | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field.id]: value,
    }));
  };
  if (!fields) return element ? React.cloneElement(element, { isOpen, onClose, onSubmit, title, fields, loading }) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
            {fields.map((field) => {
              return <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    required={field.required}
                    readOnly={field.readOnly}
                    name={field.id}
                    value={formData[field.id] || ""}
                    rows={field.rows}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    type={field.type}
                    id={field.id}
                    required={field.required}
                    readOnly={field.readOnly}
                    name={field.type!=='file'?field.id : ''}
                    value={
                      field.type !== "file"
                        ? formData[field.id] || field.value || ""
                        : undefined
                    }
                    min={field.min}
                    max={field.max}
                    accept={field.accept}
                    multiple={field.multiple}
                    onChange={(e) =>
                      handleInputChange(
                        field,
                        field.type === "file"
                          ? e.target.files
                          : e.target.value
                      )
                    }
                    className={field.readOnly ? "bg-muted" : ""}
                  />
                )}
              </div>
})}
            {
              !buttons ? <div className="flex justify-end pt-4"><Button type="submit">Submit</Button></div> :
                <div className="flex justify-between pt-4">
                  {buttons.map((button, index) => (
                    <Button key={index} type={button.submit ? "submit" : "button"} onClick={button.onClick} disabled={button.disabled}>
                      {button.label}
                    </Button>
                  ))}
                </div>
            }

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}