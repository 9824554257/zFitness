import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    birthdaysThisMonth: any[];
    pendingPayments: any[];
    upcomingDues: any[];
    expiringPackages: any[];
  };
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private appService = inject(AppService);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dashboardData: DashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  summaryCards: any[] = [];
  birthdaysThisMonth: any[] = [];
  pendingPayments: any[] = [];
  upcomingDues: any[] = [];
  expiringPackages: any[] = [];

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
      },
      error: (error) => {
        console.error('Dashboard fetch error:', error);
        this.errorMessage = 'Unable to fetch dashboard data. Please try again later.';
        this.isLoading = false;
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

    this.birthdaysThisMonth = data.birthdaysThisMonth || [];
    this.pendingPayments = data.pendingPayments || [];
    this.upcomingDues = data.upcomingDues || [];
    this.expiringPackages = data.expiringPackages || [];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
