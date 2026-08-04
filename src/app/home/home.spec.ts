import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, HttpClientTestingModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters follow-ups to the current day only', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    component.processDashboardData({
      summaryCards: {
        newMembersToday: 0,
        totalRevenueThisMonth: 0,
        expiringPackagesThisWeek: 0,
        totalInquiriesThisMonth: 0,
        pendingPaymentsCount: 0,
        upcomingDuesCount: 0,
        conversionCountToday: 0,
        conversionCountWeek: 0,
        conversionCountMonth: 0,
        inquiryCountToday: 0,
        inquiryCountWeek: 0,
        inquiryCountMonth: 0,
      },
      birthdayToday: [],
      followUpsToday: [
        { name: 'Today', number: '123', email: 'today@example.com', followUpDate: today.toISOString() },
        { name: 'Tomorrow', number: '456', email: 'tomorrow@example.com', followUpDate: tomorrow.toISOString() },
      ],
      expiringPackagesInNext3Days: [],
      pendingPayments: [],
      upcomingDues: [],
      expiringPackages: [],
    });

    expect(component.followUpsToday.length).toBe(1);
    expect(component.followUpsToday[0].name).toBe('Today');
  });

  it('filters packages expiring from tomorrow through the next three days', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayThree = new Date(today);
    dayThree.setDate(today.getDate() + 3);

    const dayFour = new Date(today);
    dayFour.setDate(today.getDate() + 4);

    component.processDashboardData({
      summaryCards: {
        newMembersToday: 0,
        totalRevenueThisMonth: 0,
        expiringPackagesThisWeek: 0,
        totalInquiriesThisMonth: 0,
        pendingPaymentsCount: 0,
        upcomingDuesCount: 0,
        conversionCountToday: 0,
        conversionCountWeek: 0,
        conversionCountMonth: 0,
        inquiryCountToday: 0,
        inquiryCountWeek: 0,
        inquiryCountMonth: 0,
      },
      birthdayToday: [],
      followUpsToday: [],
      expiringPackagesInNext3Days: [
        { memberName: 'A', packageName: 'Gold', endDate: tomorrow.toISOString() },
        { memberName: 'B', packageName: 'Platinum', endDate: dayThree.toISOString() },
        { memberName: 'C', packageName: 'Diamond', endDate: dayFour.toISOString() },
      ],
      pendingPayments: [],
      upcomingDues: [],
      expiringPackages: [],
    });

    expect(component.expiringPackagesInNext3Days.length).toBe(2);
    expect(component.expiringPackagesInNext3Days.map((item) => item.packageName)).toEqual(['Gold', 'Platinum']);
  });

  it('falls back to expiringPackages when next3Days list is empty', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayThree = new Date(today);
    dayThree.setDate(today.getDate() + 3);

    component.processDashboardData({
      summaryCards: {
        newMembersToday: 0,
        totalRevenueThisMonth: 0,
        expiringPackagesThisWeek: 0,
        totalInquiriesThisMonth: 0,
        pendingPaymentsCount: 0,
        upcomingDuesCount: 0,
        conversionCountToday: 0,
        conversionCountWeek: 0,
        conversionCountMonth: 0,
        inquiryCountToday: 0,
        inquiryCountWeek: 0,
        inquiryCountMonth: 0,
      },
      birthdayToday: [],
      followUpsToday: [],
      expiringPackagesInNext3Days: [],
      pendingPayments: [],
      upcomingDues: [],
      expiringPackages: [
        { memberName: 'D', packageName: 'Silver', endDate: tomorrow.toISOString() },
        { memberName: 'E', packageName: 'Bronze', endDate: dayThree.toISOString() },
      ],
    });

    expect(component.expiringPackagesInNext3Days.length).toBe(2);
    expect(component.expiringPackagesInNext3Days.map((item) => item.packageName)).toEqual(['Silver', 'Bronze']);
  });
});
