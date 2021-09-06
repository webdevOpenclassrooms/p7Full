import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Thread from './thread.entity'

import User from './user.entity'

@Entity()
export default class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Thread, (thread) => thread.like, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  thread: Thread

  @ManyToOne(() => User, (user) => user.like, {
    // eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User
}
