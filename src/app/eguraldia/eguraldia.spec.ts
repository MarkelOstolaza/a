import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Eguraldia } from './eguraldia';

describe('Eguraldia', () => {
  let component: Eguraldia;
  let fixture: ComponentFixture<Eguraldia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eguraldia],
    }).compileComponents();

    fixture = TestBed.createComponent(Eguraldia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
