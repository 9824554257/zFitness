import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AppService } from '../app-service';

interface DashboardData {
  success: boolean;
  message: string;
  data: {
    summaryCards: {
      newMembersToday: number;
      totalRevenueThisMonth: number;
      expiringPackagesThisWeek: number;
      totalInquiriesThisMonth: number;
      pendingPaymentsCount: number;
      upcomingDuesCount: number;
      conversionCountToday: number;
      conversionCountWeek: number;
      conversionCountMonth: number;
      inquiryCountToday: number;
      inquiryCountWeek: number;
      inquiryCountMonth: number;
    };
    birthdayToday: any[];
    followUpsToday: any[];
    pendingPayments: any[];
    upcomingDues: any[];
    expiringPackages: any[];
    membersAddedToday: any[];
    inquiriesAddedToday: any[];
  };
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dashboardData: DashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  summaryCards: any[] = [];
  birthdayToday: any[] = [];
  followUpsToday: any[] = [];
  pendingPayments: any[] = [];
  upcomingDues: any[] = [];
  expiringPackages: any[] = [];
  membersAddedToday: any[] = [];
  inquiriesAddedToday: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appService.getDashboardSummary().subscribe({
      next: (response: any) => {
        this.dashboardData = response;
        if (response.success && response.data) {
          this.processDashboardData(response.data);
        } else {
          this.errorMessage = response.message || 'Failed to fetch dashboard data';
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Dashboard fetch error:', error);
        if (error.status === 401) {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
          return;
        }

        this.errorMessage = error.error?.message || error.message || 'Unable to fetch dashboard data. Please try again later.';
        this.isLoading = false;
        this.cdr.markForCheck();
        this._snackBar.open(this.errorMessage, 'Close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000,
        });
      },
    });
  }

  processDashboardData(data: any): void {
    // Create summary cards array for display
    this.summaryCards = [
      {
        title: 'New Members Today',
        value: data.summaryCards.newMembersToday,
        icon: 'person_add',
        color: 'primary',
      },
      {
        title: 'Total Revenue This Month',
        value: `₹${data.summaryCards.totalRevenueThisMonth}`,
        icon: 'attach_money',
        color: 'accent',
      },
      {
        title: 'Expiring Packages This Week',
        value: data.summaryCards.expiringPackagesThisWeek,
        icon: 'schedule',
        color: 'warn',
      },
      {
        title: 'Total Inquiries This Month',
        value: data.summaryCards.totalInquiriesThisMonth,
        icon: 'help_center',
        color: 'primary',
      },
      {
        title: 'Pending Payments',
        value: data.summaryCards.pendingPaymentsCount,
        icon: 'payment',
        color: 'warn',
      },
      {
        title: 'Upcoming Dues',
        value: data.summaryCards.upcomingDuesCount,
        icon: 'alarm',
        color: 'accent',
      },
    ];

    this.birthdayToday = data.birthdayToday || [];
    this.followUpsToday = this.getFollowUpsToday(data);
    this.pendingPayments = data.pendingPayments || [];
    this.upcomingDues = data.upcomingDues || [];
    this.expiringPackages = data.expiringPackages || [];
    this.membersAddedToday = Array.isArray(data.membersAddedToday) ? data.membersAddedToday : [];
    this.inquiriesAddedToday = Array.isArray(data.inquiriesAddedToday) ? data.inquiriesAddedToday : [];
  }

  private getFollowUpsToday(data: any): any[] {
    const today = new Date();
    const followUps = Array.isArray(data.followUpsToday) ? data.followUpsToday : [];

    return followUps.filter((item: any) => {
      if (!item.followUpDate) {
        return true; // backend may already send only today's follow-ups without the date field
      }

      const followUpDate = new Date(item.followUpDate);
      return (
        followUpDate.getFullYear() === today.getFullYear() &&
        followUpDate.getMonth() === today.getMonth() &&
        followUpDate.getDate() === today.getDate()
      );
    });
  }

  formatDate(date: string): string {
    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
