import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import ThreadReply from './threadReply.entity'
import User from './user.entity'
import Like from './like.entity'

@Entity()
export default class Thread extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  content: string

  @Column({ nullable: true })
  imagePath: string

  @Column({ default: 0 })
  nbLike: number

  @CreateDateColumn({ type: 'date', nullable: true })
  updated_at: Date

  @ManyToOne(() => User, (user) => user.threads, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User

  @OneToMany(() => ThreadReply, (threadReply) => threadReply.thread, {
    eager: true,
    cascade: true,
  })
  threadReplies: ThreadReply[]

  @OneToMany(() => Like, (like) => like.thread, {
    cascade: true,
  })
  @JoinTable()
  like: Like
}
