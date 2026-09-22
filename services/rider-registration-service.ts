import { saveToken, saveRider } from './api';
import { apiClient } from './api-client';

export interface RiderRegistrationDraft {
  // Step 1: Personal Details
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
  nicNumber?: string;
  profilePicture?: string;

  // Step 2: Contact & Address
  email?: string;
  address?: string;
  city?: string;

  // Step 3: Vehicle Details
  vehicleType?: string;
  vehicleModel?: string;
  plateNumber?: string;
  vehiclePhoto?: string;
  registrationDoc?: string;

  // Step 4: License & Verification
  licenseNumber?: string;
  licenseExpiryDate?: string;
  licenseFrontPhoto?: string;
  licenseBackPhoto?: string;
  policeClearanceDoc?: string;

  // Step 5: Banking Details
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  branchCode?: string;
  password?: string;
}

class RiderRegistrationService {
  private draft: RiderRegistrationDraft = {};

  getDraft(): RiderRegistrationDraft {
    return this.draft;
  }

  setDraft(partial: Partial<RiderRegistrationDraft>) {
    this.draft = {
      ...this.draft,
      ...partial,
    };
  }

  clearDraft() {
    this.draft = {};
  }

  async submitRegistration(password?: string): Promise<any> {
    const userPassword = password || this.draft.password || 'RiderPass123!';
    const rawPhone = (this.draft.phoneNumber || this.draft.phone || '').trim();
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

    const payload = {
      email: this.draft.email && this.draft.email.includes('@')
        ? this.draft.email.trim()
        : `rider_${cleanPhone || Date.now()}@yaalu.lk`,
      password: userPassword,
      role: 'RIDER',
      firstName: this.draft.firstName || '',
      lastName: this.draft.lastName || '',
      fullName: (`${this.draft.firstName || ''} ${this.draft.lastName || ''}`).trim() || 'Rider Partner',
      phoneNumber: rawPhone,
      phone: rawPhone,
      mobile: rawPhone,
      nicNumber: this.draft.nicNumber || '',
      address: this.draft.address || '',
      city: this.draft.city || '',
      profilePicture: this.draft.profilePicture || '',
      vehicleType: this.draft.vehicleType || 'MOTORBIKE',
      vehicleModel: this.draft.vehicleModel || '',
      plateNumber: this.draft.plateNumber || '',
      vehicleNumber: this.draft.plateNumber || '',
      vehiclePhoto: this.draft.vehiclePhoto || '',
      registrationDoc: this.draft.registrationDoc || '',
      licenseNumber: this.draft.licenseNumber || '',
      licenseExpiryDate: this.draft.licenseExpiryDate || '',
      licenseFrontPhoto: this.draft.licenseFrontPhoto || '',
      licenseBackPhoto: this.draft.licenseBackPhoto || '',
      policeClearanceDoc: this.draft.policeClearanceDoc || '',
      bankName: this.draft.bankName || '',
      accountHolder: this.draft.accountHolder || '',
      accountNumber: this.draft.accountNumber || '',
      branchCode: this.draft.branchCode || '',
    };

    try {
      console.log('[RiderRegistrationService] Submitting registration payload to backend...');
      const data = await apiClient.post<any>('/auth/register', payload, 30000);
      if (data) {
        if (data.accessToken) await saveToken(data.accessToken);
        await saveRider(data.user || data.rider || data.riderProfile || data);
        this.clearDraft();
        return data;
      }
      throw new Error('Server returned empty response');
    } catch (error: any) {
      console.error('[RiderRegistration Service Error]:', error?.message || error);
      throw error;
    }
  }
}

export const riderRegistrationService = new RiderRegistrationService();
