"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureUpdate1764311381650 = void 0;
class FeatureUpdate1764311381650 {
    name = 'FeatureUpdate1764311381650';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`auth\` (\`auth_id\` int NOT NULL AUTO_INCREMENT, \`userID\` varchar(255) NOT NULL, \`hash_password\` varchar(255) NOT NULL, \`refresh_token\` varchar(255) NULL, \`reset_password_token\` varchar(255) NULL, \`user_id\` int NULL, UNIQUE INDEX \`IDX_11ef67258eef6fe04462a6a6da\` (\`userID\`), UNIQUE INDEX \`REL_9922406dc7d70e20423aeffadf\` (\`user_id\`), PRIMARY KEY (\`auth_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`division\` (\`divisi_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`divisi_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`notification_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`type\` enum ('info', 'success', 'warning', 'error', 'system') NOT NULL DEFAULT 'info', \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`metadata\` json NULL, \`category\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expires_at\` timestamp NULL, INDEX \`IDX_9a8a82462cab47c73d25f49261\` (\`user_id\`), INDEX \`IDX_77ee7b06d6f802000c0846f3a5\` (\`created_at\`), PRIMARY KEY (\`notification_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`audit_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`action\` enum ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT') NOT NULL, \`module\` enum ('INVESTASI', 'PASAR', 'LIKUIDITAS', 'OPERASIONAL', 'HUKUM', 'STRATEJIK', 'KEPATUHAN', 'REPUTASI', 'USER_MANAGEMENT', 'SYSTEM') NOT NULL, \`description\` text NOT NULL, \`endpoint\` text NULL, \`ip_address\` varchar(255) NULL, \`is_success\` tinyint NOT NULL DEFAULT 1, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`metadata\` json NULL, INDEX \`IDX_2651664897b82bcfb8975552c6\` (\`timestamp\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`userID\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'USER') NOT NULL DEFAULT 'USER', \`gender\` enum ('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`divisi_id\` int NULL, UNIQUE INDEX \`IDX_80b95948dfff0967ce1b3e3ae1\` (\`userID\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`risk_levels\` (\`id_risk_level_pasar\` int NOT NULL AUTO_INCREMENT, \`low\` decimal(10,2) NULL, \`low_to_moderate\` decimal(10,2) NULL, \`moderate\` decimal(10,2) NULL, \`moderate_to_high\` decimal(10,2) NULL, \`high\` decimal(10,2) NULL, \`hasil\` decimal(10,2) NULL, \`peringkat\` int NULL, \`weighted\` decimal(10,2) NULL, \`keterangan\` text NULL, \`indikator_id\` int NULL, PRIMARY KEY (\`id_risk_level_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`indikators\` (\`id_indikator_pasar\` int NOT NULL AUTO_INCREMENT, \`nama_indikator\` varchar(255) NOT NULL, \`bobot_indikator\` decimal(5,2) NULL, \`faktor_penyebut\` varchar(255) NULL, \`value_penyebut\` decimal(10,2) NULL, \`faktor_pembilang\` varchar(255) NULL, \`value_pembilang\` decimal(10,2) NULL, \`sumber_risiko\` text NULL, \`dampak\` text NULL, \`section_id\` int NULL, PRIMARY KEY (\`id_indikator_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sections\` (\`id_section_pasar\` int NOT NULL AUTO_INCREMENT, \`no_sec\` int NOT NULL, \`nama_section\` varchar(255) NOT NULL, \`bobot_par\` decimal(5,2) NULL, \`tahun\` int NOT NULL, \`triwulan\` enum ('Q1', 'Q2', 'Q3', 'Q4') NOT NULL, PRIMARY KEY (\`id_section_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`section_summary\` (\`id_section_summary_pasar\` int NOT NULL AUTO_INCREMENT, \`total_weighted\` decimal(10,2) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`sectionIdSectionPasar\` int NULL, UNIQUE INDEX \`REL_f2b50b2ebcc8e5756e5ac13d57\` (\`sectionIdSectionPasar\`), PRIMARY KEY (\`id_section_summary_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_9922406dc7d70e20423aeffadf3\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audit_log\` ADD CONSTRAINT \`FK_cb11bd5b662431ea0ac455a27d7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_257a9a6dc1631c6852fcc9114b7\` FOREIGN KEY (\`divisi_id\`) REFERENCES \`division\`(\`divisi_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`risk_levels\` ADD CONSTRAINT \`FK_1d0f21ee56dfcacf1bc2926b725\` FOREIGN KEY (\`indikator_id\`) REFERENCES \`indikators\`(\`id_indikator_pasar\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`indikators\` ADD CONSTRAINT \`FK_cef7d028bd728c2572a30fc1323\` FOREIGN KEY (\`section_id\`) REFERENCES \`sections\`(\`id_section_pasar\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`section_summary\` ADD CONSTRAINT \`FK_f2b50b2ebcc8e5756e5ac13d57e\` FOREIGN KEY (\`sectionIdSectionPasar\`) REFERENCES \`sections\`(\`id_section_pasar\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`section_summary\` DROP FOREIGN KEY \`FK_f2b50b2ebcc8e5756e5ac13d57e\``);
        await queryRunner.query(`ALTER TABLE \`indikators\` DROP FOREIGN KEY \`FK_cef7d028bd728c2572a30fc1323\``);
        await queryRunner.query(`ALTER TABLE \`risk_levels\` DROP FOREIGN KEY \`FK_1d0f21ee56dfcacf1bc2926b725\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_257a9a6dc1631c6852fcc9114b7\``);
        await queryRunner.query(`ALTER TABLE \`audit_log\` DROP FOREIGN KEY \`FK_cb11bd5b662431ea0ac455a27d7\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_9922406dc7d70e20423aeffadf3\``);
        await queryRunner.query(`DROP INDEX \`REL_f2b50b2ebcc8e5756e5ac13d57\` ON \`section_summary\``);
        await queryRunner.query(`DROP TABLE \`section_summary\``);
        await queryRunner.query(`DROP TABLE \`sections\``);
        await queryRunner.query(`DROP TABLE \`indikators\``);
        await queryRunner.query(`DROP TABLE \`risk_levels\``);
        await queryRunner.query(`DROP INDEX \`IDX_80b95948dfff0967ce1b3e3ae1\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2651664897b82bcfb8975552c6\` ON \`audit_log\``);
        await queryRunner.query(`DROP TABLE \`audit_log\``);
        await queryRunner.query(`DROP INDEX \`IDX_77ee7b06d6f802000c0846f3a5\` ON \`notifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_9a8a82462cab47c73d25f49261\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`division\``);
        await queryRunner.query(`DROP INDEX \`REL_9922406dc7d70e20423aeffadf\` ON \`auth\``);
        await queryRunner.query(`DROP INDEX \`IDX_11ef67258eef6fe04462a6a6da\` ON \`auth\``);
        await queryRunner.query(`DROP TABLE \`auth\``);
    }
}
exports.FeatureUpdate1764311381650 = FeatureUpdate1764311381650;
//# sourceMappingURL=1764311381650-FeatureUpdate.js.map