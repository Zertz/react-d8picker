export interface RenderDayProps {
  "aria-disabled": boolean;
  "aria-label": string;
  className: string;
  day: number | null;
  disabled: boolean;
  onClick: (event: any) => void;
  onKeyDown: (event: any) => void;
  role: string;
  setRef: (ref: HTMLDivElement) => void;
  tabIndex: number;
}

export interface RenderHeaderProps {
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  date: Date;
  decreaseMonth: () => void;
  decreaseYear: () => void;
  increaseMonth: () => void;
  increaseYear: () => void;
  monthContainer: any;
  nextMonthButtonDisabled: boolean;
  nextYearButtonDisabled: boolean;
  prevMonthButtonDisabled: boolean;
  prevYearButtonDisabled: boolean;
  selectingDate: any;
}

export interface RenderInputProps {
  className: string;
  disabled: boolean;
  id: string;
  name: string;
  onBlur: (event: any) => void;
  onChange: (event: any) => void;
  onClick: () => void;
  onFocus: (event: any) => void;
  onKeyDown: (event: any) => void;
  readOnly: boolean;
  required: boolean;
  setRef: (ref: HTMLInputElement) => void;
  title: string;
  value: Date;
}
