import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AppService } from '../app-service';
import { MemberList } from './member-list';

describe('MemberList', () => {
  let component: MemberList;
  let fixture: ComponentFixture<MemberList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberList],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberList);
    component = fixture.componentInstance;

    const appService = TestBed.inject(AppService);
    spyOn(appService, 'getAllMemberDetails').and.returnValue(of({
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10,
    }));

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include punchInCode in member search query', () => {
    const appService = TestBed.inject(AppService);

    component.searchName = 'John';
    component.searchEmail = 'john@test.com';
    component.searchMobile = '9876543210';
    component.searchMemberId = 'M-001';
    component.punchInCode = '105';

    component.searchMembers();

    expect(appService.getAllMemberDetails).toHaveBeenCalled();
    const query = (appService.getAllMemberDetails as jasmine.Spy).calls.mostRecent().args[0];
    expect(query).toContain('punchInCode=105');
  });
});
