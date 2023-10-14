import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1697132095716 implements MigrationInterface {
    name = 'Migrations1697132095716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_trail" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_91aade8e45ada93f7dc98ca7ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audit_trail" ADD CONSTRAINT "FK_3dae5775bdd4f991d6faa4dbe15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_trail" DROP CONSTRAINT "FK_3dae5775bdd4f991d6faa4dbe15"`);
        await queryRunner.query(`DROP TABLE "audit_trail"`);
    }

}
