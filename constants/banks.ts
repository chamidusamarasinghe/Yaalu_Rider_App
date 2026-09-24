export interface BankInfo {
  id: string;
  code: string;
  name: string;
  shortName: string;
  accountLengthRule: {
    exactLength?: number;
    minLength?: number;
    maxLength?: number;
  };
  hintText: string;
}

export interface BranchInfo {
  code: string;
  name: string;
  district: string;
}

export const SRI_LANKAN_BANKS: BankInfo[] = [
  {
    id: 'peoples',
    code: '7135',
    name: "People's Bank",
    shortName: "People's Bank",
    accountLengthRule: { exactLength: 15 },
    hintText: "People's Bank accounts must be exactly 15 digits.",
  },
  {
    id: 'combank',
    code: '7056',
    name: 'Commercial Bank of Ceylon PLC',
    shortName: 'Commercial Bank',
    accountLengthRule: { exactLength: 10 },
    hintText: 'Commercial Bank accounts must be exactly 10 digits.',
  },
  {
    id: 'boc',
    code: '7010',
    name: 'Bank of Ceylon (BOC)',
    shortName: 'BOC',
    accountLengthRule: { minLength: 10, maxLength: 15 },
    hintText: 'Bank of Ceylon accounts must be between 10 and 15 digits.',
  },
  {
    id: 'sampath',
    code: '7278',
    name: 'Sampath Bank PLC',
    shortName: 'Sampath Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'Sampath Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'hnb',
    code: '7083',
    name: 'Hatton National Bank PLC (HNB)',
    shortName: 'HNB',
    accountLengthRule: { exactLength: 12 },
    hintText: 'HNB accounts must be exactly 12 digits.',
  },
  {
    id: 'seylan',
    code: '7287',
    name: 'Seylan Bank PLC',
    shortName: 'Seylan Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'Seylan Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'ntb',
    code: '7162',
    name: 'Nations Trust Bank PLC (NTB)',
    shortName: 'Nations Trust Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'NTB accounts must be exactly 12 digits.',
  },
  {
    id: 'dfcc',
    code: '7454',
    name: 'DFCC Bank PLC',
    shortName: 'DFCC Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'DFCC Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'ndb',
    code: '7214',
    name: 'National Development Bank PLC (NDB)',
    shortName: 'NDB Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'NDB Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'sdb',
    code: '7728',
    name: 'SANASA Development Bank PLC (SDB)',
    shortName: 'SDB bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'SDB Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'panasia',
    code: '7311',
    name: 'Pan Asia Banking Corporation PLC',
    shortName: 'Pan Asia Bank',
    accountLengthRule: { minLength: 10, maxLength: 12 },
    hintText: 'Pan Asia Bank accounts must be 10 to 12 digits.',
  },
  {
    id: 'cargills',
    code: '7463',
    name: 'Cargills Bank Limited',
    shortName: 'Cargills Bank',
    accountLengthRule: { minLength: 10, maxLength: 12 },
    hintText: 'Cargills Bank accounts must be 10 to 12 digits.',
  },
  {
    id: 'union',
    code: '7302',
    name: 'Union Bank of Colombo PLC',
    shortName: 'Union Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'Union Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'nsb',
    code: '7144',
    name: 'National Savings Bank (NSB)',
    shortName: 'NSB',
    accountLengthRule: { exactLength: 12 },
    hintText: 'NSB accounts must be exactly 12 digits.',
  },
  {
    id: 'rdb',
    code: '7737',
    name: 'Regional Development Bank (RDB)',
    shortName: 'RDB Bank',
    accountLengthRule: { exactLength: 12 },
    hintText: 'RDB Bank accounts must be exactly 12 digits.',
  },
  {
    id: 'hsbc',
    code: '7092',
    name: 'HSBC Sri Lanka',
    shortName: 'HSBC',
    accountLengthRule: { exactLength: 12 },
    hintText: 'HSBC accounts must be exactly 12 digits.',
  },
  {
    id: 'scb',
    code: '7038',
    name: 'Standard Chartered Bank Sri Lanka',
    shortName: 'Standard Chartered',
    accountLengthRule: { exactLength: 12 },
    hintText: 'Standard Chartered accounts must be exactly 12 digits.',
  },
];

