import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HikesRoutingModule } from './hikes-routing.module';
import { HikesComponent } from './hikes.component';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AddHikeComponent } from './add-hike/add-hike.component';
import { EditHikeComponent } from './edit-hike/edit-hike.component';

@NgModule({
  declarations: [HikesComponent, AddHikeComponent, EditHikeComponent],
  imports: [
    CommonModule,
    HikesRoutingModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class HikesModule {}
