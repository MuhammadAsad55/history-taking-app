export function calculateAge(dob) {
  if (!dob) return '?';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatMonthYear(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTimestamp(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const CURRENT_YEAR = new Date().getFullYear();
export const MAX_VALID_YEAR = CURRENT_YEAR;

export function isValidDate(dateString) {
  if (!dateString) return false;
  const year = parseInt(dateString.split('-')[0], 10);
  const maxDate = new Date().toISOString().split('T')[0];
  if (year < 1900 || year > MAX_VALID_YEAR) return false;
  if (dateString > maxDate) return false;
  return true;
}

export function isValidMonthYear(value) {
  if (!value) return false;
  const parts = value.split('-');
  if (parts.length !== 2) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const now = new Date();
  if (year < 1900 || year > now.getFullYear()) return false;
  if (month < 1 || month > 12) return false;
  if (year === now.getFullYear() && month > now.getMonth() + 1) return false;
  return true;
}