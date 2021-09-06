import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm'
import Auth from './auth.entity'
import Thread from './thread.entity'
import Profile from './profile.entity'
import Like from './like.entity'

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  username: string

  @Column({
    nullable: true,
  })
  avatar: string

  @Column({ default: false })
  isAdmin: boolean

  @OneToOne(() => Auth, (auth) => auth.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth: Auth

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile

  @OneToMany(() => Thread, (thread) => thread.user, { cascade: true })
  threads: Thread[]

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  like: Like
}
