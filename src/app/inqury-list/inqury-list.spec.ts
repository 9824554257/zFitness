import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquryList } from './inqury-list';

describe('InquryList', () => {
  let component: InquryList;
  let fixture: ComponentFixture<InquryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
