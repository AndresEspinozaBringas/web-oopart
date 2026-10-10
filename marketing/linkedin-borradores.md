# Borradores de LinkedIn — Oopart

Diez posts listos para revisar, editar y programar. A uno por semana son dos
meses y medio de contenido, todo basado en proyectos reales del sitio.

## Cómo usarlos

**Dónde publicar cada uno.** El estudio de Metricool 2026 encuentra que los
posts con enlace externo rinden al revés según el tipo de cuenta: en páginas de
empresa suben (+51% impresiones), en perfiles personales bajan (−27%). Por eso
cada borrador dice dónde va:

- **PERSONAL** — sin enlace, desde tu perfil (10.606 seguidores). Son ideas que
  se sostienen solas; quien quiera más te va a escribir.
- **EMPRESA** — con enlace, desde la página de Oopart. Ahí el enlace no castiga.

Esa evidencia está en disputa y LinkedIn nunca confirmó ninguna penalización.
Después de estos diez posts vas a tener tu propio dato: compara la mediana de
impresiones de los que llevan enlace contra los que no, en tu cuenta.

**Edítalos.** Están escritos con tu material pero con mi redacción. Cámbialos
hasta que suenen a ti: si un cliente que te conoce lee el post y no te reconoce,
el post está mal aunque tenga buenas métricas.

**Prográmalos.** LinkedIn tiene programación nativa y gratuita: escribes el
reloj al lado del botón de publicar. No uses herramientas de automatización de
terceros, violan los términos de servicio y la sanción es perder la cuenta.

**Las tres primeras líneas** son lo único que se ve antes del «ver más». Si no
enganchan ahí, el resto no se lee.

**Antes de publicar el post 10**, confirma las dos cifras del sector salud —la
pérdida de beneficiarios de isapres y las listas de espera—. Están tomadas del
informe de oportunidades, no verificadas en la fuente original, y en LinkedIn
las lee gente del rubro que sí las conoce. Todas las demás cifras de estos
borradores salen de tus propios proyectos y ya están publicadas en el sitio.

---

## 1 · PERSONAL · El tablero incómodo

Cuando construimos el módulo de cumplimiento normativo de una plataforma de
obras, tomamos una decisión que al cliente le pareció rara al principio.

Si una obra no tiene los datos para acreditar una norma, el tablero muestra
«sin datos». No muestra un visto bueno. No muestra un porcentaje estimado. No
rellena el hueco con lo más probable.

La tentación de diseño es la contraria. Un tablero lleno de verde se ve mejor en
una demo, el gerente queda contento y nadie pregunta nada.

El problema aparece en la fiscalización. Ahí la pregunta no es qué dice tu
tablero: es qué evidencia tienes. Y un sistema que te dio tranquilidad durante
seis meses sin respaldo real no te defiende, te deja peor parado.

Un tablero incómodo es más útil que un cumplimiento sin evidencia.

Lo mismo vale para cualquier indicador. Si tu sistema nunca muestra un dato en
blanco, probablemente no está midiendo: está rellenando.

---

## 2 · PERSONAL · Cómo saber que un proceso necesita revisión

La señal más clara de que un proceso está pidiendo arreglo no es que falle.

Es que solo una persona sepa hacerlo.

Un proceso que falla se nota: alguien reclama, salta un error, se cae un número.
Ese se arregla porque duele. El peligroso es el otro: el que funciona bien,
todos los meses, sin un solo reclamo, porque Marcela sabe hacerlo.

Marcela lleva ocho años ahí. Conoce las excepciones, sabe a quién llamar cuando
el archivo viene mal y tiene una planilla propia que nadie más entiende. Todo
marcha.

Hasta que Marcela se toma vacaciones y el área se detiene dos semanas.

Ese conocimiento no está escrito en ninguna parte. No es culpa de ella — nadie
se lo pidió. Pero mientras siga en una sola cabeza, es un riesgo operacional
que no aparece en ningún informe.

Cuando reviso procesos en una empresa, esa es la primera pregunta que hago. No
«¿qué se cae?», sino «¿qué pasa si esta persona no viene mañana?».

Las respuestas incómodas suelen venir rápido.

---

## 3 · PERSONAL · Automatizar antes de entender

Automatizar un proceso malo no lo mejora. Consigue que falle más rápido y a
mayor escala.

Parece obvio escrito así, pero es el error más caro y más común que veo. Llega
una empresa con un proceso que demora tres semanas y la conversación arranca en
qué herramienta usar. Nunca en por qué demora tres semanas.

