Frontend Service Audit Log (audit-log/services/audit-log.services.ts)

Backend Entity Audit Log (entities/audit-log.entity.ts)

Backend Create DTO (dto/create-audit-log.dto.ts)

Backend Controller (audit-log.controller.ts)

Backend Service (audit-log.service.ts)

Masalah yang Teridentifikasi:
Status "Gagal" → isSuccess mungkin false atau error

IP Address kosong → fungsi getClientIP tidak bekerja

User "N/A" → userId tidak terambil dari localStorage