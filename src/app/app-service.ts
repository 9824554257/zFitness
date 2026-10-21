import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type PauseKind = 'package' | 'trainer';

export interface PausePeriod {
  _id: string;
  fromDate: string;
  toDate: string;
  remarks: string;
  createdAt: string;
}

export type MemberPeriodStatus = 'active' | 'inactive' | 'inactive_due_to_pause';

export interface PausableMemberRecord {
  _id: string;
  startDate: string | null;
  endDate: string | null;
  pausePeriods: PausePeriod[];
  isPaused: boolean;
  isActiveNow: boolean;
  status: MemberPeriodStatus;
}

export interface PauseRequest {
  uniqueId: string;
  fromDate: string;
  toDate: string;
  remarks: string;
}

export interface PauseResponse {
  message: string;
  data: PausableMemberRecord;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  // baseUrl: any = 'https://gym-five-blush.vercel.app';
  // baseUrl : any = 'http://localhost:3000';
  baseUrl: any = 'https://api.alluresofttech.com'

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {}

  getHeaders = () => {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });
  };

  getAllMemberDetails = (queryParams: string) =>
    this.http.get(`${this.baseUrl}/members/getMemberDetails?${queryParams}`, { headers: this.getHeaders() });

  saveMemberDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/members/saveMemberDetails`, request, {
      headers: this.getHeaders(),
    });

  getMasterPackageDetails = () =>
    this.http.get(`${this.baseUrl}/package/getPackageDetails`, { headers: this.getHeaders() });

  saveMasterPackageDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/package/savePackageDetails`, request, {
      headers: this.getHeaders(),
    });

  deleteMemberPackageDetails = (packageId : any) => {
    this.http.delete(
      `${this.baseUrl}/memberDetailsPackage/deleteMemberPackageDetail?packageId=${packageId}`,
      {
        headers: this.getHeaders(),
      },
    );
  }

  savePackageMasterDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/package/savePackageDetails`, request, {
      headers: this.getHeaders(),
    });

  deletePackageMasterDetails = (packageId: any) =>
  this.http.delete(`${this.baseUrl}/package/deletePackageDetail?packageId=${packageId}`, {
    headers: this.getHeaders(),
  });

  //Misc master API Starts
  saveMiscData = (request: any) =>
    this.http.post(`${this.baseUrl}/miscMaster/saveMiscMaster`, request, {
      headers: this.getHeaders(),
    });

  getMiscMasterDataFromType = (request: any) =>
    this.http.post(`${this.baseUrl}/miscMaster/getMiscMaster`, request, {
      headers: this.getHeaders(),
    });

  updateMemberDetailsByUniqueId = (request: any) =>
    this.http.put(`${this.baseUrl}/members/updateMemberByUniqueId`, request, {
      headers: this.getHeaders(),
    });

  getMemberTrainerDetails = (queryParams: string) =>
    this.http.get(`${this.baseUrl}/memberTrainerDetails/getMemberTrainerDetails?${queryParams}`, {
      headers: this.getHeaders(),
    });

  getStaffDetails = (queryParams: string) =>
    this.http.get(`${this.baseUrl}/staff/getStaffDetails?${queryParams}`, {
      headers: this.getHeaders(),
    });

  fetchStaffByUniqueId = (request: any) =>
    this.http.post(`${this.baseUrl}/staff/fetchStaffByUniqueId`, request, {
      headers: this.getHeaders(),
    });

  saveStaffDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/staff/saveStaffDetails`, request, {
      headers: this.getHeaders(),
    });

  updateStaffByUniqueId = (request: any) =>
    this.http.put(`${this.baseUrl}/staff/updateStaffByUniqueId`, request, {
      headers: this.getHeaders(),
    });

  uploadStaffImage = (file: File, uniqueId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uniqueId', uniqueId);
    return this.http.post(`${this.baseUrl}/staff/uploadStaffImage`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      }),
    });
  };

  deleteStaffImage = (uniqueId: string) =>
    this.http.post(
      `${this.baseUrl}/staff/deleteStaffImage`,
      { uniqueId },
      { headers: this.getHeaders() },
    );

  deleteStaffDetail = (staffId: string) =>
    this.http.request('delete', `${this.baseUrl}/staff/deleteStaffDetail`, {
      body: { staffId },
      headers: this.getHeaders(),
    });

  saveMemberPackageDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/memberDetailsPackage/saveMemberPackageDetails`, request, {
      headers: this.getHeaders(),
    });

  pauseMemberDetail = (
    kind: PauseKind,
    request: PauseRequest,
  ) => {
    const path = kind === 'package'
      ? '/memberDetailsPackage/pauseMemberPackageDetails'
      : '/memberTrainerDetails/pauseMemberTrainerDetails';

    return this.http.post<PauseResponse>(`${this.baseUrl}${path}`, request, {
      headers: this.getHeaders(),
    });
  };

  savePaymentDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/payment/savePaymentDetails`, request, {
      headers: this.getHeaders(),
  });

  saveMemberTrainerDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/memberTrainerDetails/saveMemberTrainerDetils`, request, {
      headers: this.getHeaders(),
    });

  updateMemberTrainerByUniqueId = (request: any) =>
    this.http.put(`${this.baseUrl}/memberTrainerDetails/updateMemberTrainerByUniqueId`, request, {
      headers: this.getHeaders(),
    });

  deleteMemberTrainer = (trainerId: any) =>
    this.http.delete(
      `${this.baseUrl}/memberTrainerDetails/deleteMemberTrainerDetils?memberTrainerId=${trainerId}`,
      {
        headers: this.getHeaders(),
      },
    );

  deleteMemberPackage = (packageId: any) =>
    this.http.delete(
      `${this.baseUrl}/memberDetailsPackage/deleteMemberPackageDetail?packageId=${packageId}`,
      {
        headers: this.getHeaders(),
      },
    );

  deleteMemberDetails = (memberId: any) =>
    this.http.delete(`${this.baseUrl}/members/deleteMemberDetail?memberId=${memberId}`, {
      headers: this.getHeaders(),
    });

  deleteMiscData = (miscMasterId: any) =>
    this.http.delete(`${this.baseUrl}/miscMaster/deleteMiscMaster?miscMasterId=${miscMasterId}`, {
      headers: this.getHeaders(),
    });
  //Misc master API Ends

  //inquiry/getAllInquiryDetails
  //inquiry/saveInquiryDetails
  //inquiry/updateInquiryByInquiryId

  getAllInquiryDetails = () =>
    this.http.get(`${this.baseUrl}/inquiry/getAllInquiryDetails`, { headers: this.getHeaders() });

  saveInquiryDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/inquiry/saveInquiryDetails`, request, {
      headers: this.getHeaders(),
    });

  updateInquiryDetails = (request: any) =>
    this.http.put(`${this.baseUrl}/inquiry/updateInquiryByInquiryId`, request, {
      headers: this.getHeaders(),
    });

  deleteInquiryDetails = (inquiryId: any) =>
    this.http.delete(`${this.baseUrl}/inquiry/deleteInquiryDetail?inquiryId=${inquiryId}`, {
      headers: this.getHeaders(),
    });

  uploadMemberData = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/members/uploadMemberData`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      }),
    });
  };

  uploadUserImage = (file: File, uniqueId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uniqueId', uniqueId);
    return this.http.post(`${this.baseUrl}/members/uploadUserImage`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      }),
    });
  };

  deleteUserImage = (uniqueId: string) => {
    return this.http.post(`${this.baseUrl}/members/deleteUserImage`, { uniqueId }, {
      headers: this.getHeaders(),
    });
  };

  // Dashboard APIs
  getDashboardSummary = (startDate?: string, endDate?: string) => {
    let url = `${this.baseUrl}/api/dashboard/summary`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get(url, { headers: this.getHeaders() });
  };
}
