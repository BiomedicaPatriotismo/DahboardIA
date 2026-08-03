# Plataforma de Gestión de Mantenimiento — Ingenieros Asociados

Dashboard web para la gestión y visualización de servicios de mantenimiento de equipo médico. Consume en tiempo real las órdenes de trabajo capturadas en **Jotform** y volcadas a **Google Sheets**, y las presenta en cuatro niveles: indicadores globales de operación, detalle por unidad hospitalaria (cliente), generación de rutinas de mantenimiento preventivo imprimibles y, desde la versión 2.6, **comunicación y seguimiento de pendientes con cada cliente**, con control de acceso y bitácora de quién entra a la información.

---

## 1. Descripción general

| | |
|---|---|
| **Tipo de aplicación** | Página web estática de un solo archivo (`index.html`) |
| **Backend** | Opcional — Web App de Google Apps Script (`Code.gs`) para bitácora de accesos, sincronización de seguimientos y proxy privado de datos |
| **Origen de datos** | Formulario "Orden de Trabajo" en Jotform → Google Sheets |
| **Dependencias (CDN)** | Tailwind CSS, Chart.js 4.4.1, chartjs-plugin-datalabels 2.2.0, PapaParse 5.4.1 |
| **Requisitos** | Navegador moderno con conexión a internet |

Sin backend configurado, la página funciona exactamente igual que en versiones anteriores: basta con abrir `index.html` en un navegador o alojarlo en cualquier hosting estático (GitHub Pages, Netlify, SharePoint, etc.). El backend de Apps Script agrega las funciones de seguridad y colaboración descritas en la sección 3.

---

## 2. Funcionalidades

### 2.1 Dashboard General (página inicial)

- **KPIs operativos**: Ratio Preventivo, Ratio Correctivo, MTTR promedio, Tasa de Entrega, Tasa de Refacciones y Fallas Críticas, con filtro por mes o vista anual.
- **Oportunidades de venta**: tarjeta clicable que abre el detalle de todas las órdenes cuyo estatus de seguimiento indica "Requiere cotización", con cliente, equipo, ingeniero y motivo.
- **Estatus de equipos**: conteos de equipos en garantía, en contrato, fuera de servicio y a prueba (8 días).
- **Gráficas dinámicas**: carga de trabajo por ingeniero, distribución de tipos de servicio, principales clientes y principales marcas. Todas responden al filtro de mes.

### 2.2 Vista por cliente (barra lateral)

- Barra lateral con todas las unidades hospitalarias detectadas en las órdenes, con **buscador** y diseño colapsable en móvil (botón hamburguesa).
- Cabecera con datos de contacto del cliente (dirección, teléfono y correo se eligen automáticamente tomando el valor más frecuente y completo entre sus órdenes).
- Tarjetas de resumen: total de servicios, conteo de preventivos, conteo de correctivos, ingeniero principal y tipo de servicio más frecuente.

### 2.3 Pestaña Mantenimiento Preventivo / Calibración

- Tabla con: **Orden (ID)**, equipo/marca/modelo, serie/inventario, área, fecha de ejecución y **próximo mantenimiento** calculado.
- Badge rojo **"VENCIDO"** cuando la fecha del próximo mantenimiento ya pasó.
- Ordenamiento automático por próximo mantenimiento (los más urgentes primero).
- **Tres filtros combinables**: búsqueda de texto libre (equipo, serie, orden, área…), mes de ejecución (solo meses con datos) y mes de próximo mantenimiento.
- Contador de registros filtrados, **exportación a CSV** e impresión de la tabla.

### 2.4 Generador de Rutinas de Mantenimiento

Documento imprimible por equipo con folio trazable al ID de la orden:

