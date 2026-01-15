# HOAXAGON
#### GDD por Óscar Durán Narganes y Telmo Kissoca Bailán.
---

## Descripción

Hoaxagon es un juego serio de puzles y simulación centrado en torno a la comprensión lectora y el reconocimiento de patrones en el que el jugador asume el papel de moderador de una red social. Para llevar a cabo esa labor, este deberá revisar y analizar los mensajes enviados en la red, asegurándose de que se ciernen a sus reglas.

## Finalidad educativa

El juego tiene el propósito de enseñar a identificar la argumentación de mala fe hallada en la desinformación para que el jugador pueda evitar ser partícipe o víctima de ella; así fomentando el discurso sincero y ejercitando el reconocimiento de patrones. Esto se hace mediante la interfaz de una red social, con la que muchos tendrán familiaridad; y la repetición espaciada, que afianzará los conocimientos a largo plazo.

## Público objetivo

Hoaxagon trata su tema de desinformación de una forma humorística, intentando que su finalidad formativa sea digerible y accesible para muchos grupos demográficos. Sin embargo, el juego también posee una gran cantidad de texto que debe ser leída con rapidez, por lo que el perfil de su público se ajusta más al de un estudiante de secundaria o educación superior.

## Pruebas y evaluación

El impacto del juego se evaluará mediante preguntas realizadas al jugador antes y después de completar su experiencia, así como la observación de ciertos eventos a lo largo de ella mediante el uso de logs. 
Las preguntas girarán en torno a la argumentación, proponiendo al jugador un mismo punto de vista formateado de varias formas; algunas falaces y otras legítimas. Como el objetivo es mejorar las capacidades argumentativas y analíticas del jugador, estas pruebas demostrarán que el proyecto ha sido un éxito si este es capaz de identificar cada tipo de argumento con mayor precisión tras el término de la partida.
Por otro lado, los datos recogidos por los logs estarán enfocados al tiempo transcurrido entre eventos de interés, como los aciertos y errores. De este modo, podremos verificar si el jugador adquiere soltura a lo largo de la partida, mostrando una mejora en el reconocimiento de patrones.

## Mecánica

El jugador lee comentarios enviados en una red social, y debe evaluarlos según sean estos falaces o no acorde a una lista de principios. El número de evaluaciones que el jugador puede realizar únicamente está limitado por un cronómetro que cuenta atrás a lo largo de la partida.

### Cámara y espacio de juego

La cámara muestra el espacio de juego en su totalidad, incluyendo el comentario actual y el menú lateral a la derecha, que a su vez incluye el menú de evaluación del comentario y la información que el jugador puede consultar. A la izquierda también muestra el botón de modo de inspección y el cronómetro representando el tiempo restante, así como el botón de salida. La cámara permanece inmóvil a lo largo de la partida, pero alternará entre el menú principal y la pantalla de juego.

### Controles

El juego en su totalidad está controlado por el ratón. El jugador puede pulsar el botón izquierdo para seleccionar los botones de acción y consultar información adicional. No obstante, ciertas funciones, como aceptar y rechazar comentarios así como el control del modo de inspección, también pueden ser realizadas mediante atajos de teclado.

### Acciones

Aceptar comentario:
Si el jugador determina que no hay ningún elemento falaz en el comentario, este sólamente debe aceptarlo para pasar al siguiente.

Rechazar comentario:
Acción que ejecuta el jugador cuando encuentra un elemento falaz en el comentario. El jugador debe rechazar el comentario para pasar al siguiente.

Comprobar información: 
El juego cuenta con un panel lateral que incluye todas las distintas falacias que pueden estar presentes en cada mensaje. Cada falacia tiene una pequeña frase descriptiva, así como una explicación en detalle si decide pulsar en su apartado correspondiente.

Modo de inspección:
El jugador puede entrar y salir del modo de inspección libremente. En este modo, el jugador puede asociar fragmentos del comentario a la información del panel lateral para verificar que se corresponde a cierta falacia, con cierto tiempo de enfriamiento entre asociaciones. Sin embargo, el jugador no podrá realizar la acción de comprobar información mientras esté en él. 

