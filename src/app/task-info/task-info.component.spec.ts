import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfoComponent } from './task-info.component';

describe('TaskInfoComponent', () => {
  let component: TaskInfoComponent;
  let fixture: ComponentFixture<TaskInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskInfoComponent]
    });
    fixture = TestBed.createComponent(TaskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
