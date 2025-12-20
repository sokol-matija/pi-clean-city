/* 
    OCP - Priority Configuration
*/

export interface PriorityOption {
    value: string;
    label: string;
}

export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },

    // Add new priority here
] as const;


export function getPriorityLabel(value:  string): string {
  const option = PRIORITY_OPTIONS.find(opt => opt.value === value)
  return option?.label || value
}

export function isValidPriority(value: string): boolean {
  return PRIORITY_OPTIONS.some(opt => opt.value === value)
}

