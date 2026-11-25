/**
 * ==============================================================================
 * CALENDARIO DE ADVIENTO - DATOS Y CONTENIDO DE LOS 31 DÍAS (days-data.js)
 * ==============================================================================
 * 
 * ¡ESTE ES EL ARCHIVO PRINCIPAL PARA EDITAR TUS MENSAJES ROMÁNTICOS!
 * No necesitas tocar la lógica del calendario. Solo cambia los textos, nombres
 * y enlaces entre comillas.
 */

// 1. CONFIGURACIÓN GENERAL DEL CALENDARIO
const CALENDAR_CONFIG = {
  // Nombres de la pareja (se actualizarán automáticamente en la portada)
  couple: {
    sender: "Omar BS",            // Tu nombre
    recipient: "Ana Paula Liceaga Soto" // El nombre de tu novia
  },

  // Configuración de su Playlist de Spotify
  spotify: {
    titulo: "Nuestra Playlist en Spotify",
    descripcion: "Las canciones que siempre me recuerdan a ti, a nosotros.",
    // Coloca aquí el enlace a tu playlist de Spotify:
    url: "https://open.spotify.com/playlist/3G709wiriUnQPQfNIrCtrI?si=e92f3dd235e345f5",
    // Si tienes una imagen propia del código de Spotify o un QR, pon su ruta aquí (ej. "assets/images/spotify-qr.png").
    // Si lo dejas vacío (""), el calendario generará el código QR automáticamente usando tu enlace.
    qrImagenUrl: "assets/images/spoty.jpg"
  },

  // Fecha objetivo del calendario
  targetYear: 2026,
  targetMonth: 12, // 12 = Diciembre

  /**
   * MODO DESARROLLADOR / MODO DE PRUEBA:
   * - true:  Muestra la barra flotante de pruebas para simular fechas y probar los 31 días de inmediato.
   * - false: Activa el modo real (las casillas se desbloquean estrictamente según el día del calendario).
   * 
   * IMPORTANTE: Cambia este valor a 'false' justo antes de enviárselo a tu novia.
   */
  devMode: true
};

/**
 * 2. TIPOS DE SORPRESAS DISPONIBLES:
 * - "carta": Mensaje emotivo, poema o anécdota.
 * - "foto": Fotografía con marco polaroid y dedicatoria.
 * - "musica": Canción dedicada con reproductor interactivo.
 * - "cupon": Cupón romántico que se acumula en la futura Wallet.
 * - "pregunta": Trivia interactiva con opciones sobre su historia.
 * - "especial-31": La experiencia culminante de fin de año.
 */
