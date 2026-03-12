import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInquiry } from './add-inquiry';

describe('AddInquiry', () => {
  let component: AddInquiry;
  let fixture: ComponentFixture<AddInquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInquiry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
