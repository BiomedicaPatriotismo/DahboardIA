# Plataforma de Gestión de Mantenimiento — Ingenieros Asociados

Dashboard web para la gestión y visualización de servicios de mantenimiento de equipo médico. Consume en tiempo real las órdenes de trabajo capturadas en **Jotform** y volcadas a **Google Sheets**, y las presenta en tres niveles: indicadores globales de operación, detalle por unidad hospitalaria (cliente) y generación de rutinas de mantenimiento preventivo imprimibles.

---

## 1. Descripción general

| | |
|---|---|
| **Tipo de aplicación** | Página web estática de un solo archivo (`index.html`) |
| **Backend** | Ninguno — lee CSV publicados de Google Sheets |
| **Origen de datos** | Formulario "Orden de Trabajo" en Jotform → Google Sheets |
| **Dependencias (CDN)** | Tailwind CSS, Chart.js 4.4.1, chartjs-plugin-datalabels 2.2.0, PapaParse 5.4.1 |
| **Requisitos** | Navegador moderno con conexión a internet |

No requiere instalación, servidor ni base de datos. Basta con abrir `index.html` en un navegador o alojarlo en cualquier hosting estático (GitHub Pages, Netlify, SharePoint, etc.).

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
5. **V. Análisis de Valores de Medición** — tabla Parámetro / Programado / Desplegado / Medido / Error (tolerancia ±10 % resaltada en rojo) y **gráfica comparativa** que solo incluye parámetros con valor programado *y* valor real; las lecturas sueltas aparecen únicamente en la tabla.
6. **VI. Autorización** — espacio para firma con la leyenda "AUTORIZO" y campo editable en pantalla para escribir el nombre del responsable autorizado antes de imprimir.

El botón **Imprimir / Guardar PDF** genera el documento completo (todas las páginas, no solo lo visible), oculta la interfaz y convierte las gráficas a imagen para una impresión nítida. Optimizado también para impresión desde dispositivos móviles.

### 2.5 Pestaña Mantenimiento Correctivo / Asistencia

- Tabla de correctivos, asistencias biomédicas y entregas con orden, equipo, marca/modelo, serie, tipo y fecha.
- Filtro por mes de ejecución (solo meses con datos) y contador de registros.

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

---

## 6. Recomendaciones de operación

1. **No renombrar los campos del formulario de Jotform** sin actualizar la sección 4.1; la detección de columnas depende de esos encabezados.
2. **Evitar campos duplicados en Jotform** (actualmente existen dos "Firma" y varios "OTRO:"): los encabezados repetidos se sobreescriben entre sí al importar el CSV.
3. **Configurar Serie e Inventario como texto** en Jotform/Sheets para evitar la notación científica de origen.
4. **Confidencialidad**: la URL del CSV publicado es accesible para cualquiera que la conozca e incluye datos de contacto de clientes. Para un despliegue formal se recomienda restringir el acceso (por ejemplo, un endpoint de Apps Script con token) o al menos limitar la distribución del archivo.
5. **Frecuencias de mantenimiento**: revisar `FRECUENCIAS_MESES` contra lo pactado en cada contrato; el valor por omisión es semestral.

---

## 7. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| "Error de Conexión" al abrir | La hoja dejó de estar publicada o cambió la URL | Volver a publicar en la web y actualizar las URLs |
| Fechas invertidas (día↔mes) | La hoja de Sheets está en configuración regional US | Cambiar `FORMATO_FECHA` a `'MDY'`, o la hoja a español |
| Un cliente aparece duplicado en la barra lateral | Variaciones de escritura en `UNIDAD:` | Unificar el nombre en Jotform (lista desplegable) |
| Una orden no aparece en ninguna pestaña | Su tipo de servicio no contiene ninguna palabra clave de clasificación | Revisar el valor de `TIPO DE SERVICIO O MANTENIMIENTO` |
| La sección V de la rutina sale vacía | El campo `Valores de Medición` está vacío o la columna cambió de nombre | Verificar la orden en Jotform / encabezado de la hoja |
| Los datos no reflejan cambios recientes | Retraso de publicación de Google Sheets | Esperar unos minutos y recargar |

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
