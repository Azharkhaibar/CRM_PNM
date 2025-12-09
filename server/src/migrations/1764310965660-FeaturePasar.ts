import { MigrationInterface, QueryRunner } from "typeorm";

export class FeaturePasar1764310965660 implements MigrationInterface {
    name = 'FeaturePasar1764310965660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`risk_levels\` (\`id_risk_level_pasar\` int NOT NULL AUTO_INCREMENT, \`low\` decimal(10,2) NULL, \`low_to_moderate\` decimal(10,2) NULL, \`moderate\` decimal(10,2) NULL, \`moderate_to_high\` decimal(10,2) NULL, \`high\` decimal(10,2) NULL, \`hasil\` decimal(10,2) NULL, \`peringkat\` int NULL, \`weighted\` decimal(10,2) NULL, \`keterangan\` text NULL, \`indikator_id\` int NULL, PRIMARY KEY (\`id_risk_level_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`indikators\` (\`id_indikator_pasar\` int NOT NULL AUTO_INCREMENT, \`nama_indikator\` varchar(255) NOT NULL, \`bobot_indikator\` decimal(5,2) NULL, \`faktor_penyebut\` varchar(255) NULL, \`value_penyebut\` decimal(10,2) NULL, \`faktor_pembilang\` varchar(255) NULL, \`value_pembilang\` decimal(10,2) NULL, \`sumber_risiko\` text NULL, \`dampak\` text NULL, \`section_id\` int NULL, PRIMARY KEY (\`id_indikator_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sections\` (\`id_section_pasar\` int NOT NULL AUTO_INCREMENT, \`no_sec\` int NOT NULL, \`nama_section\` varchar(255) NOT NULL, \`bobot_par\` decimal(5,2) NULL, \`tahun\` int NOT NULL, \`triwulan\` enum ('Q1', 'Q2', 'Q3', 'Q4') NOT NULL, PRIMARY KEY (\`id_section_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`section_summary\` (\`id_section_summary_pasar\` int NOT NULL AUTO_INCREMENT, \`total_weighted\` decimal(10,2) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`sectionIdSectionPasar\` int NULL, UNIQUE INDEX \`REL_f2b50b2ebcc8e5756e5ac13d57\` (\`sectionIdSectionPasar\`), PRIMARY KEY (\`id_section_summary_pasar\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`risk_levels\` ADD CONSTRAINT \`FK_1d0f21ee56dfcacf1bc2926b725\` FOREIGN KEY (\`indikator_id\`) REFERENCES \`indikators\`(\`id_indikator_pasar\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`indikators\` ADD CONSTRAINT \`FK_cef7d028bd728c2572a30fc1323\` FOREIGN KEY (\`section_id\`) REFERENCES \`sections\`(\`id_section_pasar\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`section_summary\` ADD CONSTRAINT \`FK_f2b50b2ebcc8e5756e5ac13d57e\` FOREIGN KEY (\`sectionIdSectionPasar\`) REFERENCES \`sections\`(\`id_section_pasar\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`section_summary\` DROP FOREIGN KEY \`FK_f2b50b2ebcc8e5756e5ac13d57e\``);
        await queryRunner.query(`ALTER TABLE \`indikators\` DROP FOREIGN KEY \`FK_cef7d028bd728c2572a30fc1323\``);
        await queryRunner.query(`ALTER TABLE \`risk_levels\` DROP FOREIGN KEY \`FK_1d0f21ee56dfcacf1bc2926b725\``);
        await queryRunner.query(`DROP INDEX \`REL_f2b50b2ebcc8e5756e5ac13d57\` ON \`section_summary\``);
        await queryRunner.query(`DROP TABLE \`section_summary\``);
        await queryRunner.query(`DROP TABLE \`sections\``);
        await queryRunner.query(`DROP TABLE \`indikators\``);
        await queryRunner.query(`DROP TABLE \`risk_levels\``);
    }

}
