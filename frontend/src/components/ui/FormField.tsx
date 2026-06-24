interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  colSpan?: "full";
}

export function FormField({ label, required, children, colSpan }: FormFieldProps) {
  return (
    <div className={colSpan === "full" ? "sm:col-span-2 col-span-1 mb-4" : "mb-4"}>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
