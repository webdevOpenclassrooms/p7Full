import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Thread from './thread.entity'

import User from './user.entity'

@Entity()
export default class ThreadReply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  content: string

  @Column({ nullable: true })
  @CreateDateColumn({ type: 'date', nullable: true })
  updated_at: Date

  @ManyToOne(() => Thread, (thread) => thread.threadReplies, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  thread: Thread

  @ManyToOne(() => User, (user) => user.threads, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User
}
