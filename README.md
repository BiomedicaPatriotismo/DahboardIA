📊 Dashboard Operativo de Servicio y Mantenimiento

Este proyecto es un tablero interactivo (Dashboard) desarrollado en HTML, CSS (Tailwind) y JavaScript puro. Se conecta en tiempo real a una base de datos alojada en Google Sheets para visualizar el rendimiento operativo, cargas de trabajo y oportunidades comerciales del departamento de Ingeniería Biomédica / Mantenimiento.

🚀 ¿Cómo funciona?

El dashboard funciona sin necesidad de bases de datos complejas o servidores backend. Extrae la información directamente de dos hojas publicadas en formato CSV desde Google Sheets:

Datos de KPIs: Para mostrar los promedios mensuales consolidados.

Corpus Crudo (Órdenes de Trabajo): Para generar las tablas dinámicas, gráficas y el conteo de estatus de los equipos.

📖 Diccionario de Indicadores

A continuación, se detalla qué significa cada tarjeta y gráfica dentro del Dashboard:

1. Indicadores Clave de Rendimiento (KPIs)

Ratio Preventivo: Porcentaje de atenciones que corresponden a Mantenimientos Preventivos programados. Un valor alto indica una buena planeación.

Ratio Correctivo: Porcentaje de atenciones que fueron Mantenimientos Correctivos (reparaciones no planificadas). Un valor alto puede indicar equipos obsoletos o falta de preventivos.

MTTR Promedio (Mean Time To Repair): Tiempo Medio de Reparación. Mide, en minutos, cuánto tiempo en promedio tarda un ingeniero en diagnosticar y reparar un equipo desde que inicia el servicio.

Tasa de Entrega: Porcentaje de servicios donde el equipo se entrega como "Apto para paciente". Garantiza la efectividad operativa de la atención.

Tasa Refacciones: Porcentaje de las órdenes de trabajo donde fue necesario utilizar refacciones (ya sean proporcionadas por la empresa o por el cliente).

Fallas Críticas: Porcentaje de reportes que se originaron porque el equipo falló mientras estaba conectado a un paciente. Es un indicador clave de riesgo y seguridad.

Oportunidades de Venta: Es un contador inteligente. Revisa todas las órdenes de trabajo y suma únicamente aquellas cuyo Estatus de Seguimiento indica explícitamente "REQUIERE COTIZACIÓN". Al hacer clic en esta tarjeta, se abre el detalle del folio, unidad y los comentarios exactos de por qué requiere cotización.

2. Estatus de Equipos Atendidos

Este bloque lee los comentarios y categorizaciones del estatus de seguimiento para agrupar los equipos en cuatro escenarios:

Equipos en Garantía: Atenciones cubiertas por la garantía original de venta o de una reparación previa.

Equipos en Contrato: Mantenimientos realizados a clientes con pólizas de servicio activo.

Fuera de Servicio: Equipos que, tras la visita del ingeniero, no pudieron ser habilitados para el uso médico por falta de piezas o daño irreparable.

A Prueba (8 Días): Equipos reparados que se dejan bajo estricta observación clínica por 8 días antes de liberarlos definitivamente.

3. Análisis Dinámico (Gráficas)

Carga de Trabajo (Por Ingeniero): Gráfica de barras horizontales que contabiliza el total absoluto de órdenes de servicio ejecutadas por cada ingeniero en el mes seleccionado. Sirve para balancear el trabajo del equipo.

Distribución por Tipo de Servicio: Gráfica de dona (pie) que muestra la proporción de las labores ejecutadas (Ej. Preventivos vs. Calibraciones vs. Cursos de Capacitación).

Principales Clientes: Muestra el "Top" de hospitales o unidades médicas que han requerido más atenciones en el periodo seleccionado.

Principales Marcas: Muestra el "Top" de fabricantes (Ej. Philips, Mindray, Dräger) con mayor volumen de servicio, útil para prever compras de refacciones especializadas.

🛠️ Despliegue en GitHub Pages

Para ver este proyecto en vivo:

Sube el archivo index.html a la rama main de tu repositorio.

Ve a la pestaña Settings (Configuración) de tu repositorio.

En el menú lateral izquierdo, haz clic en Pages.

En la sección "Build and deployment", selecciona la rama main y guarda.

En unos minutos, GitHub te proporcionará un enlace público (ej. https://tu-usuario.github.io/tu-repositorio/) donde podrás ver el dashboard operando en vivo.
