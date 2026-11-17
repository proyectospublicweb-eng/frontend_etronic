export const PLANNER_SERVICES = [
  {
    id: "work-management",
    order: 1,
    name: "Gestión de Trabajo y Proyectos (Work Management)",
    shortName: "Gestión de Trabajo y Proyectos (Work Management)",
    tooltipTitle: "Gestión de Trabajo y Proyectos (Work Management)",
    tooltipDescription:
      "Es un espacio centralizado para planificar, asignar y dar seguimiento en tiempo real a todas las tareas y procesos operativos de la empresa.",
    subtitle:
      "Selecciona los procesos y funcionalidades que necesitas para estructurar tableros, vistas, carga operativa, estrategia, colaboración y automatizaciones.",
    processes: [
      {
        id: "wm-planning",
        number: "1",
        title: "Planificación y Gestión de Proyectos",
        previewImage: "/images/planner-wm-1-planning.jpg",
        previewAlt:
          "Ejemplo visual de tablero de planificación estilo monday.com con grupos, estados, subtareas, dependencias e hitos",
        previewCaption:
          "Tableros organizados por fases con columnas de responsables, estados cromáticos, subtareas, dependencias e hitos.",
        tasks: [
          {
            id: "wm-structured-boards",
            title: "Tableros de trabajo estructurados",
            description:
              "Organización de proyectos por grupos, fases o departamentos con columnas personalizadas (estados, fechas, responsables, prioridades y presupuestos).",
          },
          {
            id: "wm-subtasks-checklists",
            title: "Subtareas y listas de verificación (Checklists)",
            description:
              "División de tareas grandes en pasos pequeños con responsables y fechas límite independientes.",
          },
          {
            id: "wm-dependencies",
            title: "Dependencias entre tareas",
            description:
              "Configuración de reglas donde una tarea no puede iniciar o finalizar hasta que otra previa se haya completado, ajustando fechas automáticamente si hay retrasos.",
          },
          {
            id: "wm-milestones",
            title: "Hitos del proyecto (Milestones)",
            description:
              "Marcadores visuales clave para identificar fechas críticas de entrega o aprobación.",
          },
          {
            id: "wm-templates",
            title: "Plantillas de proyectos",
            description:
              "Creación de estructuras predefinidas para procesos repetitivos (ej. lanzamiento de producto, onboarding de clientes) que se duplican con un clic.",
          },
        ],
      },
      {
        id: "wm-views",
        number: "2",
        title: "Visualización del Trabajo (Vistas)",
        previewImage: "/images/planner-wm-2-views.jpg",
        previewAlt:
          "Ejemplo visual de vistas Kanban, Gantt, Cronograma y Calendario estilo monday.com",
        previewCaption:
          "Vistas dinámicas de un mismo tablero: Tabla principal, tarjetas Kanban arrastrables, Gantt, Cronograma y Calendario.",
        tasks: [
          {
            id: "wm-table-view",
            title: "Vista de Tabla principal",
            description:
              "Formato tipo hoja de cálculo interactiva para edición rápida y lectura detallada.",
          },
          {
            id: "wm-kanban",
            title: "Tablero Kanban",
            description:
              "Visualización en tarjetas arrastrables por columnas de estado (ej. Pendiente, En proceso, En revisión, Listo).",
          },
          {
            id: "wm-gantt",
            title: "Diagrama de Gantt",
            description:
              "Línea de tiempo visual que muestra la duración de las tareas, sus dependencias y la ruta crítica del proyecto.",
          },
          {
            id: "wm-timeline",
            title: "Cronograma (Timeline)",
            description:
              "Vista de barras horizontales enfocada en la distribución de fechas por persona o equipo.",
          },
          {
            id: "wm-calendar",
            title: "Vista de Calendario",
            description: "Organización de entregas y eventos por día, semana o mes.",
          },
        ],
      },
      {
        id: "wm-resources",
        number: "3",
        title: "Gestión de Recursos y Carga de Trabajo",
        previewImage: "/images/planner-wm-3-resources.jpg",
        previewAlt:
          "Ejemplo visual de carga de trabajo semanal por persona y control de tiempo estilo monday.com",
        previewCaption:
          "Matriz visual de carga operativa por integrante, alertas de sobrecarga y cronómetro integrado de tiempo real vs. estimado.",
        tasks: [
          {
            id: "wm-workload",
            title: "Vista de Carga de Trabajo (Workload)",
            description:
              "Panel visual que muestra cuántas horas o tareas tiene asignadas cada miembro del equipo para detectar sobrecargas o disponibilidad.",
          },
          {
            id: "wm-time-tracking",
            title: "Control de tiempo (Time Tracking)",
            description:
              "Cronómetro integrado en cada tarea para medir cuánto tiempo real invierte el equipo en ejecutarla vs. el tiempo estimado.",
          },
          {
            id: "wm-capacity",
            title: "Gestión de capacidad",
            description:
              "Asignación de esfuerzo estimado (en horas o puntos) por tarea para equilibrar el trabajo entre áreas.",
          },
        ],
      },
      {
        id: "wm-portfolio",
        number: "4",
        title: "Gestión de Portafolios y Estrategia (Nivel Gerencial)",
        previewImage: "/images/planner-wm-4-portfolio.jpg",
        previewAlt:
          "Ejemplo visual de dashboard ejecutivo con KPIs, OKRs, gráficos y control presupuestal estilo monday.com",
        previewCaption:
          "Panel ejecutivo consolidado con avance de OKRs, comparativa de presupuesto vs. gasto real y gráficos por portafolio.",
        tasks: [
          {
            id: "wm-dashboards",
            title: "Paneles de control (Dashboards)",
            description:
              "Consolidación de datos de múltiples proyectos en gráficos de barras, pasteles, contadores y métricas en tiempo real.",
          },
          {
            id: "wm-okrs",
            title: "Seguimiento de objetivos (OKRs)",
            description:
              "Alineación de los proyectos diarios con las metas estratégicas trimestrales o anuales de la empresa.",
          },
          {
            id: "wm-budgets",
            title: "Control de presupuestos y costos",
            description:
              "Columnas de fórmulas para calcular gastos reales frente al presupuesto asignado por proyecto o departamento.",
          },
        ],
      },
      {
        id: "wm-collaboration",
        number: "5",
        title: "Colaboración y Comunicación Interna",
        previewImage: "/images/planner-wm-5-collaboration.jpg",
        previewAlt:
          "Ejemplo visual de hilos de conversación, anotaciones en archivos, documentos colaborativos y formularios estilo monday.com",
        previewCaption:
          "Comunicación contextual por tarea con @menciones, anotaciones sobre archivos, Docs colaborativos y WorkForms de solicitud.",
        tasks: [
          {
            id: "wm-threads",
            title: "Hilos de conversación por tarea",
            description:
              "Comentarios contextuales dentro de cada ítem con menciones (@usuario) para evitar cadenas largas de correos o mensajes perdidos en chats.",
          },
          {
            id: "wm-files-proofing",
            title: "Gestión de archivos y pruebas",
            description:
              "Carga de documentos, imágenes o PDFs directamente en la tarea, con opción de dejar anotaciones visuales sobre archivos para pedir cambios.",
          },
          {
            id: "wm-docs",
            title: "Documentos colaborativos (Docs)",
            description:
              "Espacio integrado tipo editor de texto (similar a Notion o Google Docs) vinculado a los tableros para minutas, briefs o documentación interna.",
          },
          {
            id: "wm-workforms",
            title: "Formularios de solicitud (WorkForms)",
            description:
              "Formularios web internos o externos donde los usuarios envían peticiones y estas se convierten automáticamente en tareas dentro de un tablero.",
          },
        ],
      },
      {
        id: "wm-automation",
        number: "6",
        title: "Automatización y Permisos",
        previewImage: "/images/planner-wm-6-automation.jpg",
        previewAlt:
          "Ejemplo visual de centro de automatizaciones sin código y matriz de permisos por rol estilo monday.com",
        previewCaption:
          "Reglas automáticas de estado/vencimiento sin código y control granular de permisos por tablero, columna o rol.",
        tasks: [
          {
            id: "wm-rules",
            title: "Reglas de automatización",
            description:
              'Disparadores automáticos (ej. "Cuando el estado cambie a Aprobado, notificar al gerente y mover la tarea al grupo de Ejecución").',
          },
          {
            id: "wm-reminders",
            title: "Recordatorios y alertas de vencimiento",
            description:
              "Notificaciones automáticas antes o después de que venza la fecha límite de una tarea.",
          },
          {
            id: "wm-permissions",
            title: "Control de permisos y roles",
            description:
              "Restricción de acceso por tablero, por columna o por fila (ej. ocultar columnas de costos a ciertos perfiles o permitir solo lectura a directivos).",
          },
        ],
      },
    ],
  },
  {
    id: "crm-service",
    order: 2,
    name: "Ventas y Atención al Cliente (CRM y Service)",
    shortName: "Ventas y Atención al Cliente (CRM y Service)",
    tooltipTitle: "Ventas y Atención al Cliente (CRM y Service)",
    tooltipDescription:
      "Centraliza la captación de prospectos, embudos comerciales y seguimiento de clientes junto con mesa de ayuda, tickets, SLA y soporte posventa en una sola plataforma.",
    subtitle:
      "Selecciona los módulos comerciales (CRM) y de soporte técnico (Service) para gestionar prospectos, oportunidades, tickets y calidad de atención.",
    processes: [
      {
        id: "crm-leads",
        group: "Parte A: Gestión Comercial y Ventas (monday CRM)",
        number: "A1",
        title: "Captación y Gestión de Prospectos (Leads)",
        previewImage: "/images/planner-crm-a1-leads.jpg",
        previewAlt:
          "Ejemplo visual de tablero de prospectos estilo monday CRM con captura web, calificación, asignación automática y detección de duplicados",
        previewCaption:
          "Tablero centralizado de leads con origen multicanal, calificación por temperatura, asignación a vendedores y alertas de duplicados.",
        tasks: [
          {
            id: "crm-lead-capture",
            title: "Captura automática de leads",
            description:
              "Formularios web o integraciones que envían prospectos directamente al tablero comercial sin captura manual.",
          },
          {
            id: "crm-lead-scoring",
            title: "Calificación y asignación",
            description:
              "Reglas para clasificar prospectos (frío, tibio, caliente) y asignarlos automáticamente a un vendedor según zona, producto o carga de trabajo.",
          },
          {
            id: "crm-duplicates",
            title: "Detección de duplicados",
            description:
              "Alertas o bloqueos cuando se intenta registrar un cliente o empresa que ya existe en la base de datos.",
          },
        ],
      },
      {
        id: "crm-pipeline",
        group: "Parte A: Gestión Comercial y Ventas (monday CRM)",
        number: "A2",
        title: "Embudo de Ventas (Sales Pipeline)",
        previewImage: "/images/planner-crm-a2-pipeline.jpg",
        previewAlt:
          "Ejemplo visual de embudo Kanban comercial estilo monday CRM con montos, probabilidad de cierre y motivos de pérdida",
        previewCaption:
          "Pipeline visual por etapas comerciales con cálculo de pronóstico, probabilidad de cierre y registro de motivos de pérdida.",
        tasks: [
          {
            id: "crm-opportunity-board",
            title: "Tablero visual de oportunidades",
            description:
              "Seguimiento del ciclo comercial por etapas (ej. Nuevo, Contactado, Cotización enviada, Negociación, Ganado/Perdido).",
          },
          {
            id: "crm-forecast",
            title: "Cálculo de valor y pronóstico",
            description:
              "Columnas para registrar el monto de cada negociación, probabilidad de cierre y proyección de ingresos mensuales o trimestrales.",
          },
          {
            id: "crm-loss-reasons",
            title: "Registro de motivos de pérdida",
            description:
              'Catálogo desplegable obligatorio cuando una venta se marca como "Perdida" para analizar por qué no se cerró.',
          },
        ],
      },
      {
        id: "crm-accounts",
        group: "Parte A: Gestión Comercial y Ventas (monday CRM)",
        number: "A3",
        title: "Gestión de Cuentas, Contactos y Actividad",
        previewImage: "/images/planner-crm-a3-accounts.jpg",
        previewAlt:
          "Ejemplo visual de ficha 360 de cuenta, contactos vinculados, historial cronológico, correos sincronizados y cotizaciones PDF estilo monday CRM",
        previewCaption:
          "Ficha 360° de empresa con contactos vinculados, bitácora unificada de llamadas/correos con rastreo y cotizaciones PDF.",
        tasks: [
          {
            id: "crm-directory",
            title: "Directorio centralizado (Empresas y Contactos)",
            description:
              "Relación vinculada entre una empresa cliente y los múltiples contactos o tomadores de decisión dentro de ella.",
          },
          {
            id: "crm-interactions",
            title: "Historial cronológico de interacciones",
            description:
              "Bitácora unificada donde quedan registradas llamadas, reuniones, notas y correos vinculados a cada cliente.",
          },
          {
            id: "crm-email-sync",
            title: "Sincronización de correo electrónico",
            description:
              "Envío y recepción de correos desde la ficha del cliente con plantillas predefinidas y rastreo de apertura.",
          },
          {
            id: "crm-quotes-invoices",
            title: "Generación de cotizaciones y facturas básicas",
            description:
              "Creación de documentos comerciales en PDF tomando directamente los datos y productos cargados en el tablero.",
          },
        ],
      },
      {
        id: "crm-post-sale",
        group: "Parte A: Gestión Comercial y Ventas (monday CRM)",
        number: "A4",
        title: "Posventa y Analítica Comercial",
        previewImage: "/images/planner-crm-a4-postsale.jpg",
        previewAlt:
          "Ejemplo visual de transición automática venta a operación y analítica comercial estilo monday CRM",
        previewCaption:
          "Automatización de venta ganada a proyecto operativo junto con embudos de conversión y cumplimiento de metas por vendedor.",
        tasks: [
          {
            id: "crm-sales-to-ops",
            title: "Transición de Venta a Operación",
            description:
              'Automatización que crea un proyecto o ficha de entrega en el área operativa en cuanto una venta cambia a "Ganada".',
          },
          {
            id: "crm-sales-analytics",
            title: "Paneles de rendimiento comercial",
            description:
              "Gráficos de metas por vendedor, tasa de conversión por etapa y tiempo promedio de cierre.",
          },
        ],
      },
      {
        id: "svc-tickets",
        group: "Parte B: Soporte Técnico y Atención al Cliente (monday service)",
        number: "B1",
        title: "Recepción y Creación de Tickets",
        previewImage: "/images/planner-svc-b1-tickets.jpg",
        previewAlt:
          "Ejemplo visual de portal de autoservicio, formularios de incidencias y conversión de correos a tickets estilo monday service",
        previewCaption:
          "Portal web de autoservicio, formularios con adjuntos y bandeja compartida que convierte correos en tickets numerados.",
        tasks: [
          {
            id: "svc-self-portal",
            title: "Portal de autoservicio",
            description:
              "Interfaz web donde clientes o empleados internos levantan solicitudes, consultan el estatus de sus tickets y revisan artículos de ayuda.",
          },
          {
            id: "svc-email-to-ticket",
            title: "Conversión de correos a tickets",
            description:
              "Bandeja de entrada compartida (ej. soporte@empresa.com) que transforma cada correo recibido en un ticket numerado.",
          },
          {
            id: "svc-incident-forms",
            title: "Formularios de incidencias",
            description:
              "Formularios estructurados que obligan al usuario a detallar categoría, urgencia y adjuntar capturas de pantalla antes de enviar.",
          },
        ],
      },
      {
        id: "svc-routing-sla",
        group: "Parte B: Soporte Técnico y Atención al Cliente (monday service)",
        number: "B2",
        title: "Clasificación, Enrutamiento y SLA",
        previewImage: "/images/planner-svc-b2-routing.jpg",
        previewAlt:
          "Ejemplo visual de clasificación por impacto, enrutamiento inteligente a agentes y temporizadores SLA estilo monday service",
        previewCaption:
          "Etiquetado por categoría e impacto, asignación automática a especialistas y temporizadores SLA con alertas preventivas.",
        tasks: [
          {
            id: "svc-prioritization",
            title: "Priorización y categorización",
            description:
              "Etiquetado de tickets por tipo de falla (ej. Facturación, Técnico, Garantía) y nivel de impacto (Bajo, Medio, Crítico).",
          },
          {
            id: "svc-smart-assignment",
            title: "Asignación inteligente a agentes",
            description:
              "Distribución automática de tickets al especialista adecuado según la categoría del problema o disponibilidad del equipo.",
          },
          {
            id: "svc-sla-control",
            title: "Control de Acuerdos de Nivel de Servicio (SLA)",
            description:
              "Temporizadores que miden el tiempo máximo de primera respuesta y de resolución, enviando alertas antes de que el tiempo venza.",
          },
        ],
      },
      {
        id: "svc-resolution",
        group: "Parte B: Soporte Técnico y Atención al Cliente (monday service)",
        number: "B3",
        title: "Resolución y Gestión del Conocimiento",
        previewImage: "/images/planner-svc-b3-resolution.jpg",
        previewAlt:
          "Ejemplo visual de flujo de estados del ticket, respuestas rápidas macros y base de conocimiento estilo monday service",
        previewCaption:
          "Flujo guiado de estatus del ticket, respuestas rápidas (macros) y artículos integrados de base de conocimiento.",
        tasks: [
          {
            id: "svc-status-flow",
            title: "Flujo de estados del ticket",
            description:
              "Seguimiento claro desde la apertura hasta el cierre (ej. Abierto, En diagnóstico, Esperando respuesta del cliente, Resuelto, Cerrado).",
          },
          {
            id: "svc-canned-macros",
            title: "Respuestas enlatadas (Macros)",
            description:
              "Plantillas de respuesta rápida para resolver dudas frecuentes en segundos.",
          },
          {
            id: "svc-knowledge-base",
            title: "Base de conocimiento interna y externa",
            description:
              "Repositorio de manuales y soluciones frecuentes para que los agentes respondan más rápido o los usuarios resuelvan dudas por sí mismos.",
          },
        ],
      },
      {
        id: "svc-quality",
        group: "Parte B: Soporte Técnico y Atención al Cliente (monday service)",
        number: "B4",
        title: "Calidad y Métricas de Servicio",
        previewImage: "/images/planner-svc-b4-quality.jpg",
        previewAlt:
          "Ejemplo visual de encuestas de satisfacción CSAT y reportes de soporte técnico estilo monday service",
        previewCaption:
          "Medición automática de satisfacción CSAT, volumen diario de tickets, tiempos de solución y desempeño por agente.",
        tasks: [
          {
            id: "svc-csat",
            title: "Encuestas de satisfacción (CSAT)",
            description:
              "Envío automático de una encuesta breve al cerrar un ticket para calificar la atención recibida.",
          },
          {
            id: "svc-reports",
            title: "Reportes de soporte",
            description:
              "Métricas de volumen de tickets por día, tiempos promedio de solución, incidencias más recurrentes y desempeño por agente.",
          },
        ],
      },
    ],
  },
  {
    id: "dashboards-admin",
    order: 3,
    name: "Paneles de Control y Administración (Dashboards y Ajustes)",
    shortName: "Paneles de Control y Administración (Dashboards y Ajustes)",
    tooltipTitle: "Paneles de Control y Administración (Dashboards y Ajustes)",
    tooltipDescription:
      "Consolida métricas ejecutivas en tableros visuales, filtros en tiempo real y reportes programados junto con gestión de usuarios, roles, privacidad, marca blanca y auditoría.",
    subtitle:
      "Selecciona los widgets analíticos (Dashboards) y controles de seguridad, privacidad, marca blanca y respaldos (Ajustes) para gobernar toda la plataforma.",
    processes: [
      {
        id: "dash-widgets",
        group: "Parte A: Paneles de Control y Analítica (Dashboards)",
        number: "A1",
        title: "Widgets de Visualización y Métricas",
        previewImage: "/images/planner-dash-a1-widgets.jpg",
        previewAlt:
          "Ejemplo visual de widgets analíticos estilo monday Dashboards con gráficos, tarjetas KPI, batería de progreso y tabla consolidada",
        previewCaption:
          "Gráficos comparativos, contadores KPI, barra de batería segmentada por avance y tabla consolidada de prioridades.",
        tasks: [
          {
            id: "dash-charts",
            title: "Gráficos estadísticos",
            description:
              "Gráficos de barras, líneas y áreas para comparar estados, categorías o evolución de datos a lo largo del tiempo.",
          },
          {
            id: "dash-kpi-cards",
            title: "Tarjetas de indicadores clave (KPI / Números)",
            description:
              "Contadores grandes que muestran sumas, promedios, totales de presupuesto o cantidad de tareas críticas en un vistazo.",
          },
          {
            id: "dash-battery",
            title: "Widget de Batería (Progreso visual)",
            description:
              "Barra segmentada por colores que refleja el porcentaje de avance global de uno o varios proyectos.",
          },
          {
            id: "dash-exec-table",
            title: "Tabla consolidada (Resumen ejecutivo)",
            description:
              "Vista filtrada que agrupa únicamente las tareas vencidas, urgentes o de alta prioridad de distintos departamentos en una sola lista.",
          },
        ],
      },
      {
        id: "dash-consolidation",
        group: "Parte A: Paneles de Control y Analítica (Dashboards)",
        number: "A2",
        title: "Consolidación y Filtros Dinámicos",
        previewImage: "/images/planner-dash-a2-consolidation.jpg",
        previewAlt:
          "Ejemplo visual de conexión multitablero, filtros interactivos en tiempo real y metas vs resultados estilo monday Dashboards",
        previewCaption:
          "Unificación de múltiples tableros con filtros dinámicos en tiempo real y comparativa visual de metas frente a resultados.",
        tasks: [
          {
            id: "dash-multi-board",
            title: "Conexión multitablero",
            description:
              "Capacidad de alimentar un mismo dashboard con información proveniente de distintos módulos (ej. cruzar ventas ganadas del CRM con proyectos activos de operaciones).",
          },
          {
            id: "dash-realtime-filters",
            title: "Filtros interactivos en tiempo real",
            description:
              "Selectores por fecha, responsable, departamento o estado para que los directivos exploren los datos sin alterar los tableros originales.",
          },
          {
            id: "dash-goals-vs-results",
            title: "Seguimiento de metas vs. resultados",
            description:
              "Comparativas visuales entre los objetivos planteados y el avance real del equipo.",
          },
        ],
      },
      {
        id: "dash-export",
        group: "Parte A: Paneles de Control y Analítica (Dashboards)",
        number: "A3",
        title: "Exportación y Distribución de Reportes",
        previewImage: "/images/planner-dash-a3-export.jpg",
        previewAlt:
          "Ejemplo visual de exportación a PDF y Excel, envío programado por correo y enlaces de solo lectura estilo monday Dashboards",
        previewCaption:
          "Descarga directa a PDF/Excel, envío automático programado a dirección y enlaces compartibles de solo lectura.",
        tasks: [
          {
            id: "dash-pdf-excel",
            title: "Exportación a PDF y Excel",
            description:
              "Descarga directa de gráficos o tablas completas para presentaciones gerenciales.",
          },
          {
            id: "dash-scheduled-email",
            title: "Envío programado por correo",
            description:
              "Automatización que envía una captura o resumen del dashboard cada lunes por la mañana a la dirección general.",
          },
          {
            id: "dash-readonly-links",
            title: "Enlaces compartibles de solo lectura",
            description:
              "URLs protegidas para mostrar avances en pantallas de oficina o a socios externos sin darles acceso al sistema.",
          },
        ],
      },
      {
        id: "adm-users-roles",
        group: "Parte B: Ajustes, Seguridad y Gobernanza del Sistema",
        number: "B1",
        title: "Gestión de Usuarios, Equipos y Roles",
        previewImage: "/images/planner-adm-b1-users.jpg",
        previewAlt:
          "Ejemplo visual de directorio de usuarios, roles del sistema, SSO corporativo y autenticación 2FA estilo monday.com",
        previewCaption:
          "Directorio por departamentos, perfiles de rol, inicio único SSO con Google/Microsoft 365 y seguridad 2FA.",
        tasks: [
          {
            id: "adm-user-directory",
            title: "Directorio de usuarios y jerarquías",
            description:
              "Alta, baja y suspensión de empleados, organizados por departamentos o sucursales.",
          },
          {
            id: "adm-system-roles",
            title: "Roles del sistema",
            description:
              "Perfiles predefinidos con distintos niveles de alcance (ej. Administrador total, Miembro editor, Lector/Invitado).",
          },
          {
            id: "adm-sso",
            title: "Autenticación corporativa (SSO)",
            description:
              "Inicio de sesión único usando las cuentas actuales de Google Workspace o Microsoft 365 de la empresa.",
          },
          {
            id: "adm-2fa",
            title: "Seguridad de acceso",
            description: "Políticas de contraseñas seguras y autenticación en dos pasos (2FA).",
          },
        ],
      },
      {
        id: "adm-permissions",
        group: "Parte B: Ajustes, Seguridad y Gobernanza del Sistema",
        number: "B2",
        title: "Permisos Granulares (Control de Privacidad)",
        previewImage: "/images/planner-adm-b2-permissions.jpg",
        previewAlt:
          "Ejemplo visual de espacios de trabajo públicos, privados y compartibles con permisos por columna y por fila estilo monday.com",
        previewCaption:
          "Tableros públicos, privados o compartibles con bloqueo de columnas sensibles y edición restringida por fila asignada.",
        tasks: [
          {
            id: "adm-workspace-types",
            title: "Tipos de espacios de trabajo",
            description:
              "Clasificación de tableros en Públicos (visibles para toda la empresa), Privados (solo por invitación) o Compartibles (para proveedores o clientes puntuales).",
          },
          {
            id: "adm-column-perms",
            title: "Permisos a nivel de columna",
            description:
              "Restricción para ocultar o bloquear columnas sensibles (ej. salarios, márgenes de ganancia o precios) a ciertos roles.",
          },
          {
            id: "adm-row-perms",
            title: "Permisos de edición por fila",
            description:
              "Regla para que un usuario solo pueda editar las tareas o clientes que tiene asignados, evitando modificaciones accidentales en el trabajo de otros.",
          },
        ],
      },
      {
        id: "adm-branding",
        group: "Parte B: Ajustes, Seguridad y Gobernanza del Sistema",
        number: "B3",
        title: "Personalización y Marca Blanca (Branding)",
        previewImage: "/images/planner-adm-b3-branding.jpg",
        previewAlt:
          "Ejemplo visual de personalización de logotipo, paleta corporativa, dominio propio y catálogos maestros estilo monday.com",
        previewCaption:
          "Identidad visual con logotipo, colores corporativos y dominio propio junto con catálogos maestros centralizados.",
        tasks: [
          {
            id: "adm-visual-identity",
            title: "Identidad visual de la empresa",
            description:
              "Configuración de logotipo, paleta de colores corporativos y dominio propio (ej. https://tuempresa.com).",
          },
          {
            id: "adm-master-catalogs",
            title: "Catálogos maestros",
            description:
              "Administración centralizada de listas desplegables compartidas (ej. listas de sucursales, tipos de servicio o monedas) para mantener los datos estandarizados.",
          },
        ],
      },
      {
        id: "adm-audit-backups",
        group: "Parte B: Ajustes, Seguridad y Gobernanza del Sistema",
        number: "B4",
        title: "Auditoría, Respaldos y Mantenimiento",
        previewImage: "/images/planner-adm-b4-audit.jpg",
        previewAlt:
          "Ejemplo visual de registro de auditoría, papelera de reciclaje y respaldos automatizados estilo monday.com",
        previewCaption:
          "Bitácora detallada de cambios, papelera para restaurar elementos eliminados y copias de seguridad automáticas.",
        tasks: [
          {
            id: "adm-audit-log",
            title: "Registro de actividad (Audit Log)",
            description:
              "Historial detallado de quién creó, editó o eliminó un registro, con fecha y hora exacta.",
          },
          {
            id: "adm-recycle-bin",
            title: "Papelera de reciclaje y restauración",
            description:
              "Recuperación de tareas, columnas o tableros eliminados por error dentro de un periodo de gracia.",
          },
          {
            id: "adm-automated-backups",
            title: "Respaldos automatizados",
            description:
              "Copias de seguridad periódicas de la base de datos y archivos adjuntos con opción de descarga.",
          },
        ],
      },
    ],
  },
];
