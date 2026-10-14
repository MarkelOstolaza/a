import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hasiera } from './hasiera';

describe('Hasiera', () => {
  let component: Hasiera;
  let fixture: ComponentFixture<Hasiera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hasiera],
    }).compileComponents();

    fixture = TestBed.createComponent(Hasiera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
