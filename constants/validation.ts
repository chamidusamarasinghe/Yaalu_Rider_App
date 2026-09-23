export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  normalizedValue?: string;
}

export interface CountryCodeItem {
  code: string;
  country: string;
  flag: string;
  name: string;
}

export const COUNTRY_CODES: CountryCodeItem[] = [
  { code: '+94', country: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States / Canada' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
];

export function validatePhoneNumber(countryCode: string, rawPhone: string): ValidationResult {
  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (!digitsOnly) {
    return { isValid: false, errorMessage: 'Phone number is required.' };
  }

  if (countryCode === '+94') {
    let cleaned = digitsOnly;
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    if (cleaned.length !== 9) {
      return {
        isValid: false,
        errorMessage: `Sri Lankan phone numbers must be exactly 9 digits (e.g. 771234567). Entered ${cleaned.length} digits.`,
      };
    }

    if (!cleaned.startsWith('7')) {
      return {
        isValid: false,
        errorMessage: 'Sri Lankan mobile numbers must start with 7 (e.g. 771234567).',
      };
    }

    return { isValid: true };
  }

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      errorMessage: `Phone number must be between 7 and 15 digits. Entered ${digitsOnly.length} digits.`,
    };
  }

  return { isValid: true };
}

export function validateNicNumber(rawNic: string): ValidationResult {
  const trimmed = rawNic.trim().toUpperCase();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'NIC number is required.' };
  }

  const oldNicRegex = /^[0-9]{9}[VX]$/;
  const newNicRegex = /^[0-9]{12}$/;

  if (!oldNicRegex.test(trimmed) && !newNicRegex.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Invalid Sri Lankan NIC. Use Old NIC (9 digits + V/X, e.g. 921823456V) or New NIC (12 digits, e.g. 199218234567).',
    };
  }

  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'Email address cannot be empty.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address (e.g. rider@yaalu.lk).' };
  }

  return { isValid: true };
}

export function formatExpiryDateInput(text: string): string {
  const cleaned = text.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 4) {
    return cleaned;
  }
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
}

export function normalizeExpiryDate(dateStr: string): string {
  const parts = dateStr.trim().split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

export function validateExpiryDate(formattedDate: string): ValidationResult {
  if (!formattedDate.trim()) {
    return { isValid: false, errorMessage: 'License expiry date is required.' };
  }

  const normalized = normalizeExpiryDate(formattedDate);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(normalized)) {
    return { isValid: false, errorMessage: 'Expiry date must be in YYYY-MM-DD format (e.g. 2027-07-03).' };
  }

  const [yearStr, monthStr, dayStr] = normalized.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return { isValid: false, errorMessage: 'Invalid month in expiry date (must be 01-12).' };
  }
  if (day < 1 || day > 31) {
    return { isValid: false, errorMessage: 'Invalid day in expiry date (must be 01-31).' };
  }
  if (year < 2024 || year > 2060) {
    return { isValid: false, errorMessage: 'Expiry year must be between 2024 and 2060.' };
  }

  return { isValid: true, normalizedValue: normalized };
}