Y casi siempre, cuando uno levanta el proceso de verdad, aparece que de los
catorce pasos hay cuatro que existen para corregir errores de un paso anterior,
dos que nadie recuerda por qué se hacen y uno que se agregó hace seis años para
un cliente que ya no está.

Si automatizas eso, acabas de construir una máquina muy eficiente para hacer
trabajo innecesario.

El orden importa más que las etapas: primero entender cómo funciona realmente,
después decidir qué automatizar. Saltarse el levantamiento para llegar antes a
la tecnología es lo que convierte un proyecto de tres meses en uno de un año.

---

## 4 · PERSONAL · El número que manda en telemedicina

En un proyecto de telemonitoreo de pacientes crónicos medimos cuatro
indicadores. Tres eran de costo. El que importaba era el cuarto: 43% de
adopción.

La lógica del negocio es simple de contar y difícil de resolver. Se entregan
dispositivos al domicilio del paciente para que midan signos vitales y envíen
los datos al equipo clínico. El hardware es caro, se deteriora y se pierde.

Pero el problema de fondo no es el costo del equipo. Es que si el paciente no
incorpora el dispositivo a su rutina, el equipo no se usa, los datos no llegan y
el control médico se vuelve intermitente justo donde la continuidad importa.

Un dispositivo que el paciente no usa no mide nada. Y uno que no mide nada
cuesta exactamente lo mismo que uno que sí.

Por eso la decisión técnica fue apoyarse en el teléfono que el paciente ya tiene
y ya cuida, en vez de sumar otro aparato. El 43% de adopción explica buena parte
de los otros tres números.

En salud digital, la métrica de adopción no es un indicador blando. Es el que
determina si los demás existen.

---

## 5 · PERSONAL · Tres días para arrepentirse

En una isapre, cerrar la venta de un plan tomaba tres días.

No por lentitud de nadie. El proceso era en papel: recoger antecedentes,
declarar situación de salud, firmar el contrato, dejarlo en custodia. Cada paso
en su formulario, el expediente yendo y viniendo entre el ejecutivo y el back
office, los faltantes apareciendo después.

La conversación con el cliente arrancó por los errores documentales, que era lo
que más molestaba internamente. Pero el número que terminó importando fue otro.

En un negocio donde el cliente compara alternativas, tres días entre la decisión
y la firma son tres días para arrepentirse. O para que alguien más le ofrezca
algo mejor.

Cuando digitalizamos el proceso completo —firma electrónica, validación médica
en línea, integración entre front y back office— el cierre pasó de tres días a
treinta minutos.

Los errores documentales bajaron 85% y los fraudes 63%. Son buenos números.

Pero el que cambió el negocio fue el tiempo: el plan ahora se cierra mientras el
cliente todavía está decidido.

A veces el problema que te contratan a resolver no es el que más vale resolver.

---

## 6 · PERSONAL · El espacio entre los sistemas

Cuando una empresa me dice que necesita un sistema nuevo, la primera pregunta
que hago es qué hace hoy la gente entre un sistema y otro.

La respuesta casi siempre es la misma: copiar.

Alguien exporta de un sistema, pega en una planilla, revisa, corrige formatos y
carga en el siguiente. Todos los días. A veces varias veces al día. Nadie lo
llama proceso porque no está escrito en ninguna parte, pero consume más horas
que cualquier tarea que sí aparece en el organigrama.

En los clientes con los que he trabajado, lo que frena la operación casi nunca es
la falta de un sistema. Es el espacio entre los sistemas: lo que alguien tiene
que mover a mano de una pantalla a otra porque nadie conectó las dos.

Y ese espacio es mucho más barato de resolver que comprar software nuevo. No
exige migrar datos, ni capacitar a nadie en una herramienta distinta, ni parar la
operación.

Un proyecto de integración bien hecho ni siquiera se nota: la gente sigue usando
las mismas pantallas y simplemente deja de tener que copiar cosas entre ellas.

Antes de evaluar un sistema nuevo, vale la pena contar cuántas horas al mes se
van en ese espacio. El número suele sorprender.

---

## 7 · EMPRESA · Caso Humphreys

De 30 días a 5 en una clasificadora de riesgo.

Una clasificadora vive de emitir juicios fundados sobre la solvencia de empresas
e instrumentos. Ese juicio se construye sobre estados financieros, memorias y
antecedentes que llegan en formatos distintos, de fuentes distintas y en momentos
distintos.

