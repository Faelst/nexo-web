export type Role = 'EMPLOYEE' | 'ANALYST'

export type User = {
  id: string
  email: string
  name: string
  initials: string
  role: Role
  department: string | null
  team: string | null
  passwordChangedDaysAgo: number
}
