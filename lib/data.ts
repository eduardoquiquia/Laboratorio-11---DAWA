export const CATEGORIES = ["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"]
export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"]
export const TASK_STATUSES = ["Pendiente", "En progreso", "Completado"]
export const ROLES = ["Administrador", "Líder", "Miembro"]

export type Project = {
  id: string
  name: string
  description: string
  category: string
  priority: string
}

export type Member = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string // "" = sin proyecto
  isActive: boolean
}

export type Task = {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string // "" = sin asignar
  dateline: string
}

export type Settings = {
  workspaceName: string
  adminName: string
  adminEmail: string
  language: string
  pageSize: string
  emailNotifications: boolean
  darkMode: boolean
}

export type Activity = {
  id: number
  user: string
  action: string
  target: string
  time: string
}

export const seedProjects: Project[] = [
  { id: "P1", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "Desarrollo Web", priority: "Alta" },
  { id: "P2", name: "Mobile App", description: "Aplicación móvil con React Native", category: "Desarrollo Mobile", priority: "Media" },
  { id: "P3", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "Desarrollo Web", priority: "Media" },
  { id: "P4", name: "API Gateway", description: "Microservicios con Node.js", category: "Desarrollo Web", priority: "Urgente" },
  { id: "P5", name: "Design System", description: "Librería de componentes reutilizables", category: "Diseño", priority: "Baja" },
  { id: "P6", name: "Marketing Website", description: "Sitio web institucional", category: "Marketing", priority: "Baja" },
]

export const seedMembers: Member[] = [
  { userId: "U1", role: "Miembro", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1996-03-14", phone: "987654321", projectId: "P1", isActive: true },
  { userId: "U2", role: "Miembro", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1993-07-02", phone: "912345678", projectId: "P1", isActive: true },
  { userId: "U3", role: "Miembro", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1998-11-23", phone: "956781234", projectId: "P5", isActive: false },
  { userId: "U4", role: "Líder", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1990-01-30", phone: "934567812", projectId: "P4", isActive: true },
  { userId: "U5", role: "Administrador", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1988-05-09", phone: "978123456", projectId: "P3", isActive: true },
  { userId: "U6", role: "Miembro", name: "Diego Torres", email: "diego@example.com", position: "Mobile Developer", birthdate: "1997-09-17", phone: "945678123", projectId: "P2", isActive: true },
  { userId: "U7", role: "Miembro", name: "Sofía Ramos", email: "sofia@example.com", position: "Content Manager", birthdate: "1995-12-05", phone: "923456781", projectId: "P6", isActive: true },
]

export const seedTasks: Task[] = [
  { id: "T1", description: "Implementar autenticación", projectId: "P1", status: "En progreso", priority: "Alta", userId: "U1", dateline: "2026-11-15" },
  { id: "T2", description: "Diseñar pantalla de perfil", projectId: "P2", status: "Pendiente", priority: "Media", userId: "U6", dateline: "2026-11-20" },
  { id: "T3", description: "Configurar CI/CD", projectId: "P4", status: "Completado", priority: "Alta", userId: "U4", dateline: "2026-10-10" },
  { id: "T4", description: "Optimizar queries SQL", projectId: "P1", status: "En progreso", priority: "Urgente", userId: "U2", dateline: "2026-11-12" },
  { id: "T5", description: "Documentar API endpoints", projectId: "P4", status: "Pendiente", priority: "Baja", userId: "U4", dateline: "2026-11-25" },
  { id: "T6", description: "Integrar pasarela de pagos", projectId: "P1", status: "Completado", priority: "Alta", userId: "U2", dateline: "2026-10-20" },
  { id: "T7", description: "Publicar componentes base", projectId: "P5", status: "Completado", priority: "Media", userId: "U3", dateline: "2026-10-05" },
  { id: "T8", description: "Definir métricas principales", projectId: "P3", status: "Pendiente", priority: "Media", userId: "U5", dateline: "2026-11-18" },
  { id: "T9", description: "Redactar página de inicio", projectId: "P6", status: "Completado", priority: "Baja", userId: "U7", dateline: "2026-10-22" },
  { id: "T10", description: "Optimizar SEO del sitio", projectId: "P6", status: "En progreso", priority: "Media", userId: "U7", dateline: "2026-11-08" },
  { id: "T11", description: "Agregar notificaciones push", projectId: "P2", status: "Completado", priority: "Alta", userId: "U6", dateline: "2026-10-28" },
  { id: "T12", description: "Configurar rate limiting", projectId: "P4", status: "En progreso", priority: "Alta", userId: "U4", dateline: "2026-11-10" },
]

export const seedSettings: Settings = {
  workspaceName: "Dashboard de Proyectos",
  adminName: "Laura Martínez",
  adminEmail: "laura@example.com",
  language: "Español",
  pageSize: "5",
  emailNotifications: true,
  darkMode: false,
}

export const seedActivity: Activity[] = [
  { id: 2, user: "María García", action: "actualizó la tarea", target: "Implementar autenticación", time: "Ayer" },
  { id: 1, user: "Diego Torres", action: "completó la tarea", target: "Agregar notificaciones push", time: "Ayer" },
]

// El progreso y el estado de un proyecto se calculan a partir de sus tareas
export function getProjectProgress(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  if (projectTasks.length === 0) return 0
  const done = projectTasks.filter((t) => t.status === "Completado").length
  return Math.round((done / projectTasks.length) * 100)
}

export function getProjectStatus(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  if (projectTasks.length > 0 && projectTasks.every((t) => t.status === "Completado")) {
    return "Completado"
  }
  return projectTasks.some((t) => t.status !== "Pendiente") ? "En progreso" : "Planificado"
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function nextId(prefix: string, ids: string[]) {
  const max = Math.max(0, ...ids.map((id) => Number(id.slice(prefix.length))))
  return `${prefix}${max + 1}`
}