En Humphreys ese trabajo era 100% manual. Un analista descargaba los documentos,
transcribía las cifras a planilla, las normalizaba para que fueran comparables y
recién entonces empezaba el análisis propiamente tal.

El costo no era solo el tiempo. Cada transcripción manual es una oportunidad de
error, y un error en una cifra base se arrastra en silencio hasta el informe
final.

Automatizamos la cadena completa desde el documento fuente hasta el informe
emitido, respetando los criterios de análisis que el equipo ya tenía.

El punto no fue reemplazar el criterio del analista, que es justamente lo que una
clasificadora vende. Fue sacarle de encima el trabajo mecánico para que ese
criterio se aplique sobre datos confiables y a tiempo.

Resultado: 83% menos tiempo de proceso, 90% menos errores y 14% de aumento en
ventas, porque con el ciclo más corto el equipo atiende más casos con la misma
dotación.

El caso completo: https://oopart.cl/casos/humphreys/

---

## 8 · EMPRESA · Caso BuildTrack

Una obra mediana en Chile mueve cientos de millones de pesos y se controla con
Excel. Funciona hasta que deja de funcionar.

Grupo S3L tenía el cuadro completo: estados de pago que se pasaban del plazo de
30 días que fija la Ley 21.131 —con intereses y mérito ejecutivo de por medio—,
libro de obras en papel con anotaciones dispersas, y trazabilidad que no resistía
una fiscalización.

El mercado tampoco ofrecía salida cómoda. Las plataformas globales son caras, se
cobran en dólares y están construidas sobre normativas que no son la chilena.
Excel quedaba chico y lo que seguía quedaba grande.

Construimos BuildTrack desde cero sobre la normativa chilena, no adaptada
después: estados de pago que cuentan los plazos de la Ley 21.131, libro de obras
digital con anotaciones foliadas y validez legal, curva S de avance con valor
ganado, checklist DS76 por subcontratista que bloquea el finiquito si falta
documentación.

Hoy opera con más de 30 obras activas, más de 1.200 estados de pago procesados y
cero multas por Ley 21.131.

Dejó de ser un proyecto interno para convertirse en producto.

El caso completo: https://oopart.cl/casos/buildtrack/

---

## 9 · EMPRESA · Ley 21.719

La postergación de la Ley 21.719 mueve el calendario. No reduce las exigencias.

Conviene separar esas dos cosas, porque se confunden seguido. Quien use este
tiempo para prepararse llega listo. Quien lo tome como una prórroga va a
enfrentar el mismo trabajo con menos margen y con multas de hasta 20.000 UTM
sobre la mesa.

Y hay algo que cuesta más de asumir: la ley no pide políticas, pide evidencia
operativa.

Publicar una política de privacidad en el sitio no acredita nada. Lo que se
exige es poder demostrar, sobre los sistemas reales, qué datos personales tienes,
dónde están, con qué base legal los tratas, quién accede a ellos, cómo respondes
cuando un titular pide su eliminación y qué haces las primeras horas después de
una brecha.

Eso no se resuelve con un documento. Se resuelve con inventario de datos,
registros de tratamiento, gestión de derechos de los titulares y protocolos que
funcionen cuando alguien los ejecute de verdad.

Escribimos una guía de lo que cambia específicamente en los sistemas, sin
asesoría legal de por medio, desde el lado técnico:

https://oopart.cl/proteccion-datos-personales/

---

## 10 · EMPRESA · Salud privada

El sistema privado de salud atiende hoy a menos personas y con menos margen que
hace cinco años.

Entre 2020 y 2025 las isapres perdieron más de 800 mil beneficiarios. Al mismo
tiempo, las listas de espera quirúrgica del sistema público superaron las 400 mil
personas, y parte de esa demanda termina buscando atención en el sector privado.

Más gente que atender, menos holgura para hacerlo. Esa combinación cambia dónde
está el problema.

Ya no se trata de comprar un sistema mejor. Se trata de que el dinero que ya se
facturó efectivamente se cobre, que el paciente que ya llegó no se pierda entre
dos agendas, y que la información que ya existe no haya que volver a digitarla en
otro sistema.

Hemos trabajado en el sector: una plataforma de suscripción electrónica para una
isapre, que pasó de tres días a treinta minutos, y una app de telemonitoreo
conectada a dispositivos médicos domiciliarios.

Reunimos en una sola página cómo abordamos los cuatro procesos donde se pierde
más dinero en un prestador: ciclo de ingresos, reembolsos, coordinación
asistencial e integración entre sistemas.

https://oopart.cl/salud/
