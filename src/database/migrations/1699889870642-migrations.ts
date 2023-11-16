import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1699889870642 implements MigrationInterface {
    name = 'Migrations1699889870642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isGoogleUser" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isGoogleUser"`);
    }

}
