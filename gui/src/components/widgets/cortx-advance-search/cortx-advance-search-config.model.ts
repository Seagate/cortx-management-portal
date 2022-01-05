import { CortxDropdownOption } from '../dropdown/cortx-dropdown-model';

export interface AdvanceSearchConfig {
  placeholder?: string,
  autoSearch?: boolean,
  advanceForm?: AdvanceFormField[];
}
export interface AdvanceFormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  options?: CortxDropdownOption[];
  required?: boolean;
  value?: any;
}