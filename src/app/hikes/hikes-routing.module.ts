import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HikesComponent } from './hikes.component';

const routes: Routes = [{ path: '', component: HikesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HikesRoutingModule {}
