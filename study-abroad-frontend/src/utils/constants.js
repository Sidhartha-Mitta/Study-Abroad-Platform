export const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'France', 'New Zealand', 'Ireland', 'Singapore'].map((value) => ({ value, label: value }))
export const FIELDS_OF_STUDY = ['Computer Science', 'Business', 'Engineering', 'Medicine', 'Arts', 'Law', 'Data Science', 'Design', 'Finance', 'Public Policy'].map((value) => ({ value, label: value }))
export const DEGREE_TYPES = ['Bachelors', 'Masters', 'PhD', 'Diploma'].map((value) => ({ value, label: value }))
export const INTAKE_MONTHS = ['January', 'March', 'May', 'September', 'October'].map((value) => ({ value, label: value }))
export const STATUSES = ['Applied', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn']
export const VALID_TRANSITIONS = {
  Applied: ['Reviewed', 'Withdrawn'],
  Reviewed: ['Accepted', 'Rejected', 'Withdrawn'],
  Accepted: ['Withdrawn'],
  Rejected: [],
  Withdrawn: [],
}
export const STATUS_COLORS = {
  Applied: 'info',
  Reviewed: 'warning',
  Accepted: 'success',
  Rejected: 'error',
  Withdrawn: 'neutral',
}
