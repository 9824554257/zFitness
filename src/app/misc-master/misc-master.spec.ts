import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscMaster } from './misc-master';

describe('MiscMaster', () => {
  let component: MiscMaster;
  let fixture: ComponentFixture<MiscMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
