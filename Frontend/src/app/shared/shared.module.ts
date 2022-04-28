import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  imports: [CommonModule, MatDialogModule, MatTabsModule],
  declarations: [],
  exports: [],
})
export class SharedModule {}
