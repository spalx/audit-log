import { Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity as TypeORMBaseEntity } from 'typeorm';

export default abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'text', nullable: true })
  meta!: Record<string, unknown> | null;
}