1. **I. Datos de la Unidad Hospitalaria** — cliente, dirección, teléfono.
2. **II. Datos del Equipo** — equipo, área, marca, modelo, serie, inventario, ingeniero y próximo mantenimiento.
3. **III. Equipo de Calibración / Patrón** — tomado de la orden original.
4. **IV. Check-List de Actividades** — 8 actividades estándar con opciones Aprobado / Rechazado / N/A (sin pre-llenar).
5. **V. Análisis de Valores de Medición** — tabla **editable en pantalla** Parámetro / Programado / Desplegado / Medido / Error (tolerancia ±10 % resaltada en rojo) y **gráfica comparativa** que solo incluye parámetros con valor programado *y* valor real; las lecturas sueltas aparecen únicamente en la tabla. Al editar cualquier celda, la columna Error se recalcula y la gráfica se redibuja automáticamente. Si algún valor difiere del registro original de la orden, aparece una **nota al pie de la sección** indicando que los datos fueron modificados manualmente, con un campo editable para escribir el **motivo de la modificación** (determinado por quien realiza el cambio). La nota solo se muestra —y se imprime— mientras exista alguna diferencia respecto al registro original.
6. **VI. Observaciones** — campo de texto libre editable en pantalla para registrar observaciones acerca del servicio antes de imprimir (si se deja vacío, se imprime el recuadro en blanco para llenado manual).
7. **VII. Autorización** — espacio para firma con la leyenda "AUTORIZO" y campo editable en pantalla para escribir el nombre del responsable autorizado antes de imprimir.

El botón **Imprimir / Guardar PDF** genera el documento completo (todas las páginas, no solo lo visible), oculta la interfaz y convierte las gráficas a imagen para una impresión nítida. Optimizado también para impresión desde dispositivos móviles.

### 2.5 Pestaña Mantenimiento Correctivo / Asistencia

- Tabla de correctivos, asistencias biomédicas y entregas con orden, equipo, marca/modelo, serie, tipo y fecha.
- Filtro por mes de ejecución (solo meses con datos) y contador de registros.

### 2.6 Pestaña Comunicación y Seguimiento (nuevo en v2.6)

Cada unidad hospitalaria tiene ahora una tercera pestaña para dar seguimiento puntual a pendientes con el cliente:

- **Canales de contacto**: alta, edición y baja de contactos del cliente (nombre, cargo, tipo WhatsApp / Teléfono / Email / Otro, número o correo, y notas). Cada canal tiene su acción directa: abrir chat de WhatsApp con mensaje de saludo pre-llenado, llamar (`tel:`) o redactar correo (`mailto:`).
- **Seguimientos de pendientes**: registros de trabajo pendiente —seguimiento a correctivos, cotizaciones, entregas o mantenimientos en ejecución— con:
  - Vinculación opcional a una **orden de trabajo real** del cliente (se selecciona de la lista de sus órdenes y se guarda un resumen del equipo).
  - Tipo, **prioridad** (Alta/Media/Baja) y **estatus** (Abierto, En proceso, Esperando refacción, Esperando al cliente, Cotización enviada, Concluido).
  - **Historial de avances**: cada actualización registra fecha, autor (el usuario identificado en la sesión), nuevo estatus y nota. Los concluidos pueden reabrirse.
  - Botón **"Enviar por WhatsApp"**: arma un mensaje con la unidad, la orden, el asunto, el estatus y el último avance, y lo abre en WhatsApp hacia el canal registrado que se elija (o hacia el selector de contactos si no hay canal). Los números mexicanos de 10 dígitos reciben la lada 52 automáticamente.
  - Contador de pendientes abiertos como **badge en la pestaña**, y filtro Abiertos / Todos / Concluidos.
- **Persistencia y colaboración**: los registros se guardan siempre en el navegador (localStorage). Si el backend de Apps Script está configurado, además se sincronizan a Google Sheets mediante una **cola de cambios con reintentos** (funciona sin conexión y sube los cambios al reconectar); un indicador muestra el estado: *Guardado en este equipo*, *N cambios por enviar*, *Sincronizando…* o *Sincronizado*. La fusión entre dispositivos es "última escritura gana" por registro, y las eliminaciones también se propagan.