Pausa:
El jugador tendrá la opción de pausar el juego en partida, ocultando la pantalla de juego con el fin de impedir el uso de estrategias ilegítimas. Mientras el juego está pausado, el cronómetro no avanzará, y el jugador no podrá tomar otras acciones hasta reanudar.

Salir:
En el caso de que el jugador no quiera continuar la partida, este también puede concluirla prematuramente cuando lo vea necesario. Esto automáticamente proporcionará la puntuación final y devolverá al jugador al menú principal.

### Eventos

Acierto:
Evaluar un comentario correctamente otorga puntuación.

Error: 
Evaluar un comentario incorrectamente resta tiempo al cronómetro.

Identificación de falacia:
Correctamente señalar la falacia presente en un comentario falaz otorga puntuación adicional.

Comentarios estrella:
Comentarios con un tráfico mayor de lo normal. Estos proporcionan puntuación adicional y restauran tiempo al cronómetro si son evaluados correctamente.

Combo:
Un jugador que apunta varios aciertos en rápida sucesión acumula un combo. El combo aporta puntuación adicional, y aumenta las posibilidades de que aparezca un comentario estrella. Después de que el jugador reciba un comentario estrella, la probabilidad adicional se reinicia.

## Dinámica

### Estructura del juego

El juego ofrece un tutorial, un modo de entrenamiento y un modo de juego arcade. De esta manera, el jugador no deberá repetir contenido que ya haya completado. El jugador puede iniciar una partida normal en cualquier momento, pero se recomienda visitar el tutorial primero.

El tutorial presenta una serie de situaciones en las que el jugador se puede encontrar a lo largo de una partida cualquiera, mientras que se introducen los distintos elementos de juego. El jugador recibirá una serie de instrucciones en la forma de comentarios escritos, y deberá actuar acorde a ellas para avanzar. Tras cumplir todos los objetivos planteados por el tutorial, el jugador será devuelto al menú principal, y podrá elegir otro modo de juego. El tutorial durará entre 2 y 6 minutos según la cooperación del jugador.

Respecto al modo de entrenamiento, el juego ofrece un menú en el que se puede iniciar una partida con un tipo particular de falacia. De esta manera, el jugador escoge las que no conozca bien para después ir al modo de juego normal con todo sabido. Cabe destacar que de todas formas el jugador tendrá información de cada tipo de falacia durante la partida. 
Completar todos los entrenamientos individuales no durará más de 10 minutos.

Cada vez que se inicia una nueva partida en modo arcade, el jugador recibe una breve explicación de una nueva clase de falacia o irregularidad que debe tener en cuenta a la hora de aceptar o rechazar los comentarios. Tras esto, el jugador empieza en el nivel 1, y comienza su rutina de moderación mientras que el cronómetro empieza su cuenta atrás desde los 3 minutos. A medida que evalúa comentarios e identifica falacias correctamente, el jugador recibe puntuación adicional, gradualmente llenando un medidor hasta llegar al nivel siguiente. Cuando esto ocurre, el usuario recibe una nueva falacia argumentativa que tener en cuenta, y continúa desde el mismo punto, con un cierto tiempo adicional añadido al cronómetro. Tras el nivel 10, no se añadirán más falacias, y la puntuación podrá aumentar indefinidamente. El juego termina únicamente si se acaba el tiempo, o si el jugador lo concluye prematuramente. 
Una partida en el modo arcade tiene una duración variable según el desempeño del jugador, desde unos segundos hasta en torno a los 10 minutos. Se estima que la partida promedio durará unos 5 minutos.

Una sesión de juego podrá durar entre 10 a 30 minutos, según la dedicación personal y habilidad del jugador.


### Objetivo y conflicto

El objetivo en cada partida es reducir el nivel de toxicidad en la red social lo máximo posible. Para ello, debe rechazar los comentarios que tengan algún tipo de recurso falaz o transmitan algún tipo de mensaje incorrecto, y aceptar los que no tengan nada discordante. 

