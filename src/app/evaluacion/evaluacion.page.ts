import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PaeAccessService } from '../providers/pae-access.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.page.html',
  styleUrls: ['./evaluacion.page.scss'],
})
export class EvaluacionPage implements OnInit {
  @ViewChild('slider') slider: IonSlides;
  @ViewChild('slider2') slider2: IonSlides;

  cantidadPreguntas: number;
  progressBarValue: number;
  respuestasSituacionSalud: any[] = [];
  numeroPregunta = 0;
  botonDisabled: boolean = true;
  cantidadRespuestas = 0;
  respuestas = [
    { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 3, "respuestaMultiple": false },
    { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0, "respuestaMultiple": false }
  ];
  condicionesPrexistentes = [{
    "valor": "Diabetes <br />(insulino requirente)",
    "seleccionada": false,
    "valorSituacionSalud": 0.5
  },
  {
    "valor": "Enfermedad<br />hepática",
    "seleccionada": false,
    "valorSituacionSalud": 0.5
  },
  {
    "valor": "Enfermedad<br />renal crónica",
    "seleccionada": false,
    "valorSituacionSalud": 0.5
  },
  {
    "valor": "Enfermedad<br />cardiológica",
    "seleccionada": false,
    "valorSituacionSalud": 0.5
  },
  {
    valor: "Enfermedad <br />respiratoria",
    "seleccionada": false,
    "valorSituacionSalud": 0.5
  }];
  preguntas = [
    {
      "enunciado": "¿Tuvo fiebre en los últimos 14 días?",
      "claseAdicional": "fontSizeGrande",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 2 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    },
    {
      "enunciado": "¿Sufrio de tos, dolor de garganta, debilidad, malestar general, falta de aire o perdida del olfato en los últimos 14 días?",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 1 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    },
    {
      "enunciado": "¿Está tomando medicamentos para síntomas gripales?",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 1 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    },
    {
      "enunciado": "¿Tuvo contacto con personas con síntomas gripales en los últimos 14 días?",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 1 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    },
    {
      "enunciado": "¿Residió fuera del domicilio/país en los 14 días previos al inicio de los sintomas?",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 3 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    },
    {
      "enunciado": "¿Tuvo contacto con personas sospechadas por infección de COVID-19 en los últimos 14 días?",
      "respuestas": [
        { "valor": "Sí", "seleccionada": false, "valorAutoEvaluacion": 3 },
        { "valor": "No", "seleccionada": false, "valorAutoEvaluacion": 0 }
      ],
      "respuestaMultiple": false,
      "inputOtros": false
    }

  ];
  valorActual = 0;
  sumaValorRespuestas = 0;
  numeroDNI: number;
  evaluacionActiva = false;
  registro = false;
  usuarioInexistente = false;
  datosUsuario = {};
  constructor(
    public alertController: AlertController,
    public router: Router,
    public paeAccessService: PaeAccessService
  ) { }

  ngOnInit() {
    this.cantidadPreguntas = this.preguntas.length;

  }

  verificarUsuario() {
    console.log(this.numeroDNI)
    this.paeAccessService.verificarUsuario(this.numeroDNI).then((data) => {
      if (data.dni == null) {
        this.registro = true;
        this.usuarioInexistente = true;
      } else {
        this.evaluacionActiva = true;

      }
    })
  }
  continuarRegistro() {
    this.slider2.slideNext();

  }
  registrarUsuario() {
    this.evaluacionActiva=true;
    this.registro=false;
    let condiciones = this.condicionesPrexistentes.filter(condicion => { return condicion.seleccionada == true });

    let valorSituacionSalud = condiciones.length *= 0.5
    this.paeAccessService.crearUsuario(valorSituacionSalud, this.datosUsuario).then(
      (data) => {
        console.log(data)
      }
    )
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

  radioGroupChange($event) {
    if ($event.detail.value > 0) {
      this.valorActual += parseInt($event.detail.value);
    } else {
      this.valorActual = 0;
    }

  }

  async preguntaSiguiente() {

    //console.log(` Largo : ${this.respuestasSituacionSalud.length}, nro Pregu ${this.numeroPregunta}, resp `);
    this.sumaValorRespuestas += this.valorActual;
    this.valorActual = 0;
    console.log(this.sumaValorRespuestas)
    let indexSlides = await this.slider.getActiveIndex();
    if (indexSlides == this.cantidadPreguntas - 1) {
      this.presentAlert();
      this.numeroPregunta--; // Si es la ultima pregunta resto para que no haga overflow

    } else {


      this.slider.slideNext();
    }



    this.numeroPregunta++;

    this.progressBar();


  }


  limpiarRespuestas(valorParam) { // RespuestaMultiple esta invertido xD
    this.botonDisabled = false;
    let tmpPregunta = this.respuestas;
    tmpPregunta.forEach(respuesta => {

      respuesta.valor == valorParam ? respuesta.seleccionada = true : respuesta.seleccionada = false;

    });

  }
  progressBar() {

    this.progressBarValue = this.numeroPregunta / this.cantidadPreguntas;
    // //console.log(`${this.preguntasRespondidas} / ${this.cantidadPreguntas}`)
  }


  async presentAlert() { //TODO: pasar mensaje por parametro
    // this.respuestasSituacionSalud = respuestasSituacionSalud;
    debugger;
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Esta seguro de envíar el formulario?',
      buttons: [{
        text: 'Cancelar',
        cssClass: 'secondary',
        handler: (blah) => {
          //console.log('Cancelo');
        }
      }, {
        text: 'Aceptar',
        cssClass: 'primary',
        handler: (bleh) => {

          this.calcularValorEvaluacion();

        }
      }],

    });

    await alert.present();
  }



  calcularValorEvaluacion() {
    console.log('calcularValorev');
    // let resultadoAutoEvaluacion = 0;
    // //console.log(this.respuestasSituacionSalud)
    // debugger;
    // this.respuestasSituacionSalud.forEach(respuesta => {

    //   if (respuesta.seleccionada == true) resultadoAutoEvaluacion += respuesta.valorAutoEvaluacion;
    // });
    // let resultadoFinal = resultadoAutoEvaluacion + this.valorBaseAutoEvaluacion;
    // this.user.setValorAutoEvaluacion(resultadoFinal, this.numeroDNI);
    // console.log('VALOR FINAAAAAAAAAAAL ')
    // console.log(`${resultadoAutoEvaluacion} + ${this.valorBaseAutoEvaluacion}`)
    // let fechaActual = new Date();
    // //console.log(fechaActual)
    // this.user.SetFechaAutoEvaluacion(fechaActual, this.numeroDNI)
    // //console.log(fechaActual)
    // this.servicePaeAccess.obtenerCodigo(fechaActual, resultadoFinal, this.numeroDNI).then((data:string) => {
    //   console.log(data);
    //   this.user.setCodigoEvaluacion(data, this.numeroDNI).then(data=>{
    //     console.log(data);
    //     this.router.navigate(["/inicio"]);
    //   })
    // })



  }

}