> **Ruta de crecimiento a mensajería:** hoy el envío por WhatsApp usa enlaces `wa.me` (no requiere aprobaciones ni costo; el ingeniero revisa y envía desde su propio WhatsApp). El siguiente paso natural, cuando se quiera enviar automáticamente o desde un número institucional, es la **API de WhatsApp Business** (Meta Cloud API o un proveedor como Twilio); el modelo de datos de esta pestaña —canal, seguimiento, historial— ya está pensado para conectarse a ese envío desde Apps Script sin rehacer la interfaz.

### 2.7 Seguridad: control de acceso y bitácora (nuevo en v2.6)

- **Identificación al entrar**: puede exigirse que cada persona escriba su nombre (y opcionalmente un **PIN** compartido) antes de ver el panel. La sesión se recuerda en ese navegador el número de días configurado, y puede cerrarse desde el pie del menú lateral ("Salir").
- **Bitácora de accesos en Google Sheets**: cada ingreso, cada **intento de PIN fallido** (con el nombre que se escribió), y las acciones sensibles (ver un cliente, imprimir rutina o tabla, exportar CSV, abrir WhatsApp, crear/editar seguimientos, refrescar datos) se registran en la pestaña *Bitácora de Accesos* con fecha del servidor y del cliente, usuario, detalle, plataforma, pantalla, zona horaria, página de origen y user-agent.
- **Proxy privado de datos (opcional)**: con `ORIGEN_DATOS = 'appsscript'`, la página descarga las hojas a través del Web App con token, lo que permite **dejar de publicar** los CSV en la web y cerrar el acceso público a la hoja.

**Alcance honesto de esta seguridad.** El control de acceso corre en el navegador: sirve para *identificar y disuadir* (nadie entra sin dejar rastro y sin conocer el PIN), pero no equivale a una autenticación de servidor —una persona con conocimientos técnicos y el archivo HTML podría leer el código. La mejora real de fondo es el proxy con token + despublicar los CSV: con eso los datos dejan de estar en una URL pública. Para necesidades mayores (usuarios y contraseñas individuales), el paso siguiente sería servir la página detrás de un login (p. ej. Google Sites restringido, Cloudflare Access o SharePoint con permisos).

---

## 3. Configuración

Las tres constantes de configuración están al inicio del bloque `<script>` de `index.html`:

```javascript
// Formato de fecha del CSV publicado por Google Sheets.
// 'DMY' = día/mes/año (hoja en español) | 'MDY' = mes/día/año (hoja en inglés/US).
const FORMATO_FECHA = 'DMY';

// Excluir del dashboard las órdenes marcadas como prueba
// (detecta "orden de prueba" en observaciones/detalle).
const EXCLUIR_ORDENES_PRUEBA = true;

// Frecuencia de mantenimiento (en meses) por tipo de equipo.
const FRECUENCIA_DEFAULT = 6;
const FRECUENCIAS_MESES = [
    { clave: 'cama',    meses: 12 },
    { clave: 'camilla', meses: 12 },
    { clave: 'mesa',    meses: 12 }
    // Agrega más reglas según los contratos:
    // { clave: 'ventilador', meses: 4 },
];
```

- **`FORMATO_FECHA`**: solo se usa cuando la fecha es ambigua (día y mes ≤ 12). El parser también acepta seriales de Excel/Sheets y formato ISO (AAAA-MM-DD) automáticamente.
- **`FRECUENCIAS_MESES`**: se busca la palabra clave dentro del nombre del equipo (sin distinguir acentos ni mayúsculas). La primera regla que coincida define los meses; si ninguna coincide se usa `FRECUENCIA_DEFAULT`.

### Configuración v2.6: seguridad y backend

En el mismo bloque `<script>` de `index.html`:

