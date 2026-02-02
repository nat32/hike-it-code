import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hike } from '../../models/hike';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Difficulty } from '../../enums/difficulty';

@Component({
  selector: 'app-edit-hike',
  standalone: false,
  templateUrl: './edit-hike.component.html',
  styleUrl: './edit-hike.component.scss',
})
export class EditHikeComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  hike!: Hike;
  @Output() editedHike = new EventEmitter<Hike>();
  @Input() hikeToEdit!: Hike;

  private eventsChangeSubscription: Subscription | undefined;

  @Input() events: Observable<Hike> | undefined;

  difficulties!: Difficulty[];
  scores = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.myForm = this.fb.group({});
    this.difficulties = Object.values(Difficulty);
  }

  ngOnInit(): void {
    this.eventsChangeSubscription = this.events!.subscribe((item) => this.initForm(item));
    this.myForm = this.fb.group({
      name: [this.hikeToEdit.name, [Validators.required, Validators.maxLength(250)]],
      distance: [this.hikeToEdit.distance, [Validators.required]],
      startPoint: [this.hikeToEdit.startPoint, [Validators.required, Validators.maxLength(200)]],
      endPoint: [this.hikeToEdit.endPoint, [Validators.required, Validators.maxLength(200)]],
      estimatedTime: [
        this.hikeToEdit.estimatedTime,
        [Validators.required, Validators.maxLength(5)],
      ],
      difficulty: [this.hikeToEdit.difficulty, [Validators.required]],
      scheduledDate: [this.hikeToEdit.scheduledDate, [Validators.required]],
      elevation: [this.hikeToEdit.elevation, [Validators.required, Validators.maxLength(5)]],
      done: [this.hikeToEdit.done, []],
      actualTime: [this.hikeToEdit.actualTime, []],
      score: [this.hikeToEdit.score, []],
    });

    this.myForm.get('done')?.valueChanges.subscribe((done) => {
      if (done) {
        this.setValidatorsForActualTimeAndScore();
      } else {
        this.clearValidatorsForActualTimeAndScore();
      }
    });

    if (this.myForm.get('done')?.value) {
      this.setValidatorsForActualTimeAndScore();
    } else {
      this.clearValidatorsForActualTimeAndScore();
    }
  }

  setValidatorsForActualTimeAndScore() {
    this.myForm.get('actualTime')?.setValidators([Validators.required, Validators.maxLength(5)]);
    this.myForm.get('score')?.setValidators([Validators.required]);

    this.myForm.get('actualTime')?.updateValueAndValidity();
    this.myForm.get('score')?.updateValueAndValidity();
  }

  clearValidatorsForActualTimeAndScore() {
    this.myForm.get('actualTime')?.clearValidators();
    this.myForm.get('score')?.clearValidators();

    this.myForm.get('actualTime')?.updateValueAndValidity();
    this.myForm.get('score')?.updateValueAndValidity();
  }

  initForm(hike: Hike) {
    this.hikeToEdit = hike;
    this.myForm = this.fb.group({
      name: [hike.name, [Validators.required, Validators.maxLength(250)]],
      distance: [hike.distance, [Validators.required]],
      startPoint: [hike.startPoint, [Validators.required, Validators.maxLength(200)]],
      endPoint: [hike.endPoint, [Validators.required, Validators.maxLength(200)]],
      estimatedTime: [hike.estimatedTime, [Validators.required]],
      difficulty: [hike.difficulty, [Validators.required]],
      scheduledDate: [hike.scheduledDate, [Validators.required]],
      elevation: [hike.elevation, [Validators.required]],
      done: [hike.done, []],
      actualTime: [hike.actualTime, []],
      score: [hike.score, []],
    });
  }

  // Submit handler
  onSubmit(): void {
    if (this.myForm?.valid) {
      this.hike = this.myForm.value;
      this.hike.id = this.hikeToEdit.id;
      this.editedHike.emit(this.hike);
    } else {
      this.openSnackBar('The form is invalid', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.eventsChangeSubscription?.unsubscribe();
  }
}