### Refuerzo y castigo

Aceptar un comentario correcto y rechazar uno incorrecto se considera un acierto y suma puntos al contador de la partida; mientras que rechazar un comentario correcto y aceptar uno incorrecto se considera un error, quitando varios segundos del cronómetro. Además, los jugadores que sean particularmente ágiles serán capaces de acumular combos, así adquiriendo una puntuación mayor y aumentando la probabilidad de que aparezcan mensajes especiales que aportarán más puntos y tiempo adicional.
Esto crea una forma interactiva de equilibrar los aciertos y errores sin llevar a un sentimiento de frustración abrumante, situando cada uno en los ejes del tiempo y puntuación respectivamente: individuales pero estrechamente relacionados el uno con el otro.

## Estética

### Mundo y narrativa

Hoaxagon presenta una red social ficticia en la que personajes geométricos comparten sus opiniones de una forma u otra; sin embargo, estas figuras a menudo usan argumentos falsos y otras malas prácticas para distorsionar la realidad e imponer su visión sobre otros. 
Por consiguiente, el jugador es contactado por la enigmática figura de Icosamuel, una inteligencia artificial que pretende actualizarse mediante las publicaciones enviadas en la red. Para ello, Icosamuel le pide analizar dichas publicaciones, aceptando aquellas que sigan sus requisitos y rechazando aquellas que los incumplan.
Los mensajes enviados por los personajes de Hoaxagon resultan similares a publicaciones realizadas en nuestro mundo, con la diferencia de que los problemas tratados por el juego giran en torno a la geometría. Esto le da un toque cómico a Hoaxagon, despolitizándolo y haciéndolo más accesible sin adentrarse en temas más profundos que caigan fuera de su enfoque.

### Experiencia del jugador

El marco humorístico de Hoaxagon sirve como una capa de abstracción para comunicar la idea principal de desinformación, intentando despolitizar el tema y que así sea más fácil de abordar. De este modo, se pretende enseñar al jugador mediante la interfaz del juego de puzles, minimizando los sentimientos de fatiga y sustituyéndolos por orgullo y satisfacción al llegar a un nuevo nivel o alcanzar una nueva puntuación máxima.

El juego está principalmente en español, aunque cabe la posibilidad de localizarlo al inglés para hacerlo más accesible.

### Visual

El juego muestra un estilo gráfico minimalista y principalmente monocromo, intentando no complicar los elementos visuales excesivamente. Esto pretende hacer que la interfaz tenga la mayor claridad posible y sea inmediatamente intuitiva para cualquiera. Algunos elementos particularmente importantes, como la lupa que activa el modo de inspección o el cronómetro que muestra el tiempo restante, poseen sombras para destacarlos aún más sobre el resto de la interfaz. Todo esto es accesorio al objetivo de abstracción compartido por todos los elementos de Hoaxagon, mostrando una versión simplificada de la realidad que pretende ejercitar la práctica más que comunicar la teoría.
Interfaz


La interfaz visual del juego se divide horizontalmente en un campo grande a la izquierda donde aparecen los comentarios y otro más pequeño a la derecha que representa el panel de moderador.
El panel derecho contiene información básica del usuario cuyo comentario se está analizando, los botones de aceptar y rechazar el comentario, y una lista que conforma la chuleta con la información necesaria para identificar los tipos de falacia que van a aparecer en esa fase del juego.

## Referencias

Hoaxagon está principalmente inspirado en el juego Papers Please desde el punto de vista mecánico: el modo de inspección que el jugador usa para comprobar la legitimidad de los argumentos se corresponde a su propio modo de inspección. La dinámica del juego también es bastante similar a la de Papers Please, al tener que evaluar el mayor número de casos posible en un tiempo limitado.
BadNews también influyó en el desarrollo del juego, principalmente en respecto a la tarea que el jugador recibe de identificar contenido sensacionalista.

## Uso de IA

Todos los assets han sido producidos manualmente, no obstante se han utilizado las herramientas de asistencia IA Gemini y Copilot para resolver problemas de Phaser y acelerar el proceso de programación.