```javascript
// URL del Web App de Apps Script (termina en /exec). Vacío = sin backend.
const URL_APPS_SCRIPT = '';

// Debe coincidir con TOKEN en Code.gs.
const TOKEN_API = '';

// 'csv' = CSV publicados (comportamiento original)
// 'appsscript' = descarga vía Code.gs con token (permite despublicar los CSV)
const ORIGEN_DATOS = 'csv';

// El control de acceso se activa cuando hay PIN definido o hay backend.
// pin: ''      → solo pide nombre (identificación) y lo registra.
// pin: '1234'  → además exige PIN; los intentos fallidos quedan en bitácora.
const CONTROL_ACCESO = { habilitado: true, pin: '', diasSesion: 30 };
```

**Pasos para activar el backend (una sola vez, ~10 minutos):**

1. Abre la hoja de cálculo de Google (la de las órdenes, o una nueva dedicada) → **Extensiones → Apps Script**.
2. Pega el contenido completo de `Code.gs`, cambia `TOKEN` por una cadena larga y, si usarás el proxy de datos, ajusta `HOJA_DASHBOARD` y `HOJA_CORPUS` a los nombres reales de tus pestañas.
3. **Implementar → Nueva implementación → Aplicación web**, con *Ejecutar como: Yo* y *Acceso: Cualquier usuario*. Autoriza los permisos.
4. Copia la URL `…/exec` y pégala en `URL_APPS_SCRIPT` de `index.html`, junto con el mismo token en `TOKEN_API`.
5. Comprueba abriendo en el navegador `…/exec?accion=ping` (debe responder `{"ok":true,…}`).
6. Opcional (recomendado): pon `ORIGEN_DATOS = 'appsscript'`, verifica que el panel siga cargando, y entonces ve a Google Sheets → **Archivo → Compartir → Publicar en la web → Dejar de publicar**. A partir de ahí la hoja ya no es pública.

El script crea solo las pestañas **Bitácora de Accesos**, **Seguimientos** y **Canales** la primera vez que las necesita. Si después modificas `Code.gs`, usa *Administrar implementaciones → editar → Nueva versión* para que la misma URL sirva el código nuevo.

### URLs de origen de datos

También al inicio del script:

```javascript
const csvUrlDashboard = 'https://docs.google.com/spreadsheets/d/e/.../pub?gid=570492353&single=true&output=csv';
const csvUrlCorpus    = 'https://docs.google.com/spreadsheets/d/e/.../pub?gid=680282818&single=true&output=csv';
```

| URL | Contenido |
|---|---|
| `csvUrlDashboard` | Hoja de KPIs mensuales pre-calculados (una fila por mes) |
| `csvUrlCorpus` | Hoja cruda con todas las órdenes de trabajo de Jotform |

Para cambiar de origen: en Google Sheets → **Archivo → Compartir → Publicar en la web** → seleccionar la pestaña → formato CSV → copiar la URL y reemplazarla.

---

## 4. Estructura de datos esperada

### 4.1 Hoja de órdenes (corpus)

Columnas que la aplicación detecta (la búsqueda ignora mayúsculas y acentos, y prioriza coincidencia exacta):

| Dato | Encabezado esperado |
|---|---|
| Folio de la orden | `ID único` |
| Cliente | `UNIDAD:` |
| Contacto | `DOMICILIO:`, `TELÉFONO:`, `EMAIL` |
| Equipo | `EQUIPO:`, `MARCA:`, `MODELO:`, `SERIE:`, `INVENTARIO:`, `ÁREA O UBICACIÓN:` |
| Servicio | `TIPO DE SERVICIO O MANTENIMIENTO`, `FECHA DE INICIO:`, `INGENIERO DE SERVICIO` |
| Seguimiento | `ESTATUS DE SEGUIMIENTO`, `OBSERVACIONES:`, `DETALLE DE FUNCIONALIDAD:` |
| Rutina | `DATOS DEL EQUIPO DE CALIBRACIÓN`, `Valores de Medición` |

**Clasificación por tipo de servicio** (insensible a acentos):

- Pestaña *Preventivos*: contiene "preventivo" o "calibración".
- Pestaña *Correctivos*: contiene "correctivo", "asistencia" o "entrega".

**Formato de mediciones** — para que la sección V de la rutina se genere correctamente, el campo `Valores de Medición` debe seguir el patrón de Jotform:

