import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
// import { UserDataService } from 'src/app/providers/user-data.service';

@Component({
  selector: 'app-preguntas-registro',
  templateUrl: './preguntas-registro.component.html',
  styleUrls: ['./preguntas-registro.component.scss'],
})
export class PreguntasRegistroComponent implements OnInit {
  @ViewChild('slider') slider: IonSlides;

  @Input() pregunta: any;
  @Input() preguntas: any;
  @Output() finalizarEncuesta = new EventEmitter<any>();
  @Output() anterior = new EventEmitter<string>();
  cantidadPreguntas: number;
  progressBarValue: number;
  respuestasSituacionSalud: any[] = [];
  numeroPregunta = 0;
  botonDisabled: boolean = true;

  constructor(
    // public user: UserDataService,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    //console.log(this.preguntas)
    this.cantidadPreguntas=this.preguntas.length;

    console.log('*************************************************')
    this.progressBar();
  }
  
  ngAfterViewInit() {

  }
  preguntaAnterior() {

    this.botonDisabled = false;
    this.slider.isBeginning().then(data => {

      if (!data) {
        this.slider.slidePrev()
        this.numeroPregunta--;
      }
      this.progressBar();
    })
  }
  async preguntaSiguiente() {


    this.botonDisabled = false;
    //console.log(` Largo : ${this.respuestasSituacionSalud.length}, nro Pregu ${this.numeroPregunta}, resp `)


    if (this.preguntas[this.numeroPregunta].respuestaMultiple) {
      let respuestaElegida = this.preguntas[this.numeroPregunta].respuestas.filter(respuesta => { return respuesta.seleccionada == true });

      //console.log(respuestaElegida)
      respuestaElegida.forEach(element => {

        this.respuestasSituacionSalud.push(element);
      });

    } else {
      let respuestaElegida = this.preguntas[this.numeroPregunta].respuestas.find(respuesta => { return respuesta.seleccionada == true });
      //console.log(respuestaElegida)
      this.respuestasSituacionSalud[this.numeroPregunta] = respuestaElegida;


    }

    let indexSlides = await this.slider.getActiveIndex();
    if (indexSlides == this.cantidadPreguntas - 1) {
      this.finalizarEncuesta.emit(this.respuestasSituacionSalud);
      this.numeroPregunta--; // Si es la ultima pregunta resto para que no haga overflow

    } else {


      this.slider.slideNext();
    }

    if (!this.preguntas[this.numeroPregunta+1].respuestaMultiple && this.respuestasSituacionSalud.length == this.numeroPregunta+1) { // NO ANDA
      
      this.botonDisabled = true;
      //console.log('NO VOTES')
    }
    
    this.numeroPregunta++;

    this.progressBar();

    //console.log(this.respuestasSituacionSalud)

    // if (this.respuestas.length > 1) {
    //   this.preguntasRespondidas++;
    //   this.respuestas.splice(0, 1);
    //   this.progressBar();
    // } else {
    //   this.router.navigateByUrl('/inicio');

    // }
  }


  limpiarRespuestas(valorParam) { // RespuestaMultiple esta invertido xD
    this.botonDisabled = false;
    let tmpPregunta = this.preguntas[this.numeroPregunta];
    if (!tmpPregunta.respuestaMultiple) {  //Si permite 1 sola respuesta
      tmpPregunta.respuestas.forEach(respuesta => {

        respuesta.valor == valorParam ? respuesta.seleccionada = true : respuesta.seleccionada = false;

      });
    } else {
      tmpPregunta.respuestas.forEach(respuesta => { //Si permite multiples respuestas
        respuesta.valor == valorParam ? respuesta.seleccionada = !respuesta.seleccionada : 0;
      })

    }
  }
  progressBar() {

    this.progressBarValue = this.numeroPregunta / this.cantidadPreguntas;
    // //console.log(`${this.preguntasRespondidas} / ${this.cantidadPreguntas}`)
  }




}
