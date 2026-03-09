import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { StellarEscrow } from './stellar-escrow.entity';

export enum ConditionType {
  TIME_LOCK = 'time_lock',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  EXTERNAL_VALIDATION = 'external_validation',
  MILESTONE_COMPLETION = 'milestone_completion',
}

@Entity('stellar_escrow_conditions')
@Index('IDX_escrow_conditions_escrow_id', ['escrowId'])
@Index('IDX_escrow_conditions_type', ['conditionType'])
export class EscrowConditionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // On-chain escrow identifier (e.g. Soroban BytesN<32> hex string)
  @Column({ name: 'escrow_id', type: 'varchar', length: 128 })
  escrowId: string;

  @Column({
    name: 'condition_type',
    type: 'enum',
    enum: ConditionType,
  })
  conditionType: ConditionType;

  @Column({ type: 'jsonb' })
  parameters: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  satisfied: boolean;

  @Column({ name: 'satisfied_at', type: 'timestamp', nullable: true })
  satisfiedAt: Date | null;

  @Column({ type: 'boolean', default: true })
  required: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => StellarEscrow, (escrow) => escrow.conditions, {
    onDelete: 'CASCADE',
  })
  escrow: StellarEscrow;
}

// Backwards-compatible alias matching the issue specification
export { EscrowConditionEntity as EscrowCondition };