```
Medicion: SPO2(%), Valor Programado: 85, Valor Desplegado: 85, Valor Medido:
Medicion: Energia, Valor Programado: 30, Valor Desplegado: 30, Valor Medido: 29.5
```

Valores compuestos como `120/80` o `1:2` se muestran en la tabla pero se excluyen de la gráfica. Si el texto no sigue el patrón, se genera una tabla simple de lecturas sin gráfica.

### 4.2 Hoja de KPIs (dashboard)

Una fila por mes con las columnas (en minúsculas): `mes`, `ratio_preventivo`, `ratio_corectivo` (o `ratio_correctivo`), `mttr`, `tasa_entrega`, `tasa_refacciones`, `fallas_criticas`. Los porcentajes pueden llevar el símbolo `%`.

---

## 5. Comportamientos automáticos relevantes

- **Mes de ejecución**: se deriva de `FECHA DE INICIO:`; la hoja no necesita columna "Mes".
- **Series e inventarios**: si Sheets los convirtió a notación científica (`9.09033102E8`) se expanden al número completo; se elimina el `.0` residual.
- **Órdenes de prueba**: filas cuyo texto contiene "orden de prueba" se excluyen de todos los conteos y tablas (desactivable con `EXCLUIR_ORDENES_PRUEBA = false`).
- **Datos de contacto del cliente**: al variar entre órdenes, se toma el valor más frecuente (en empate, el más completo).
- **Caché**: cada carga agrega un parámetro de tiempo a las URLs para traer siempre la versión más reciente publicada (Google puede tardar algunos minutos en refrescar la publicación).
- **Carga tolerante a fallos (v2.6)**: si solo falla la hoja de KPIs mensuales, el panel avisa y sigue funcionando con los indicadores en cero; el error total únicamente aparece cuando no se pueden descargar las órdenes.
- **Botón Actualizar y sello de hora (v2.6)**: el encabezado del dashboard muestra "Datos actualizados: …" y permite volver a descargar sin recargar la página; si estabas viendo un cliente, la vista se conserva.
- **"Vencido" respeta el día en curso (v2.6)**: un mantenimiento que vence hoy ya no se marca en rojo; solo los de fechas pasadas.
- **Atajos (v2.6)**: la tecla `Esc` cierra la rutina y el modal de oportunidades (nunca la pantalla de acceso), y hacer clic fuera del modal de oportunidades también lo cierra.

---

## 6. Recomendaciones de operación

1. **No renombrar los campos del formulario de Jotform** sin actualizar la sección 4.1; la detección de columnas depende de esos encabezados.
2. **Evitar campos duplicados en Jotform** (actualmente existen dos "Firma" y varios "OTRO:"): los encabezados repetidos se sobreescriben entre sí al importar el CSV.
3. **Configurar Serie e Inventario como texto** en Jotform/Sheets para evitar la notación científica de origen.
4. **Confidencialidad**: mientras `ORIGEN_DATOS = 'csv'`, la URL del CSV publicado sigue siendo accesible para cualquiera que la conozca. La ruta recomendada es activar el backend de `Code.gs`, cambiar a `ORIGEN_DATOS = 'appsscript'` y **dejar de publicar** los CSV (pasos en la sección 3). Activa también el PIN de `CONTROL_ACCESO` y revisa periódicamente la pestaña *Bitácora de Accesos*.
5. **Frecuencias de mantenimiento**: revisar `FRECUENCIAS_MESES` contra lo pactado en cada contrato; el valor por omisión es semestral.
6. **Token**: trátalo como una contraseña. Si sospechas que se filtró, cámbialo en `Code.gs` y en `index.html` al mismo tiempo.
7. **Seguimientos compartidos**: si varias personas usan la pestaña de Comunicación, configura el backend; sin él, cada navegador guarda sus propios registros y no se comparten.

---

