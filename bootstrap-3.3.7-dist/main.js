var Reflejos = {
  
    //Variables "globales" del juego
  general: {},
  //Nos dibuja un cuadrado en la posicion (x,y) [coordenadas de la esquina sup izq]
  
    dibujaCuadrado: function (x, y) {
    //Fijamos de que color va a a ser
    Reflejos.general.contexto.fillStyle = Reflejos.general.cuadrado.color;
    //Dibujamos el cuadrado
    Reflejos.general.contexto.fillRect(x, y, Reflejos.general.cuadrado.tamano, Reflejos.general.cuadrado.tamano);
    //Almacenamos su poscion x e y
    Reflejos.general.cuadrado.posicion.x = x;
    Reflejos.general.cuadrado.posicion.y = y;
    //Indicamos el cuadrado está dibujado
    Reflejos.general.cuadrado.dibujado = true;
  },
    
  //Nos borra el canvas entero (en este caso el cuadrado que haya)
  borraCuadrado: function () {
    //Limpiamos el canvas
    Reflejos.general.contexto.clearRect(0, 0, Reflejos.general.$canvas.width(), Reflejos.general.$canvas.height());
    //Indicamos que no hay ningun cuadrado pintado
    Reflejos.general.cuadrado.dibujado = false;
  },
    
  //Llamará a la función callback cuando se haga click sobre el cuadrado
  dectectaClickCuadrado: function (callback) {
      
    Reflejos.general.$canvas.click(function (e) {
      //Lo primero es ver si el cuadrado esta pintado
      if (Reflejos.general.cuadrado.dibujado) {
        //Mapeamos la posicion del raton al canvas
        var raton = {
          x: e.pageX - Reflejos.general.posicionCanvas.x,
          y: e.pageY - Reflejos.general.posicionCanvas.y
        };
        //Comprobamos si el raton esta dentro del cuadrado
        if (raton.x > Reflejos.general.cuadrado.posicion.x && raton.x < (Reflejos.general.cuadrado.posicion.x + Reflejos.general.cuadrado.tamano) && raton.y > Reflejos.general.cuadrado.posicion.y && raton.y < (Reflejos.general.cuadrado.posicion.y + Reflejos.general.cuadrado.tamano)) {
          callback();
        }
      }
    });
  },
    
  //Logica a ejecutar cuando se hace click sobre el cuadrado
  clickCuadrado: function () {
    Reflejos.borraCuadrado();
    clearTimeout(Reflejos.general.cicloActual);
    Reflejos.general.cicloActual = Reflejos.cicloJuego();  
  },
    
  //Adapta el canvas a la resolución de la pantalla
  responsivo: function () {
    //Adaptamos el canvas al tamaño de pantalla
    var ancho = Reflejos.general.$contenedor.width();
    var alto = Reflejos.general.$contenedor.height();
    Reflejos.general.$canvas.attr('width', ancho); //maximo ancho
    Reflejos.general.$canvas.attr('height', alto); //maximo 

    //Fijamos el tamaño del cuadrado relativo al de la pantalla
    Reflejos.general.cuadrado.tamano = ancho > alto ? alto * Reflejos.general.cuadrado.porcentaje : ancho * Reflejos.general.cuadrado.porcentaje;
    //Repitamos el cuadrado si 
    if (Reflejos.general.cuadrado.dibujado) {
      Reflejos.dibujaCuadrado(Reflejos.general.cuadrado.posicion.x, Reflejos.general.cuadrado.posicion.y);
    }

  },
    
  cicloJuego: function () {
      
    if (Reflejos.general.jugando) {
      var x = Math.floor(Math.random() * Reflejos.general.$canvas.width()) + Reflejos.general.posicionCanvas.x;
      var y = Math.floor(Math.random() * Reflejos.general.$canvas.height()) + Reflejos.general.posicionCanvas.y;
      
        //Comprobamos que no se salga de la pantalla
      if ((x + Reflejos.general.cuadrado.tamano) > Reflejos.general.$canvas.width()) {
        x = Reflejos.general.$canvas.width() - Reflejos.general.cuadrado.tamano;
      }
      if ((y + Reflejos.general.cuadrado.tamano) > Reflejos.general.$canvas.height()) {
        y = Reflejos.general.$canvas.height() - Reflejos.general.cuadrado.tamano;
      }
        
      Reflejos.dibujaCuadrado(x, y);
      Reflejos.general.tiempoEnPantalla *= 0.9;
      Reflejos.general.tiempoMaximo = (new Date()).getTime() + Reflejos.general.tiempoEnPantalla;
      
        //TO-DO timeout
        return setTimeout(function(){
            
            if (Reflejos.general.cuadrado.dibujado){ Reflejos.fin(); }
        }, Reflejos.general.tiempoEnPantalla);
        
    }
  },
    
  //params:
  //datos==> array de objetos del tipo {posicion:x,usuario:x,tiempo:x}
  pintarRanking: function (datos) {
    if (datos && datos.constructor == Array) {
      var bloqueHTML = function (posicion, usuario, tiempo) {
        return '<tr><td>' + posicion + '</td><td>' + usuario + '</td><td>' + tiempo + '</td></tr>';
      }
      var clavesEsperadas = ['posicion', 'usuario', 'tiempo'];
      for (var i = 0; i < datos.length; i++) {
        if (typeof datos[i] == 'object') {
          var clavesRecibidas = Object.keys(datos[i]);
          var validador = false;
          if ($(clavesEsperadas).not(clavesRecibidas).length == 0 && $(clavesRecibidas).not(clavesEsperadas).length == 0) {
            $('#cuerpo-ranking').append(bloqueHTML(datos[i][clavesEsperadas[0]], datos[i][clavesEsperadas[1]], datos[i][clavesEsperadas[2]]));
          }
        }
      }
    }

  },
  
    //Nos limpia los valores de la tabla del ranking
  limpiarRanking: function () {
    $('#cuerpo-ranking').empty();
  },
  
//Inicializa las variables globales
  initGeneral: function () {
    Reflejos.general = {
      jugando: true,
      cuadrado: {
        dibujado: false,
        //Se adapta a la pantalla
        tamano: 0,
        //Modificar este valor para cambiar el tamaño del cuadrado
        //Se multiplicará por el tamaño menor del ancho o alto del canvas
        //y dará el valor del lado
        porcentaje: 0.1,
        color: "#FF0000",
        posicion: { //esquina superior izquierda del cuadrado
          x: 0,
          y: 0
        }
      },

      //Tiempo inicial para hacer el primer click
      tiempoEnPantalla: 3000,
      resultados: ['Uy!! Muy mejorable', 'Aceptable', 'No esta mal', 'Buenos reflejos', 'UOOH!! al nivel de Miyagi', 'Veo que la fuerza está contigo']
    }
  },
    
  //Inicializa las variables asociadas al canvas
  initCanvas: function () {
    //Cogemos el elemento canvas
    Reflejos.general.$canvas = $("#canvas_juego"); //elemento jQuery
    Reflejos.general.posicionCanvas = {
      x: Reflejos.general.$canvas.offset().left,
      y: Reflejos.general.$canvas.offset().top
    };
    //Cogemos el contenedor del canvas
    Reflejos.general.$contenedor = Reflejos.general.$canvas.parent();
    //Cogemos el contexto del canvas (Nos da acceso a los metodos interesantes)
    Reflejos.general.contexto = Reflejos.general.$canvas[0].getContext('2d');

  },
 
  //Lógica 
  init: function () {
    //Inicializamos los datos generales
    Reflejos.initGeneral();
    //Inicializamos el canvas
    Reflejos.initCanvas();
    //Adaptacion inicial
    Reflejos.responsivo();
    //Añadimos al evento resize nuestra funcion responsivo
    $(window).resize(Reflejos.responsivo); //No se ponen los parentesis pq no queremos que se ejecute el metodo inmediatamente, si no cuando suceda el evento
    
      //$('body').on('click', function(){ //on.('click' refresca los campos que se añadan
       
      //  $(this).
        
      //});
      
    //Activamos la deteccion de clicks sobre los cuadrados
    Reflejos.dectectaClickCuadrado(Reflejos.clickCuadrado);
    //Creamos un nuevo ciclo de juego
    Reflejos.general.cicloActual = Reflejos.cicloJuego();
    //Actualizar el tiempo
    Reflejos.contador = setInterval(function(){

      var tiempo = Math.floor((Reflejos.general.tiempoMaximo - (new Date()).getTime()) / 10) / 100;
      $('#contador span').text(tiempo);
    }, 10);
        
        //1400 - 1000 = 400ms
        //400/10 = 40
        //40/100 = 0.4s
  },
  
    //Finalizacion del juego
  fin: function () {
    var numResultado;

    if (Reflejos.general.tiempoEnPantalla > 1500) {
      numResultado = 0;
    } else if (Reflejos.general.tiempoEnPantalla > 1200) {
      numResultado = 1;
    } else if (Reflejos.general.tiempoEnPantalla > 900) {
      numResultado = 2;
    } else if (Reflejos.general.tiempoEnPantalla > 700) {
      numResultado = 3;
    } else if (Reflejos.general.tiempoEnPantalla > 500) {
      numResultado = 4;
    } else {
      numResultado = 5;
    }
    //OJO
    clearInterval(Reflejos.contador);
    //$('#contador span').text(0);
    alert(Reflejos.general.resultados[numResultado]);
    Reflejos.general.jugando = false;

          
    //TO-DO  
    //enviar datos
    // coger ranking
    // enseñar ranking
    // volver a empezar
    Reflejos.enviarTiempo();
    Reflejos.cogerRanking();
    //hide game
    //show ranking
      
      
    $('#juego').fadeOut();

    $('#ranking').fadeIn();
      
  },
    
    enviarTiempo: function(){
      
        var nombre = prompt('Introduce un nombre de usuario:');
        if(nombre == ''){nombre = 'htrancon';}
        
        var objeto = {
            usuario: nombre,
            tiempo: Math.floor(Reflejos.general.tiempoEnPantalla/10)/100
        }
        
        $.post('https://curso-js-2014.herokuapp.com/reflejos/ranking', objeto)
        
    },

    cogerRanking: function(){
        
        //var ranking;
        $.get('https://curso-js-2014.herokuapp.com/reflejos/ranking', function(data){
            /*ranking = data;
            return ranking;*/
            Reflejos.pintarRanking(data);
        });
        
    }
            
}