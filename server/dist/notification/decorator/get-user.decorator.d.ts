export interface AuthenticatedUser {
    user_id: number;
    userID: string;
    role: string;
    gender: string;
    divisi?: {
        divisi_id: number;
        name: string;
    } | null;
    created_at?: Date;
    updated_at?: Date;
}
export declare const GetUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
