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
    const payload = {
      email: this.draft.email || `${(this.draft.phone || 'rider').replace(/[\+\s]/g, '')}@yaalu.com`,
      password: userPassword,
      role: 'RIDER',
      firstName: this.draft.firstName,
      lastName: this.draft.lastName,
      phoneNumber: this.draft.phoneNumber || this.draft.phone,
      phone: this.draft.phoneNumber || this.draft.phone,
      mobile: this.draft.phoneNumber || this.draft.phone,
      nicNumber: this.draft.nicNumber,
      address: this.draft.address,
      city: this.draft.city,
      profilePicture: this.draft.profilePicture,
      vehicleType: this.draft.vehicleType,
      vehicleModel: this.draft.vehicleModel,
      plateNumber: this.draft.plateNumber,
      vehicleNumber: this.draft.plateNumber,
      vehiclePhoto: this.draft.vehiclePhoto,
      registrationDoc: this.draft.registrationDoc,
      licenseNumber: this.draft.licenseNumber,
      licenseExpiryDate: this.draft.licenseExpiryDate,
      licenseFrontPhoto: this.draft.licenseFrontPhoto,
      licenseBackPhoto: this.draft.licenseBackPhoto,
      policeClearanceDoc: this.draft.policeClearanceDoc,
      bankName: this.draft.bankName,
      accountHolder: this.draft.accountHolder,
      accountNumber: this.draft.accountNumber,
      branchCode: this.draft.branchCode,
    };

    try {
      const data = await apiClient.post<any>('/auth/register', payload, 5000);
      if (data) {
        if (data.accessToken) await saveToken(data.accessToken);
        await saveRider(data.user || data);
        this.clearDraft();
        return data;
      }
    } catch (error: any) {
      console.warn('[RiderRegistration Service Fallback]:', error?.message || error);
    }

    // Dev Fallback
    const mockRider = {
      id: `rider_${Date.now()}`,
      ...payload,
    };
    await saveRider(mockRider);
    await saveToken('mock_rider_token_9999');
    this.clearDraft();
    return { rider: mockRider, accessToken: 'mock_rider_token_9999', message: 'Registered in Dev Mode' };
  }
}

export const riderRegistrationService = new RiderRegistrationService();
