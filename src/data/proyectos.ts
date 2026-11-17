// Fuente única del portafolio. Hero, índice y conteo de stack se calculan desde aquí.
// Regla: sin nombres de empresas, clientes, personas, archivos internos ni cifras privadas.

export type Area = 'Documentos' | 'Datos y Excel' | 'Apps internas' | 'IA y producto';
export type Estado = 'Desplegado' | 'En uso' | 'Construido' | 'En desarrollo' | 'Académico' | 'Propuesta';
// Cada paso del flujo es "icono:texto". Iconos: xls doc pdf form mail db gear scan chart web video ai users check tree file phone folder

export interface Caso {
  problema: string;
  solucion: string;
  decisiones: string[];
  datos: { valor: string; etiqueta: string }[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  area: Area;
  estado: Estado;
  resumen: string;
  stack: string[];
  flujo: [string, string, string];
  url?: string;
  caso?: Caso;
}

export const proyectos: Proyecto[] = [
  {
    id: 'bases-personal',
    nombre: 'Suite de bases de personal',
    area: 'Datos y Excel',
    estado: 'Construido',
    resumen: 'App de escritorio que genera más de 15 bases de RR. HH. desde una sola matriz de personal.',
    stack: ['Python', 'CustomTkinter', 'Excel'],
    flujo: ['xls:Matriz de personal', 'tree:Jerarquía y reglas', 'db:15+ bases de salida'],
    caso: {
      problema:
        'Cada proceso de RR. HH. necesita su propia base: préstamos, asignaciones, citas, licencias. Todas nacen de la misma matriz de personal y se preparaban por separado.',
      solucion:
        'Una aplicación de escritorio lee la matriz y genera cada base con sus reglas. Un módulo adicional compara dos matrices para identificar los ceses entre periodos.',
      decisiones: [
        'Recorrí la jerarquía organizacional con BFS para resolver las dependencias entre áreas.',
        'Apliqué filtros por nivel organizacional y mapeo de códigos dentro de la lógica de cada base.',
        'Una versión anterior ya cruzaba 6 fuentes de entrada para producir 11 archivos.',
      ],
      datos: [
        { valor: '15+', etiqueta: 'bases generadas' },
        { valor: '2', etiqueta: 'matrices comparadas' },
      ],
    },
  },
  {
    id: 'contratos-cartas',
    nombre: 'Automatizador de contratos y cartas',
    area: 'Documentos',
    estado: 'En uso',
    resumen: 'Genera contratos y cartas en DOCX y PDF desde Excel y plantillas, con acceso por usuario.',
    stack: ['Python', 'Tkinter', 'docxtpl', 'Word COM', 'PyMuPDF', 'Excel', 'Outlook', 'PyInstaller'],
    flujo: ['xls:Excel y plantillas', 'doc:Llenado con docxtpl', 'pdf:DOCX, PDF y correo'],
    caso: {
      problema:
        'Los contratos y cartas se redactaban uno por uno. Copiar datos entre Excel y Word consume tiempo y abre la puerta a errores en documentos sensibles.',
      solucion:
        'Una aplicación toma cada fila de Excel, llena la plantilla que corresponde, inserta logo y firma, exporta a PDF y permite el envío opcional por Outlook. Se distribuye como ejecutable.',
      decisiones: [
        'Exporté a PDF con Word COM y resolví el error de archivo corrupto.',
        'Separé en una hoja de consulta los datos por empresa, como RUC y representantes.',
        'Pasé de openpyxl a win32com en la plantilla .xlsm para no dañar las macros.',
        'Añadí acceso por código y DNI, y reglas condicionales de fiscalización.',
      ],
      datos: [
        { valor: '2', etiqueta: 'formatos de salida' },
        { valor: '1', etiqueta: 'ejecutable sin instalar Python' },
      ],
    },
  },
  {
    id: 'muestreo',
    nombre: 'Plataforma de auditoría por muestreo',
    area: 'Apps internas',
    estado: 'En desarrollo',
    resumen: 'Audita legajos con muestras aleatorias, control de accesos y cálculo de conformidad.',
    stack: ['Power Apps', 'Power Fx', 'Power Automate', 'Office Scripts', 'Apps Script', 'Excel'],
    flujo: ['xls:Matriz de ingresos', 'check:Muestra y revisión', 'chart:Conformidad y exportación'],
    caso: {
      problema:
        'Auditar legajos exige sacar una muestra por empresa y periodo, revisar cada documento y calcular la conformidad. El proceso necesita trazabilidad de quién revisó y cuándo.',
      solucion:
        'La plataforma genera la muestra, permite editar y guarda en Excel con registro de auditor y fecha. Nació como web app en Apps Script y está migrando a Power Apps con la misma lógica.',
      decisiones: [
        'Centralicé login, periodos, carga, generación, guardado y dashboard en un solo flujo con Office Script.',
        'Moví el procesamiento a Office Scripts para superar el límite de 2000 filas de Power Apps.',
        'Guardo solo las filas modificadas para reducir el tiempo de escritura.',
        'La opción NA excluye un documento del cálculo de conformidad.',
      ],
      datos: [
        { valor: '2000+', etiqueta: 'filas de datos' },
        { valor: '6', etiqueta: 'acciones en un flujo' },
      ],
    },
  },
  {
    id: 'incentivos',
    nombre: 'Suite de incentivos comerciales',
    area: 'Datos y Excel',
    estado: 'Construido',
    resumen: 'Tres apps conectadas calculan avance, reparto por gerente y resumen de incentivos.',
    stack: ['Python', 'CustomTkinter', 'openpyxl', 'JSON', 'Excel'],
    flujo: ['xls:Ventas y objetivos', 'gear:Escalas por canasta', 'chart:Reparto por gerente'],
    caso: {
      problema:
        'Los incentivos dependen de archivos de ventas con formatos distintos, celdas combinadas y enlaces externos. Una mala escritura corrompe el libro de destino.',
      solucion:
        'Tres aplicaciones cubren el avance contra objetivos, el reparto por gerente y el resumen final. Detectan el formato de cada archivo y consolidan los resultados en un libro con formato.',
      decisiones: [
        'Evité la corrupción de archivos con keep_links=False y un manejo explícito de celdas combinadas.',
        'Guardé en JSON un sistema de alias para reconocer nombres variables entre archivos.',
        'La asignación admite trabajadores con varios gerentes separados por punto y coma.',
      ],
      datos: [
        { valor: '3', etiqueta: 'apps conectadas' },
        { valor: 'JSON', etiqueta: 'alias persistentes' },
      ],
    },
  },
  {
    id: 'validador-ocr',
    nombre: 'Validador OCR de declaraciones',
    area: 'Documentos',
    estado: 'Construido',
    resumen: 'Lee escaneos, identifica el DNI, lo valida contra Excel y separa cada declaración.',
    stack: ['Python', 'CustomTkinter', 'OCR', 'PDF', 'Excel'],
    flujo: ['scan:PDF escaneado', 'ai:OCR y validación', 'pdf:Un PDF por persona'],
    caso: {
      problema:
        'Un solo PDF escaneado puede traer las declaraciones de muchas personas. Hay que separarlas, identificar a cada una y confirmar que exista en la base.',
      solucion:
        'La herramienta divide el PDF por página, lee el número de documento con OCR y lo valida contra Excel. Cada salida es un PDF con el DNI como nombre.',
      decisiones: [
        'Lo que no se puede confirmar sale como OBSERVADO con numeración correlativa, para revisión humana.',
        'La salida se conserva en PDF, nunca como imagen suelta.',
      ],
      datos: [
        { valor: '1:1', etiqueta: 'página por declaración' },
        { valor: '2', etiqueta: 'resultados: validado u observado' },
      ],
    },
  },
  {
    id: 'invita',
    nombre: 'Invita+ Studio',
    area: 'IA y producto',
    estado: 'Desplegado',
    resumen: 'Plataforma propia de invitaciones digitales, desplegada y abierta al público. Soy su fundador.',
    stack: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Supabase', 'Three.js', 'Cloudflare'],
    flujo: ['form:Formulario del organizador', 'phone:Plantilla y escena 3D', 'web:Página pública por evento'],
    url: 'https://invitaplus.pages.dev/',
    caso: {
      problema:
        'Una invitación digital suele ser una imagen estática, sin confirmación de asistencia ni datos para quien organiza el evento.',
      solucion:
        'Fundé y desplegué Invita+ Studio: panel de creación, asistente de IA para textos, vista previa en vivo y páginas públicas con confirmación, ubicación, música y libro de visitas.',
      decisiones: [
        'Empecé como servicio manual para validar la demanda antes de construir un SaaS completo.',
        'Cada temática 3D carga de forma diferida y tiene alternativa sin WebGL o con movimiento reducido.',
        'Cada invitación genera su propia vista previa Open Graph para compartir por enlace.',
        'Despliegue estático en Cloudflare Pages, con multimedia en Supabase Storage.',
      ],
      datos: [
        { valor: '5', etiqueta: 'temáticas de evento' },
        { valor: 'En línea', etiqueta: 'invitaplus.pages.dev' },
      ],
    },
  },  {
    id: 'anomalias',
    nombre: 'Detección de anomalías en video',
    area: 'IA y producto',
    estado: 'Académico',
    resumen: 'Tesis de Deep Learning para detectar eventos anómalos en secuencias de videovigilancia.',
    stack: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
    flujo: ['video:Secuencias de video', 'ai:CNN, PCA y GRU', 'chart:Puntaje de anomalía'],
    caso: {
      problema:
        'Revisar horas de video de vigilancia a mano no escala. La tesis explora si un modelo puede señalar los eventos anómalos dentro de las secuencias.',
      solucion:
        'Procesé video en secuencias y frames, entrené un clasificador CNN y combiné PCA con GRU para el análisis temporal.',
      decisiones: [
        'Usé datasets de referencia, UCSD y UCF-Crime, para que la evaluación sea comparable.',
        'Validé con K-Fold cross-validation para reducir el sesgo de una sola partición.',
      ],
      datos: [
        { valor: '2', etiqueta: 'datasets de referencia' },
        { valor: 'K-Fold', etiqueta: 'método de validación' },
      ],
    },
  },


  // Documentos
  { id: 'cartas-salariales', nombre: 'Cartas de ajuste salarial', area: 'Documentos', estado: 'En uso', resumen: 'Genera cartas por empresa desde Excel, con mapeo de columnas fijo y dinámico.', stack: ['Python', 'pandas', 'openpyxl', 'win32com', 'CustomTkinter', 'PyInstaller'], flujo: ['xls:Excel por empresa', 'gear:Mapeo de columnas', 'doc:Carta por trabajador'] },
  { id: 'cartas-promocion', nombre: 'Cartas de promoción', area: 'Documentos', estado: 'Construido', resumen: 'Llena plantillas de Word con Jinja2 y resuelve el formato decimal de los montos.', stack: ['Python', 'Jinja2', 'Word', 'PyInstaller'], flujo: ['xls:Datos de promoción', 'gear:Plantilla Jinja2', 'doc:Cartas en Word'] },
  { id: 'declaraciones', nombre: 'Declaraciones juradas en lote', area: 'Documentos', estado: 'Construido', resumen: 'Procesó 369 filas en una sola sesión de Word y exportó cada declaración a PDF.', stack: ['Python', 'python-docx', 'docx2pdf', 'Excel'], flujo: ['xls:369 filas de datos', 'doc:Plantilla Word', 'pdf:PDF por declaración'] },
  { id: 'funciones-puesto', nombre: 'Generador de funciones por puesto', area: 'Documentos', estado: 'Construido', resumen: 'Convierte descriptivos de puesto en Excel a Word y PDF para estandarizar la documentación.', stack: ['Python', 'CustomTkinter', 'Word', 'Excel'], flujo: ['xls:Descriptivo del puesto', 'gear:Formato estándar', 'doc:Word y PDF por puesto'] },
  { id: 'polizas', nombre: 'Consolidador de reportes de póliza', area: 'Documentos', estado: 'Construido', resumen: 'Une tablas repetidas en cientos de hojas de PDF bajo un solo encabezado y exporta el resultado.', stack: ['Apps Script', 'Python', 'PDF'], flujo: ['pdf:Cientos de hojas', 'gear:Encabezado único', 'xls:Tabla consolidada'] },
  { id: 'ocr-manuscrito', nombre: 'OCR de formularios manuscritos', area: 'Documentos', estado: 'Construido', resumen: 'Extrae datos de escaneos y los valida con coincidencia difusa contra una lista de personal.', stack: ['Python', 'EasyOCR', 'OCR', 'PDF'], flujo: ['scan:Formularios manuscritos', 'ai:OCR y coincidencia difusa', 'check:Datos validados'] },
  { id: 'renombrado', nombre: 'Renombrado masivo de archivos', area: 'Documentos', estado: 'Construido', resumen: 'Renombra archivos en lote a partir de un Excel, desde una interfaz gráfica.', stack: ['Python', 'Tkinter', 'Excel'], flujo: ['xls:Lista de nombres', 'folder:Archivos en carpeta', 'file:Archivos renombrados'] },
  { id: 'buscador-archivos', nombre: 'Buscador y copiador de archivos', area: 'Documentos', estado: 'Construido', resumen: 'Ubica archivos y los copia a otra carpeta desde una interfaz gráfica.', stack: ['Python', 'Tkinter'], flujo: ['folder:Carpetas de origen', 'gear:Búsqueda por criterio', 'folder:Copias en destino'] },
  { id: 'word-node', nombre: 'Generadores de documentos técnicos', area: 'Documentos', estado: 'Construido', resumen: 'Produce formularios y documentación técnica en Word con formato profesional.', stack: ['Node.js', 'Word'], flujo: ['form:Contenido del formulario', 'gear:Node.js y docx', 'doc:Documento técnico'] },
  { id: 'correo-masivo', nombre: 'Campañas de correo personalizado', area: 'Documentos', estado: 'Construido', resumen: 'Envía correos desde Outlook con adjuntos múltiples e imágenes en línea.', stack: ['VBA', 'Outlook', 'Excel'], flujo: ['xls:Lista de destinatarios', 'gear:Plantilla con imágenes', 'mail:Correos personalizados'] },

  // Datos y Excel
  { id: 'talento-matriz', nombre: 'Transferencia de datos de talento', area: 'Datos y Excel', estado: 'En uso', resumen: 'Consolida datos de personal y alimenta matrices sin copiar registros a mano.', stack: ['VBA', 'Excel'], flujo: ['xls:Hoja de origen', 'gear:Macro VBA', 'xls:Matriz actualizada'] },
  { id: 'reporte-cursos', nombre: 'Reporte de cursos', area: 'Datos y Excel', estado: 'En uso', resumen: 'Calcula totales y avance buscando columnas por nombre, así admite cursos nuevos.', stack: ['VBA', 'Excel'], flujo: ['xls:Cursos por empresa', 'gear:Columnas por nombre', 'chart:Avance por persona'] },
  { id: 'calculo-ventas', nombre: 'Cálculo y reportes de ventas', area: 'Datos y Excel', estado: 'En uso', resumen: 'Procesa la información comercial y actualiza las hojas de resumen.', stack: ['VBA', 'Excel'], flujo: ['xls:Datos comerciales', 'gear:Cálculo en VBA', 'chart:Hojas de resumen'] },
  { id: 'asistencia-dni', nombre: 'Cruce de asistencia por DNI', area: 'Datos y Excel', estado: 'En uso', resumen: 'Normaliza identificadores, conserva ceros a la izquierda y cruza contra la base de personal.', stack: ['Apps Script', 'Google Sheets'], flujo: ['xls:Marcas de asistencia', 'check:DNI normalizado', 'db:Cruce con personal'] },
  { id: 'base-talento', nombre: 'Base de talento unificada', area: 'Datos y Excel', estado: 'Construido', resumen: 'Integra procesos de RR. HH. en una herramienta que genera una base de 41 columnas.', stack: ['Python', 'Excel'], flujo: ['xls:Fuentes de RR. HH.', 'gear:Suite unificada', 'db:Base de 41 columnas'] },
  { id: 'consolidacion-ventas', nombre: 'Consolidación multifuente de ventas', area: 'Datos y Excel', estado: 'Construido', resumen: 'Lee archivos de varias fuentes con prioridad configurable y agrega los resultados.', stack: ['Python', 'CustomTkinter', 'openpyxl', 'JSON'], flujo: ['xls:Archivos multifuente', 'gear:Prioridad y alias', 'xls:Libro consolidado'] },
  { id: 'divisor-excel', nombre: 'Divisor de Excel', area: 'Datos y Excel', estado: 'Construido', resumen: 'Separa libros grandes desde una interfaz empaquetada como ejecutable de Windows.', stack: ['Python', 'Tkinter', 'PyInstaller', 'Excel'], flujo: ['xls:Libro grande', 'gear:Criterio de división', 'xls:Libros separados'] },
  { id: 'asistencia-torniquetes', nombre: 'Asistencia y horas extra', area: 'Datos y Excel', estado: 'En desarrollo', resumen: 'Infiere pares de entrada y salida, incluidos los turnos que cruzan la medianoche.', stack: ['VBA', 'Excel'], flujo: ['scan:Marcas de torniquete', 'gear:Pares entrada y salida', 'chart:Horas extra'] },
  { id: 'avicola', nombre: 'Reportes para empresa avícola', area: 'Datos y Excel', estado: 'Propuesta', resumen: 'Propuesta de registro de ventas, dashboard gerencial y reporte diario por correo.', stack: ['Apps Script', 'Google Sheets'], flujo: ['form:Registro de ventas', 'db:Google Sheets', 'mail:Reporte diario'] },

  // Apps internas
  { id: 'activacion', nombre: 'Activación de procesos de RR. HH.', area: 'Apps internas', estado: 'En uso', resumen: 'Web app para activar procesos, administrar accesos y gestionar matrices.', stack: ['Apps Script', 'Google Sheets'], flujo: ['form:Solicitud', 'users:Accesos y matrices', 'check:Proceso activado'] },
  { id: 'ficha-datos', nombre: 'Ficha de datos de personal', area: 'Apps internas', estado: 'En uso', resumen: 'Registra y valida la información de los trabajadores.', stack: ['Apps Script', 'Google Sheets'], flujo: ['form:Ficha web', 'check:Validación de datos', 'db:Registro en Sheets'] },
  { id: 'onboarding', nombre: 'Portal de onboarding documental', area: 'Apps internas', estado: 'Construido', resumen: 'Ingreso con DNI, carga de documentos por etapas e indicadores de progreso.', stack: ['Apps Script', 'Google Sheets', 'Google Drive'], flujo: ['users:Ingreso con DNI', 'folder:Carga por etapas', 'chart:Progreso del legajo'] },
  { id: 'beneficios', nombre: 'Entrega de beneficios', area: 'Apps internas', estado: 'Construido', resumen: 'Controla entregas de canastas y bandejas por categoría, con un registro de 22 columnas.', stack: ['Apps Script', 'Google Sheets'], flujo: ['users:Trabajador', 'check:Categoría y canasta', 'db:Entrega registrada'] },
  { id: 'fotochecks', nombre: 'Entrega de fotochecks', area: 'Apps internas', estado: 'Construido', resumen: 'Registro web con lector de código de barras y protección contra envíos duplicados.', stack: ['Apps Script', 'Google Sheets'], flujo: ['scan:Código de barras', 'check:Control de duplicados', 'db:Entrega registrada'] },
  { id: 'dashboards', nombre: 'Dashboards de talento', area: 'Apps internas', estado: 'Construido', resumen: 'Web app con filtros de selección múltiple y detalle por plan de desarrollo.', stack: ['Apps Script', 'Google Sheets'], flujo: ['db:Datos en Sheets', 'gear:Filtros múltiples', 'chart:Detalle por plan'] },
  { id: 'calculadora', nombre: 'Calculadora de beneficios laborales', area: 'Apps internas', estado: 'Construido', resumen: 'Aplica reglas por rangos de meses y montos por años de servicio.', stack: ['Apps Script'], flujo: ['form:Meses de servicio', 'gear:Reglas por rango', 'chart:Monto del beneficio'] },
  { id: 'votacion', nombre: 'Votación electrónica', area: 'Apps internas', estado: 'Construido', resumen: 'Sistema para la elección de un comité interno, con documentación técnica completa.', stack: ['Apps Script', 'Google Sheets'], flujo: ['users:Votante validado', 'form:Voto único', 'chart:Resultados'] },
  { id: 'gratificacion', nombre: 'Formulario de gratificación', area: 'Apps internas', estado: 'Construido', resumen: 'Migrado a Power Apps, con envío de correos desde un flujo.', stack: ['Power Apps', 'Power Automate'], flujo: ['form:Formulario Power Apps', 'gear:Flujo Power Automate', 'mail:Correo enviado'] },
  { id: 'asertividad', nombre: 'Encuesta de asertividad', area: 'Apps internas', estado: 'Construido', resumen: 'Sistema de puntuación automática de respuestas.', stack: ['Microsoft Forms', 'Excel'], flujo: ['form:Microsoft Forms', 'gear:Puntuación automática', 'chart:Resultado en Excel'] },
  { id: 'lideres', nombre: 'Reconocimiento de líderes', area: 'Apps internas', estado: 'En desarrollo', resumen: 'Votación Top 5 con validación por DNI, voto único y reportes.', stack: ['Power Apps', 'Power Fx', 'Power Automate', 'Office Scripts', 'Excel'], flujo: ['users:Búsqueda por DNI', 'form:Votación Top 5', 'chart:Podio y reportes'] },

  // IA
  { id: 'estado-arte', nombre: 'API de estado del arte', area: 'IA y producto', estado: 'Académico', resumen: 'Procesa documentos PDF y genera contenido con modelos de IA.', stack: ['Python', 'Flask', 'OpenAI API', 'PDF'], flujo: ['pdf:Artículos en PDF', 'ai:Modelo de IA', 'doc:Estado del arte'] },
];

export const casos = proyectos.filter((p) => p.caso);
export const areas: Area[] = ['Documentos', 'Datos y Excel', 'Apps internas', 'IA y producto'];
export const estados: Estado[] = ['Desplegado', 'En uso', 'Construido', 'En desarrollo', 'Académico', 'Propuesta'];

const clave = ['Python', 'Excel', 'Apps Script', 'Google Sheets', 'VBA', 'Power Apps', 'Power Automate', 'Office Scripts', 'CustomTkinter', 'Tkinter', 'openpyxl', 'PyInstaller', 'OCR', 'React', 'TypeScript'];
export const stackConteo = clave
  .map((nombre) => ({ nombre, n: proyectos.filter((p) => p.stack.includes(nombre)).length }))
  .sort((a, b) => b.n - a.n);