## 7. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| "Error de Conexión" al abrir | La hoja dejó de estar publicada o cambió la URL | Volver a publicar en la web y actualizar las URLs (o revisar la configuración de Apps Script si `ORIGEN_DATOS = 'appsscript'`) |
| Aviso amarillo "no se pudo descargar la hoja de KPIs" | Solo la pestaña de KPIs falló o cambió de URL/nombre | Revisar la publicación/nombre de esa pestaña; el resto del panel sigue operando |
| Fechas invertidas (día↔mes) | La hoja de Sheets está en configuración regional US | Cambiar `FORMATO_FECHA` a `'MDY'`, o la hoja a español |
| Un cliente aparece duplicado en la barra lateral | Variaciones de escritura en `UNIDAD:` | Unificar el nombre en Jotform (lista desplegable) |
| Una orden no aparece en ninguna pestaña | Su tipo de servicio no contiene ninguna palabra clave de clasificación | Revisar el valor de `TIPO DE SERVICIO O MANTENIMIENTO` |
| La sección V de la rutina sale vacía | El campo `Valores de Medición` está vacío o la columna cambió de nombre | Verificar la orden en Jotform / encabezado de la hoja |
| Los datos no reflejan cambios recientes | Retraso de publicación de Google Sheets | Esperar unos minutos y usar el botón **Actualizar** |
| No aparece la pantalla de identificación | El control de acceso solo se activa con PIN definido o backend configurado | Definir `CONTROL_ACCESO.pin` y/o `URL_APPS_SCRIPT` |
| El seguimiento dice "N cambios por enviar" | Sin conexión, URL de Apps Script incorrecta o token distinto | Hacer clic en el indicador para reintentar; verificar `…/exec?accion=ping` y que `TOKEN_API` = `TOKEN` |
| La bitácora no registra nada | `URL_APPS_SCRIPT` vacío o implementación sin acceso "Cualquier usuario" | Revisar la sección 3 (pasos del backend) y volver a implementar |
| WhatsApp abre sin destinatario | El canal no tiene número válido | Verificar que el número tenga 10 dígitos (o incluya lada internacional) |

---

## 8. Historial de versiones

| Versión | Cambios principales |
|---|---|
| 1.0 | Dashboard, vista por cliente, pestañas preventivo/correctivo, generador de rutinas |
| 2.0 | Corrección de detección de columnas, mes derivado de fecha, parser estructurado de mediciones, normalización de acentos, fechas robustas (seriales/ISO/ambigüedad), exclusión de órdenes de prueba, frecuencias configurables, checklist sin pre-llenar, folio trazable, escape de HTML/CSV, sidebar móvil con buscador, badge de vencidos, KPIs promediados correctamente |
| 2.1 | Gráfica de mediciones solo con valores comparables; eliminación del bloque "Registro Original" |
| 2.2 | Impresión completa de la rutina (multi-página) con interfaz oculta; optimización para móvil |
| 2.3 | Sección VI de Autorización (firma + nombre del responsable) en sustitución de evidencia fotográfica |
| 2.4 | Columna Orden (ID) y filtro por mes de ejecución en la pestaña de preventivos |
| 2.5 | Nueva sección "VI. Observaciones" (texto libre); Autorización pasa a ser VII; tabla de mediciones (sección V) editable con recálculo de Error y gráfica en vivo, y nota al pie con motivo cuando los datos difieren del registro original |
| 2.6 | **Pestaña "Comunicación y Seguimiento" por cliente** (canales de contacto, seguimientos con historial y estatus, envío por WhatsApp, sincronización multi-dispositivo vía Apps Script con cola offline); **control de acceso** (nombre + PIN opcional, sesión con caducidad, cierre de sesión) y **bitácora de accesos y acciones** en Google Sheets; **proxy privado de datos** con token para poder despublicar los CSV; carga tolerante a fallos con aviso no bloqueante; botón Actualizar con sello de hora y conservación de la vista; corrección del cálculo de "Vencido" (hoy no cuenta como vencido); refactor del modal de oportunidades (un solo listener); cierre de modales con `Esc` y clic en el fondo |
