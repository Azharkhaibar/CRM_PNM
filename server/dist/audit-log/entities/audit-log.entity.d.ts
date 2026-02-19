import { User } from 'src/users/entities/user.entity';
export declare enum ActionType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    VIEW = "VIEW",
    EXPORT = "EXPORT",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
}
export declare enum ModuleType {
    INVESTASI = "INVESTASI",
    PASAR = "PASAR",
    LIKUIDITAS = "LIKUIDITAS",
    OPERASIONAL = "OPERASIONAL",
    HUKUM = "HUKUM",
    STRATEJIK = "STRATEJIK",
    KEPATUHAN = "KEPATUHAN",
    REPUTASI = "REPUTASI",
    USER_MANAGEMENT = "USER_MANAGEMENT",
    SYSTEM = "SYSTEM",
    RAS = "RAS"
}
export declare class AuditLog {
    id: number;
    userId: number | null;
    user: User | null;
    action: ActionType;
    module: ModuleType;
    description: string;
    endpoint: string | null;
    ip_address: string;
    isSuccess: boolean;
    timestamp: Date;
    metadata: any;
}
