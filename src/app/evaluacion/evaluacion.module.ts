import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluacionPageRoutingModule } from './evaluacion-routing.module';

import { EvaluacionPage } from './evaluacion.page';
import { PreguntasRegistroComponent } from '../components/preguntas-registro/preguntas-registro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluacionPageRoutingModule
  ],
  declarations: [EvaluacionPage, PreguntasRegistroComponent]
})
export class EvaluacionPageModule {}
