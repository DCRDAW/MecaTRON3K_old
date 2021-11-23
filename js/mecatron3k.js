/**
  @file Controlador principal del Juego MecaTRON-3000
  @author Miguel Jaque <mjaque@fundacionloyola.es>
  @license GPL v3 2021
**/

'use strict'

/**
  Controlador principal del juego.
**/
class Juego{
  /**
    Constructor de la clase Juego
  **/
  constructor(){
    this.vista = new Vista()
    this.modelo = new Modelo()
    this.generadorPalabras = null
    this.animador = null
    this.divPrincipal = null
    window.onload = this.iniciar.bind(this)
  }
  /**
    Pone en marcha el juego.
  **/
  iniciar(){
    console.log('Iniciando...')
    this.divPrincipal = document.getElementById('divPrincipal')
    this.vista.div = this.divPrincipal
    this.generadorPalabras = window.setInterval(this.generarPalabra.bind(this), 3000)
    this.animador = window.setInterval(this.vista.moverPalabras.bind(this.vista), 300)
    window.onkeypress = this.pulsar.bind(this)
    this.sw=0
  }

  generarPalabra(){
    let nuevaPalabra = this.modelo.crearPalabra()
    this.vista.dibujar(nuevaPalabra)
  }

  /**
    Evento de atención a la pulsación del teclado.

    Busca las palabras que tienen la letra pulsada y cambia su estado.
    Cambiando el estilo y moviendo las letras de un sitio a otro.
    @param {KeyboardEvent} evento Evento de pulsación del teclado.
  **/
  pulsar(evento){
    let letraPulsada = evento.key
    
    if(letraPulsada==' ' && this.sw==0){
      evento.preventDefault();
      clearInterval(this.generadorPalabras);
      clearInterval(this.animador);
      this.sw=1
      letraPulsada=null
      
    }
    if(letraPulsada==' ' && this.sw==1){
      evento.preventDefault();
      this.generadorPalabras = window.setInterval(this.generarPalabra.bind(this), 3000)
      this.animador = window.setInterval(this.vista.moverPalabras.bind(this.vista), 300)
      this.sw=0
    }
    //Busco todas las palabras
    let palabras = this.divPrincipal.querySelectorAll('.palabra')
    for(let palabra of palabras){
      let span = palabra.children.item(0)
      let nodoTexto = palabra.childNodes[1]
      let textoRestante = nodoTexto.nodeValue
      let primeraLetraTextoRestante = textoRestante.charAt(0)
      if (letraPulsada == primeraLetraTextoRestante){
        span.textContent += letraPulsada
        nodoTexto.nodeValue = textoRestante.substring(1)

        //Si ha completado la palabra, la elimino y sumo puntos
        if (nodoTexto.nodeValue.length == 0){
          palabra.remove()
          this.modelo.sumarPunto()
          this.vista.mandarPuntos(this.modelo.puntuacion)
        }
      }
      else{
        //Ha fallado, repongo el texto de la palabra
        nodoTexto.nodeValue = span.textContent + nodoTexto.nodeValue
        span.textContent = ''
      }
    }
  }
}

/**
  Clase Vista que muestra el juego.
**/
class Vista{
  constructor(){
    this.div = null   //Div donde se desarrolla el juego
    this.puntuacion = new Puntuacion(0)
  }
  /**
    Dibuja el área de juego.
    @param palabra {String} La nueva palabra.
  */
  dibujar(palabra){
    // <div class=palabra>Meca</div>
    let div = document.createElement('div')
    this.div.appendChild(div)
    let span = document.createElement('span')
    div.appendChild(span)
    div.appendChild(document.createTextNode(palabra))
    div.classList.add('palabra')
    div.style.top = '0px'
    div.style.left = Math.floor(Math.random() * 85) + '%'
  }
  /**
   * envia los puntos a la clase puntuacion para que los muestre
   * @param {*} puntos los puntos que el jugador tiene en ese momento
   */
  mandarPuntos(puntos){
    this.puntuacion.puntua=puntos
    this.puntuacion.mostrar()
  }
  /**
    Mueve las palabras del Juego
  **/
  moverPalabras(){
    //Busco todas las palabras del div
    let palabras = this.div.querySelectorAll('.palabra')

    //Para cada palabra, aumento su atributo top.
    for(let palabra of palabras){
      let top = parseInt(palabra.style.top)
      top += 5
      palabra.style.top = `${top}px`
      //Si ha llegado al final
      if (top >= 760)
        palabra.remove()
    }
  }
}

/**
  Modelo de datos del juego.
**/
class Modelo{
  constructor(){
      this.nivel= 1;
      this.puntosPasarNivel= 5;
      this.palabras = [
          ['ju','fr','fv','jm','fu','jr','jv','fm'],
          ['fre','jui','fui','vie','mi','mery','huy'],
          ['juan','remo','foca','dedo','cate']
        ]
      this.puntuacion = 0
  }
  /**
    Devuelve una nueva palabra.
    Devuelve aleatoriamente unn elemento del array de palabras.
    @return {String} Palabra generada
  **/
  crearPalabra(){
    switch (this.nivel) {
      case 1:
        return this.palabras[0][Math.floor(Math.random() * 8)]
        break;
      case 2:
        return this.palabras[1][Math.floor(Math.random() * 7)]
        break;
      case 3:
        return this.palabras[2][Math.floor(Math.random() * 5)]
        break;
      default:
        return this.palabras[2][Math.floor(Math.random() * 5)]
        break;
    }
    
  }
  /**
   * suma 1 punto cada vez que es llamada
   */
  sumarPunto(){
    this.puntuacion++
   /* let puntos=document.getElementById('puntuacion')
    puntos.textContent=`Puntuacion= ${this.puntuacion}`
    */

    this.comprobarNivel;
  }
  /**
   * comprueba si el jugador tiene los puntos suficientes como para subir de nivel
   */
  comprobarNivel(){
    if(this.puntuacion>this.puntosPasarNivel){
      let textoLvl= document.getElementById('nivel')
      this.nivel++
      this.puntosPasarNivel=this.puntosPasarNivel+5
      textoLvl.textContent=`Nivel= ${this.nivel}`
    }
    if(this.puntuacion<this.puntosPasarNivel-5){
      let textoLvl= document.getElementById('nivel')
      this.nivel--
      this.puntosPasarNivel=this.puntosPasarNivel-5
      textoLvl.textContent=`Nivel= ${this.nivel}`
    }
  }
 
}
/**
 * clase Puntuacion que almacena y muestra los puntos
 */
class Puntuacion{
  constructor(punto){
    this.puntua=punto
  }
  /**
   * muestra la puntuacion por pantalla
   */
  mostrar(){
    let puntos=document.getElementById('puntuacion')
    puntos.textContent=`Puntuacion= ${this.puntua}`
  }
}   

var app = new Juego()
