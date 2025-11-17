export interface UserData {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
}
export interface AuditLogWithUser {
    id: number;
    userId: number | null;
    user: UserData | null;
    action: string;
    module: string;
    description: string;
    endpoint: string | null;
    ip_address: string;
    isSuccess: boolean;
    timestamp: Date;
    metadata: any;
}
