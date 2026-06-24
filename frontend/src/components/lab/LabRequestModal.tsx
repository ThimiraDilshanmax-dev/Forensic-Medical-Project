import { useState } from "react";
import { X, Send } from "lucide-react";
import { Btn } from "@/components/ui/Btn";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { CheckGroup } from "@/components/ui/CheckGroup";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { genId } from "@/lib/utils";
import { TEST_LABELS } from "@/data/mockData";
import type { LabRequest, Patient, AppUser, Urgency } from "@/types";

const TEST_OPTIONS = Object.entries(TEST_LABELS).map(([value, label]) => ({ value, label }));

interface Props {
  patientId: string;
  formId: string;
  formType: string;
  currentUser: AppUser;
  patients: Patient[];
  onSave: (r: LabRequest) => void;
  onClose: () => void;
}

export function LabRequestModal({ patientId, formId, formType, currentUser, patients, onSave, onClose }: Props) {
  const patient = patients.find(p => p.id === patientId);
  const [testTypes, setTestTypes] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<Urgency>("routine");
  const [clinicalHistory, setClinicalHistory] = useState("");

  const toggleTest = (val: string) =>
    setTestTypes(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleSave = () => {
    const req: LabRequest = {
      id: genId("LAB"),
      patientId, requestedBy: currentUser.id, requestedByName: currentUser.name,
      requestedAt: new Date().toISOString(), formType, formId,
      testTypes, urgency, clinicalHistory,
      status: "pending", testResults: "", observations: "", conclusion: "", labTechName: "", completedAt: "",
    };
    onSave(req);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-800" style={{ fontFamily: "var(--font-family-heading)" }}>Request Lab Report</h2>
            {patient && <p className="text-xs text-slate-500">{patient.name} · {patientId}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <FormField label="Tests Requested">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              {TEST_OPTIONS.map(t => (
                <CheckGroup key={t.value} label={t.label} checked={testTypes.includes(t.value)} onChange={() => toggleTest(t.value)} />
              ))}
            </div>
          </FormField>
          <FormField label="Urgency">
            <RadioGroup name="urgency" value={urgency}
              options={[{ value: "routine", label: "Routine" }, { value: "urgent", label: "Urgent" }, { value: "stat", label: "STAT" }]}
              onChange={v => setUrgency(v as Urgency)} />
          </FormField>
          <FormField label="Clinical History / Reason">
            <Textarea value={clinicalHistory} onChange={setClinicalHistory} rows={3} />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" icon={<Send size={14} />} onClick={handleSave} disabled={testTypes.length === 0}>
            Send Request
          </Btn>
        </div>
      </div>
    </div>
  );
}
