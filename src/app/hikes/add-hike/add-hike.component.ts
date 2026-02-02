import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Hike } from '../../models/hike';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Difficulty } from '../../enums/difficulty';

@Component({
  selector: 'app-add-hike',
  standalone: false,
  templateUrl: './add-hike.component.html',
  styleUrl: './add-hike.component.scss',
})
export class AddHikeComponent implements OnInit {
  myForm!: FormGroup;
  hike!: Hike;
  @Output() newHikeEvent = new EventEmitter<Hike>();

  difficulties!: Difficulty[];

  scores = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.myForm = this.fb.group({});
    this.difficulties = Object.values(Difficulty);
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      distance: ['', [Validators.required]],
      startPoint: ['', [Validators.required, Validators.maxLength(200)]],
      endPoint: ['', [Validators.required, Validators.maxLength(200)]],
      estimatedTime: ['', [Validators.required, Validators.maxLength(5)]],
      difficulty: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]],
      elevation: ['', [Validators.required, Validators.maxLength(5)]],
      done: [false, []],
      actualTime: ['', []],
      score: ['', []],
    });

    this.myForm.get('done')?.valueChanges.subscribe((done) => {
      if (done) {
        this.myForm
          .get('actualTime')
          ?.setValidators([Validators.required, Validators.maxLength(5)]);
        this.myForm.get('score')?.setValidators([Validators.required]);

        this.myForm.get('actualTime')?.updateValueAndValidity();
        this.myForm.get('score')?.updateValueAndValidity();
      } else {
        this.myForm.get('actualTime')?.clearValidators();
        this.myForm.get('score')?.clearValidators();

        this.myForm.get('actualTime')?.updateValueAndValidity();
        this.myForm.get('score')?.updateValueAndValidity();
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Submit handler
  onSubmit(): void {
    if (this.myForm?.valid) {
      this.newHikeEvent.emit(this.myForm.value);
    } else {
      this.openSnackBar('The form is invalid', 'Close');
    }
  }
}
