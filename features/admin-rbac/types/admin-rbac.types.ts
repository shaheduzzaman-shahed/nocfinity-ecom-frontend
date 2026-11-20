export interface AdminRole {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  is_system: boolean;
  permissions: string[];
  users_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminPermission {
  id: number;
  name: string;
  module: string | null;
  description: string | null;
}

export interface AdminStaffMember {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string | null;
}

export interface RolePayload {
  display_name: string;
  description: string | null;
  permissions: string[];
}

export interface PermissionModuleGroup {
  module: string;
  label: string;
  permissions: AdminPermission[];
}