export const SRI_LANKAN_BRANCHES: BranchInfo[] = [
  { code: '001', name: 'Colombo Fort Main Branch', district: 'Colombo' },
  { code: '002', name: 'Pettah Branch', district: 'Colombo' },
  { code: '003', name: 'Kollupitiya (Colombo 03)', district: 'Colombo' },
  { code: '004', name: 'Bambalapitiya (Colombo 04)', district: 'Colombo' },
  { code: '005', name: 'Havelock Town (Colombo 05)', district: 'Colombo' },
  { code: '007', name: 'Cinnamon Gardens (Colombo 07)', district: 'Colombo' },
  { code: '008', name: 'Negombo Main Branch', district: 'Gampaha' },
  { code: '010', name: 'Borella (Colombo 08)', district: 'Colombo' },
  { code: '012', name: 'Galle Fort Main Branch', district: 'Galle' },
  { code: '014', name: 'Kalutara Main Branch', district: 'Kalutara' },
  { code: '015', name: 'Kandy City Center Branch', district: 'Kandy' },
  { code: '018', name: 'Matara City Branch', district: 'Matara' },
  { code: '020', name: 'Dehiwala Branch', district: 'Colombo' },
  { code: '022', name: 'Gampaha Town Branch', district: 'Gampaha' },
  { code: '025', name: 'Ratnapura City Branch', district: 'Ratnapura' },
  { code: '028', name: 'Nugegoda Square Branch', district: 'Colombo' },
  { code: '030', name: 'Badulla Main Branch', district: 'Badulla' },
  { code: '033', name: 'Kurunegala Central Branch', district: 'Kurunegala' },
  { code: '035', name: 'Maharagama Branch', district: 'Colombo' },
  { code: '040', name: 'Anuradhapura Royal Branch', district: 'Anuradhapura' },
  { code: '045', name: 'Kadawatha Branch', district: 'Gampaha' },
  { code: '050', name: 'Nuwara Eliya Hill Branch', district: 'Nuwara Eliya' },
  { code: '055', name: 'Trincomalee Harbor Branch', district: 'Trincomalee' },
  { code: '060', name: 'Batticaloa Town Branch', district: 'Batticaloa' },
  { code: '065', name: 'Kottawa Junction Branch', district: 'Colombo' },
  { code: '070', name: 'Kiribathgoda Branch', district: 'Gampaha' },
  { code: '075', name: 'Battaramulla Central Branch', district: 'Colombo' },
  { code: '080', name: 'Ja-Ela Branch', district: 'Gampaha' },
  { code: '088', name: 'Jaffna City Center Branch', district: 'Jaffna' },
  { code: '095', name: 'Wattala Branch', district: 'Gampaha' },
];

export function validateBankAccountNumber(bankId: string, accountNumber: string): { isValid: boolean; errorMessage?: string } {
  const digitsOnly = accountNumber.replace(/\D/g, '');
  if (!digitsOnly) {
    return { isValid: false, errorMessage: 'Account number is required.' };
  }

  const bank = SRI_LANKAN_BANKS.find(
    (b) => b.id === bankId || b.shortName.toLowerCase() === bankId.toLowerCase() || b.name.toLowerCase() === bankId.toLowerCase()
  );
  if (!bank) {
    return { isValid: false, errorMessage: 'Please select a valid bank first.' };
  }

  const rule = bank.accountLengthRule;

  if (rule.exactLength !== undefined) {
    if (digitsOnly.length !== rule.exactLength) {
      return {
        isValid: false,
        errorMessage: `${bank.shortName} requires exactly ${rule.exactLength} digits. You entered ${digitsOnly.length} digits.`,
      };
    }
  } else if (rule.minLength !== undefined && rule.maxLength !== undefined) {
    if (digitsOnly.length < rule.minLength || digitsOnly.length > rule.maxLength) {
      return {
        isValid: false,
        errorMessage: `${bank.shortName} requires ${rule.minLength} to ${rule.maxLength} digits. You entered ${digitsOnly.length} digits.`,
      };
    }
  }

  return { isValid: true };
}
