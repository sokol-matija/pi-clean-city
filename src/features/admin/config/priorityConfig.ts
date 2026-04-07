/* 
    OCP - Priority Configuration
*/

interface PriorityOption {
  value: string
  label: string
}

export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },

  // Add new priority here
] as const