const DAYS_DATA = [
  {
    dia: 1,
    tipo: "carta",
    titulo: "Bienvenida a nuestro Diciembre Mi Güerita Chula!",
    icono: "🎄",
    mensaje: "¡Hoy comienza un pequeño detalle que quise preparar para ti! Quiero compartirte algo que durante mucho tiempo soñé hacer. Es un proyecto que fui construyendo con mucho esfuerzo, ilusión y un poquito de todo lo que he aprendido a lo largo de mi carrera. Quizá no sea el regalo más grande ni el más costoso, pero tiene algo que lo hace especial: está hecho por mí, a mi manera y con mi propio estilo, pensando en ti en cada detalle. Espero que disfrutes este calendario de Adviento, que cada día encuentres una pequeña sorpresa y que, al abrir cada ventanita, puedas sentir todo el cariño con el que lo preparé. Lo hice con mucho amor, mi changuita hermosa preciosa chula. ❤️",
    pie: "Te amo con todo mi corazón."
  },
  {
    dia: 2,
    tipo: "musica",
    titulo: "Nuestra Canción Especial",
    icono: "🎶",
    mensaje: "Jamás voy a olvidar esa canción que me dedicaste por primera vez. Siempre tendrá un significado especial para mí.",
    cancionTitulo: "Recuerdas esta canción?",
    cancionArtista: "Bruno Mars",
    audioUrl: "assets/audio/risk_it_all.mp3",
    pie: "Escúchala pensando en mí."
  },
  {
    dia: 3,
    tipo: "cupon",
    titulo: "Vale por una Cena Romántica",
    icono: "🎟️",
    cuponId: "CUPON-DIC-03-CENA",
    mensaje: "Este cupón te da derecho a una cena especial en tu restaurante favorito, o cocinada por mí con tu platillo preferido y tu postre consentido.",
    validez: "Valido hasta que me dejes de amar.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 4,
    tipo: "foto",
    titulo: "Primera Cita",
    icono: "📷",
    fotoUrl: "assets/images/cita_1.jpeg", // Puedes colocar la ruta de tu foto: "assets/images/recuerdo1.jpg"
    mensaje: "No te imaginas lo nervioso que estaba ese día. Me preocupaba que no te gustara la cita, que te aburrieras o que no lograra impresionarte. Quería que todo saliera perfecto porque realmente me importaba hacerte feliz.",
    pie: "1 / 3."
  },
  {
    dia: 5,
    tipo: "pregunta",
    titulo: "Trivia!!",
    icono: "❓",
    pregunta: "Cual es mi color favorito?",
    opciones: [
      "Azul",
      "Rojo",
      "Negro"
    ],
    respuestaCorrecta: 1, // Índice de la respuesta (0 es la primera, 1 la segunda, etc.)
    // Mensaje si responde correctamente:
    mensajeCorrecto: "Te has ganado una carta! Ahora toma SS y mándame la foto como comprobante ❤️",
    // Mensaje personalizado si se equivoca:
    mensajeError: "Pesimo servicio amor! Te equivocaste... pero no pasa nada, igual te amo con locura 💕",
    // Foto opcional que se revela SOLO si acierta (ej. "assets/images/foto_premio.jpg"):
    fotoAcierto: "", //AGREGAR FOTOOO DE CUANDO ESTES HACIENDO LA CARTAAAA
    pie: "Qlo si no te la sabes."
  },
  {
    dia: 6,
    tipo: "carta",
    titulo: "Lo que más admiro de ti",
    icono: "✨",
    mensaje: "Admiro muchísimo la persona que eres, tu manera de ver la vida, lo amorosa y detallista que puedes llegar a ser. Admiro tu inteligencia, tu dedicación y esa forma tan bonita que tienes de hacer las cosas. Pero, sobre todo, admiro que seas tú, con todo lo que te hace única. Me encanta poder conocerte cada día un poquito más.",
    pie: "Eres mi mayor inspiración."
  },
  {
    dia: 7,
    tipo: "cupon",
    titulo: "Vale por una Tarde de Pelis & Mimos",
    icono: "🍿",
    cuponId: "CUPON-DIC-07-PELIS",
    mensaje: "Un dia de películas, botanas y las mantitas. Cero interrupciones, solo nosotros dos descansando juntitos.",
    validez: "Canjeable en cualquier fin de semana.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 8,
    tipo: "musica",
    titulo: "Mi más bonita fortuna.",
    icono: "🎧",
    mensaje: "Qué deleite es poder admirarte, disfrutarte y descubrir cada día nuevas razones para enamorarme de ti.",
    cancionTitulo: "Disfruto",
    cancionArtista: "Carla Morrison",
    audioUrl: "assets/audio/disfruto.mp3",
    pie: "Siempre en mi mente."
  },
  {
    dia: 9,
    tipo: "foto",
    titulo: "Nuestra risa favorita",
    icono: "📸",
    fotoUrl: "assets/images/risa.jpeg",
    mensaje: "Sin duda alguna, mi fotografía favorita. ¿Cómo explicarle a alguien que en una simple imagen puede existir tanta felicidad? Para mí, ese instante lo es todo. Es el momento en el que estas presente, te miro y siento que no necesito absolutamente nada más. Porque, si estás tú, de alguna manera, ya lo tengo todo..",
    pie: "Momentos inolvidables."
  },
  {
    dia: 10,
    tipo: "carta",
    titulo: "10 Días de Diciembre",
    icono: "💌",
    mensaje: "Ya pasaron los primeros diez días del mes y cada día que pasa me convenzo más de que elegirte ha sido la decisión más hermosa de mi vida. (Tienes derecho a reclamar tu carta del dia)",
    pie: "Gracias por ser mi paz."
  },
  {
    dia: 11,
    tipo: "cupon",
    titulo: "Vale por un Masaje",
    icono: "💆‍♀️",
    cuponId: "CUPON-DIC-11-MASAJE",
    mensaje: "Válido para un masaje relajante de cuello, espalda o tantrico con música suave y aromaterapia cuando hayas tenido un día pesado.",
    validez: "Todo masaje tiene final feliz",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 12,
    tipo: "pregunta",
    titulo: "Nuestros Secretos",
    icono: "🗝️",
    pregunta: "Quien es el mas pedorro de los dos?",
    opciones: [
      "Omar",
      "Pau",
      "Opcion A"
    ],
    respuestaCorrecta:1,
    mensajeAcierto: "Que bueno que lo aceptes mi vida chula!.",
    mensajeError: "Oyeme! esas son mentiras mentirosaaass... jsjs",
    pie: "Recuerda que no es bueno mentir."
  },
  {
    dia: 13,
    tipo: "carta",
    titulo: "Desde que te conocí",
    icono: "🌟",
    mensaje: "Hay algo que quizá nunca te he explicado del todo, siempre tuviste algo que me llamaba la atención. Desde que te conocí había algo en ti que me atraía, y no era solamente cómo te veías. Me encantaba tu carácter, esa personalidad tan tuya, lo divertida que eras y esa manera de ser que dejaba claro que no eras alguien cualquiera. Siempre me pareciste una mujer con algo especial. Incluso recuerdo que al principio quizá no imaginaba todo lo que terminaríamos viviendo, pero de alguna manera siempre había algo que me hacía fijarme en ti. Y ahora que miro hacia atrás, me da mucha curiosidad pensar en todas las vueltas que dio la vida para que termináramos aquí.",
    pie: "Que bonito que después de todo hoy pueda llamarte mi amor."
  },
  {
    dia: 14,
    tipo: "musica",
    titulo: "Amor de Mis Amores",
    icono: "🎵",
    mensaje: "De todas las personas que pude encontrar en esta vida, hay algo en ti que me hace sentir que eres mi persona. No solamente te amo por lo que eres, sino por lo que siento cuando estoy contigo. Eres mi tranquilidad, mi alegría y esa persona con la que quiero compartir todo lo que todavía me falta vivir.",
    cancionTitulo: "Amor, Amor de Mis Amores",
    cancionArtista: "Natalia Lafourcade",
    audioUrl: "assets/audio/amor_de_mis_amores.mp3",
    pie: "Quedate conmigo porfavor."
  },
  {
    dia: 15,
    tipo: "cupon",
    titulo: "Vale por tu Postre Consentido",
    icono: "🍰",
    cuponId: "CUPON-DIC-15-POSTRE",
    mensaje: "Tu café, helado, crepa o pastel favorito corre por mi cuenta. ¡Tú solo di cuál se te antoja!",
    validez: "Válido para endulzar cualquier tarde.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 16,
    tipo: "foto",
    titulo: "Gymrats ❤️",
    icono: "🖼️",
    fotoUrl: "assets/images/gym.jpeg",
    mensaje: "No sabes lo mucho que me gusta poder entrenar contigo, el poder darnos besos entre series y poder ver ese qlote que te cargas mi vida chula.",
    pie: "Mi persona favorita."
  },
  {
    dia: 17,
    tipo: "carta",
    titulo: "Creciendo Juntos",
    icono: "🌱",
    mensaje: "Cuando pienso en el futuro, inevitablemente apareces tú. Me imagino viajando contigo, conociendo lugares que nunca hemos visto y creando recuerdos que algún día podamos contar. Me imagino teniendo nuestra casa, construyendo nuestro negocio y disfrutando de todo lo que nos costó conseguir. Incluso me imagino con un hijo, aunque sé que todavía tengo que convencerte de esa pequeña parte del plan. JAJAJA. Pero más allá de cómo termine siendo nuestro futuro, hay algo que sí tengo claro: me gustaría compartirlo contigo. Quiero vivir los días emocionantes, pero también los días normales; esos en los que no hay viajes, celebraciones ni grandes acontecimientos, solamente nosotros haciendo nuestras cosas. Porque no necesito que todos los días sean extraordinarios para querer vivirlos a tu lado.",
    pie: "Juntos somos imparables."
  },
  {
    dia: 18,
    tipo: "pregunta",
    titulo: "¿Cuál es nuestro súper poder?",
    icono: "✨",
    pregunta: "¿Qué es lo que siempre nos hace superar cualquier desacuerdo o mal día?",
    opciones: [
      "Nada por que se nos bota la tacha bien feo.",
      "Ghostearnos",
      "Manosearnos mientras nos escuchamos atentamente y lograr una excelente comunicacion jsjs."
    ],
    respuestaCorrecta: 2,
    mensajeAcierto: " Todo por eso nos merecemos una noche de pasion. Si o Que?",
    mensajeError: "Que feo que escogas esta opcion. 😔",
    pie: "Nuestro amor es fuerte y sincero."
  },
  {
    dia: 19,
    tipo: "cupon",
    titulo: "Vale por un Deseo Libre",
    icono: "⭐",
    cuponId: "CUPON-DIC-19-DESEO",
    mensaje: "Válido para pedir lo que quieras: un capricho, una salida sorpresa, un desayuno a la cama o lo que se te ocurra. ¡Tú mandas!",
    validez: "Poder ilimitado para ti.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 20,
    tipo: "musica",
    titulo: "Mi único amor",
    icono: "🌹",
    mensaje: "Esta canción me recuerda mucho a nosotros. A todo lo que hemos vivido, a lo que hemos aprendido y a todo lo que todavía nos falta por construir. No quiero que seamos perfectos, quiero que seamos ese lugar seguro al que siempre podamos regresar. Quiero seguir riéndome contigo, abrazarte, viajar, cumplir nuestros sueños y descubrir todos esos futuros que todavía nos esperan. Si algo tengo claro, es que quiero seguir eligiéndote. Mi amor, mi güerita chula, mi persona favorita.",
    cancionTitulo: "My One And Only Love",
    cancionArtista: "Mon Laferte",
    audioUrl: "assets/audio/my_one.mp3",
    pie: "Amor para toda la vida."
  },
  {
    dia: 21,
    tipo: "carta",
    titulo: "Me encanta que seas tú.",
    icono: "🐵",
    mensaje: "Me encanta tu forma de ser, incluso esas pequeñas cosas que seguramente haces sin darte cuenta. Me encanta cuando paras la trompita, cuando haces tus gestos y cuando algo no te gusta y sale esa doñita que llevas dentro diciendo «aaaay nooo». Son detalles que quizá para ti son insignificantes, pero que para mí forman parte de todo eso que te hace ser tú. Me gusta observarte, escucharte y descubrir esas pequeñas expresiones que ya conozco tan bien. También me encanta que seas una mujer de carácter, que tengas tu propia personalidad y que no tengas que cambiar para agradarle a nadie. No quiero una versión diferente de ti, me gusta la que eres, con tus ocurrencias, tus gestos, tus enojitos y todas esas cositas que hacen que me encantes cada día un poquito más.",
    pie: "Mi refugio favorito eres tú."
  },
  {
    dia: 22,
    tipo: "foto",
    titulo: "2 / 3",
    icono: "📷",
    fotoUrl: "assets/images/cita_2.jpeg",
    mensaje: "Nuestra segunda cita, una pizza, carritos de Cars, nuestra primera carta para el álbum y un heladito de pre cumpleaños. Son esos detalles que hacen que nuestra historia sea tan especial. ❤️",
    pie: "Un pedacito más de nuestra historia."
  },
  {
    dia: 23,
    tipo: "cupon",
    titulo: "Vale por un Desayuno Especial",
    icono: "☕",
    cuponId: "CUPON-DIC-23-DESAYUNO",
    mensaje: "Válido por un desayuno preparado y servido con todo el amor: café calientito, hotcakes o lo que tú prefieras.",
    validez: "Para una mañana relajada y consentida.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 24,
    tipo: "carta",
    titulo: "¡Feliz Nochebuena, Mi Amor!",
    icono: "🎄",
    mensaje: "Mi güerita chula, quizá esta Navidad no podamos despertar juntos, abrazarnos o compartir una cena como seguramente algún día nos gustaría hacerlo. Y aunque me encantaría tenerte cerquita, entiendo que por ahora hay circunstancias que todavía no nos permiten vivir ciertas cosas como quisiéramos. Pero no quiero que eso le quite lo especial a este día ni a lo que siento por ti. Me gusta imaginar que algún día tendremos nuestras propias Navidades, preparando galletas, intercambiando regalos, haciendo nuestras tonterías y creando esas tradiciones que tanto nos gustaría compartir. Quizá hoy no podamos vivirlo todo, pero me emociona pensar que todavía tenemos muchísimas Navidades por delante. Mientras tanto, quiero que sepas que, aunque no esté físicamente a tu lado, hay una parte de mí que siempre está pensando en ti. Gracias por formar parte de mi vida y por convertirte en alguien con quien también sueño compartir estas fechas. Feliz Navidad, mi amor. Ojalá algún día podamos mirar atrás y recordar esta etapa mientras celebramos todas esas cosas que tanto imaginamos. Te amo muchísimo. ❤️",
    pie: "Algún día serán nuestras galletas, nuestra casa y nuestra Navidad."
  },
  {
    dia: 25,
    tipo: "musica",
    titulo: "Tú eres mi trébol",
    icono: "🎁",
    mensaje: "No sé cómo explicarlo, pero hay algo en ti que hace que todo se sienta un poquito más bonito. Y qué suerte la mía que seas tú",
    cancionTitulo: "Japanese Denim",
    cancionArtista: "Daniel Caesar",
    audioUrl: "assets/audio/japanese.mp3",
    pie: "Te amo infinitamente."
  },
  {
    dia: 26,
    tipo: "cupon",
    titulo: "Vale por un Abrazo Eterno",
    icono: "🫂",
    cuponId: "CUPON-DIC-26-ABRAZO",
    mensaje: "Canjeable en cualquier momento en que necesites calma, cariño o simplemente recordar lo mucho que te amo. Duración: hasta que tú decidas soltarte.",
    validez: "Canjes ilimitados.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 27,
    tipo: "pregunta",
    titulo: "Heroe",
    icono: "💌",
    pregunta: "¿Quien es mi superheroe favorito?",
    opciones: [
      "Spiderman",
      "Godzilla",
      "Diosito"
    ],
    respuestaCorrecta: 0,
    mensajeAcierto: "Tututuuutuuu..  Te has ganado otraaa carta, manda SS al dm",
    mensajeError: "No digas tus cosas merywey :(",
    pie: "Hasta los héroes necesitan a alguien como tú"
  },
  {
    dia: 28,
    tipo: "foto",
    titulo: "Bikers ",
    icono: "📸",
    fotoUrl: "assets/images/cascos.jpeg",
    mensaje: "Quizá para los demás solo sea un paseo en moto, pero para mí son de esos momentos que quisiera guardar para siempre. Tú abrazándome, recargada en mi espalda y yo disfrutando hasta el más pequeño detalle de tenerte conmigo.",
    pie: "Jamas me cansere de decirte Te Amo."
  },
  {
    dia: 29,
    tipo: "carta",
    titulo: "Si alguna vez dudas de lo que siento",
    icono: "🕯️",
    mensaje: "Sé que no siempre soy el mejor expresando mis sentimientos y que quizá en ocasiones mis palabras no alcanzan a explicar todo lo que pasa por mi corazón. Pero quiero que sepas que eso nunca significa que sienta poco. Al contrario, hay tantas cosas que quisiera decirte que a veces ni siquiera sé por dónde empezar. Contigo me nace ser detallista, pensar en ti, imaginar cosas que podrían hacerte feliz y buscar maneras de demostrarte lo importante que eres para mí. Me gusta saber que estás ahí, que puedo acercarme a ti y encontrar a alguien que me escucha y me comprende. No quiero que tengas que adivinar lo que significas para mí. Quiero aprender a expresártelo mejor, no solamente con palabras, sino también con acciones, porque mereces sentirte tan amada como yo me siento cuando estoy contigo.",
    pie: "Siempre tú."
  },
  {
    dia: 30,
    tipo: "cupon",
    titulo: "Vale nuestra 3 / 3 ",
    icono: "✨",
    cuponId: "CUPON-DIC-30-SORPRESA",
    mensaje: "Un plan misterioso organizado completamente por mí: transporte, destino y actividades. Solo tendrás que vestirte linda y dejarte consentir!",
    validez: "De favor avisar que fin de semana :P.",
    pie: "Este cupón se guardará en tu Wallet de Amor."
  },
  {
    dia: 31,
    tipo: "especial-31",
    titulo: "Fin de Año & Gran Sorpresa Final",
    icono: "👑",
    mensaje: "Hoy cerramos este ciclo y damos la bienvenida a un nuevo año. Gracias por ser la persona con la que quiero compartir cada medianoche, cada brindis y cada nuevo sueño.",
    cartaEspecial: "Mi amor: Comenzamos este calendario con una promesa y hoy la reafirmo: no hay lugar donde prefiera estar que a tu lado. Gracias por este año maravilloso, por cada sonrisa, por cada abrazo y por ser mi hogar. Que este año que comienza esté lleno de salud, éxitos, risas y mucho más amor juntos. ¡Feliz Año Nuevo!",
    // 📸 TUS 3 MOMENTOS FAVORITOS DEL AÑO (ACTO 2):
    // Coloca aquí las 3 fotos que quieras mostrar con su título y dedicatoria:
    recuerdosAno: [
      {
        titulo: "Nuestras mejores risas",
        fotoUrl: "assets/images/recuerdo_1.jpeg", // Coloca aquí tu primera foto: ej. "assets/images/momento1.jpg"
        texto: "Incontables anécdotas que solo nosotros dos entendemos."
      },
      {
        titulo: "Nuestras aventuras",
        fotoUrl: "assets/images/recuerdo_2.jpeg", // Coloca aquí tu segunda foto: ej. "assets/images/momento2.jpg"
        texto: "Caminando juntos hacia nuevos horizontes y metas."
      },
      {
        titulo: "Nuestro hogar",
        fotoUrl: "assets/images/recuerdo_3.jpeg", // Coloca aquí tu tercera foto: ej. "assets/images/momento3.jpg"
        texto: "Porque mi hogar favorito en el mundo entero eres tú."
      }
    ],
    pie: "Con todo mi amor eterno, por siempre tuyo."
  }
];
