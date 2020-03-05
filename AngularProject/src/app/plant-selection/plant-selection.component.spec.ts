import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantSelectionComponent } from './plant-selection.component';

describe('PlantSelectionComponent', () => {
  let component: PlantSelectionComponent;
  let fixture: ComponentFixture<PlantSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
