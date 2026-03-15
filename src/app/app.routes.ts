import { Routes } from '@angular/router';
import { MiscMaster } from './misc-master/misc-master';
import { InquryList } from './inqury-list/inqury-list';
import { AddInquiry } from './add-inquiry/add-inquiry';
import { AddMember } from './add-member/add-member';
import { MemberList } from './member-list/member-list';
import { AddStaff } from './add-staff/add-staff';
import { StaffList } from './staff-list/staff-list';
import { Login } from './login/login';
import { PackageMaster } from './package-master/package-master';

export const routes: Routes = [
  { path: 'miscMaster', component: MiscMaster },
  { path: 'inquiryList', component: InquryList },
  { path: 'newInquiry', component: AddInquiry },
  { path: 'newMember', component: AddMember },
  // { path: 'newInquiry', component: AddInquiry },
  { path: 'newMemberList', component: MemberList },
  { path: 'addStaff', component: AddStaff },
  { path: 'staffList', component: StaffList },
  { path: 'login', component: Login },
  { path: 'packageMaster', component: PackageMaster },
];
