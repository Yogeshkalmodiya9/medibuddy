export type LabStatus =
  | 'Within displayed range'
  | 'Above displayed range'
  | 'Below displayed range'
  | 'Cannot determine';

export interface TestParameter {
  id: string;
  parameterName: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  hinglishExplanation: string;
  simpleExplanationEn: string;
  clinicalCaution?: string;
  isImportant?: boolean;
}

export interface LabReport {
  id: string;
  uploadId?: string;
  dataSource?: 'demo' | 'user_upload';
  title: string;
  category: 'Complete Blood Count (CBC)' | 'Widal Test' | 'Lipid Profile' | 'Thyroid' | 'General';
  reportDate: string;
  patientName: string;
  patientAgeGender?: string;
  labName: string;
  doctorName?: string;
  parameters: TestParameter[];
  overallSummaryHinglish: string;
  overallSummaryEn: string;
  originalDocumentUrl?: string;
  isSample?: boolean;
}

export type MedicineConfidence =
  | 'Verified from readable prescription/label'
  | 'Partially verified'
  | 'Cannot safely identify';

export interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  activeIngredient?: string;
  categoryTag?: string; // e.g. "Fever / Pain", "Antibiotic", "Acidity"
  dosage: string; // e.g. "1 tablet"
  frequency: string; // e.g. "3 times a day", "1-0-1"
  timing: string; // e.g. "Before breakfast", "After food"
  duration: string; // e.g. "5 days"
  route?: string; // e.g. "Oral"
  commonPurpose: string;
  prescribedPurpose: string;
  source: 'Prescription' | 'Label' | 'User entered' | 'Medicine Strip';
  confidence: MedicineConfidence;
  confidenceTag: 'green' | 'yellow' | 'red';
  safetyNotes?: string;
  takenToday?: boolean;
}

export interface PotentialInteraction {
  id: string;
  title: string;
  severity: 'Needs Verification' | 'Attention' | 'Information';
  description: string;
  medicinesInvolved: string[];
  recommendation: string;
}

export interface TimelineSlot {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'medicine' | 'meal' | 'hydration';
  status: 'pending' | 'completed' | 'missed';
  medicineId?: string;
  instructions?: string;
}

export interface PrescriptionChange {
  id: string;
  type: 'new' | 'dose_changed' | 'removed' | 'frequency_changed';
  title: string;
  medicineName: string;
  oldValue?: string;
  newValue?: string;
  badge: string;
  badgeColor: 'green' | 'orange' | 'red' | 'blue';
}

export interface LabChange {
  id: string;
  parameterName: string;
  oldValue: string;
  newValue: string;
  trend: 'improved' | 'attention' | 'neutral';
  statusBadge: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange?: string;
  status: 'Within range' | 'Normal' | 'Needs attention' | 'High' | 'Low';
  statusColor: 'green' | 'amber' | 'red';
  simpleExplanation: string;
  iconType: 'hemoglobin' | 'wbc' | 'platelets' | 'temperature' | 'bloodPressure' | 'bloodSugar' | 'weight';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  keyTakeaways?: string[];
  questionsForDoctor?: string[];
}
