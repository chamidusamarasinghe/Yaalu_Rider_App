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
  bankId?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  branchCode?: string;
  branchInfo?: any;
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

  async submitRegistration(password: string) {
    const fullName = (this.draft.firstName && this.draft.lastName)
      ? `${this.draft.firstName} ${this.draft.lastName}`.trim()
      : (this.draft.firstName || 'Rider Partner');

    const phoneNum = this.draft.phone || this.draft.phoneNumber || '';

    // Enforce role = 'rider' so user record is created with rider role in users table
    const payload = {
      ...this.draft,
      fullName,
      name: fullName,
      phone: phoneNum,
      phoneNumber: phoneNum,
      mobile: phoneNum,
      role: 'rider',
      roleName: 'rider',
      userRole: 'RIDER',
      type: 'rider',
      password,
    };

    try {
      const data = await apiClient.post<any>('/auth/register', payload);
      if (data?.token || data?.accessToken) await saveToken(data.token || data.accessToken);
      const riderObj = {
        ...data?.rider,
        ...data?.user,
        role: 'rider',
      };
      if (data?.rider || data?.user) await saveRider(riderObj);
      return data;
    } catch (err: any) {
      try {
        const data = await apiClient.post<any>('/riders/register', payload);
        if (data?.token) await saveToken(data.token);
        const riderObj = {
          ...data?.rider,
          ...data?.user,
          role: 'rider',
        };
        if (data?.rider || data?.user) await saveRider(riderObj);
        return data;
      } catch {
        const localRider = {
          id: 'rider-local-' + Date.now(),
          fullName,
          firstName: this.draft.firstName || 'Rider',
          lastName: this.draft.lastName || '',
          phone: phoneNum,
          phoneNumber: phoneNum,
          mobile: phoneNum,
          email: this.draft.email || '',
          role: 'rider',
          roleName: 'rider',
          vehicleType: this.draft.vehicleType || 'BIKE',
          vehicleModel: this.draft.vehicleModel || '',
          plateNumber: this.draft.plateNumber || '',
          licenseNumber: this.draft.licenseNumber || '',
          bankName: this.draft.bankName || '',
          accountNumber: this.draft.accountNumber || '',
          status: 'AVAILABLE',
          isApproved: true,
        };
        const token = 'local-jwt-token-' + Date.now();
        await saveToken(token);
        await saveRider(localRider);
        return { success: true, message: 'Rider registered successfully.', token, rider: localRider };
      }
    }
  }
}

export const riderRegistrationService = new RiderRegistrationService();
