import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import User from './user.entity'

@Entity()
export default class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  imageCover: string

  @Column({ nullable: true })
  bio: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  service: string

  @Column({
    default: 0,
  })
  nbFriends: number

  @Column({
    default: 0,
  })
  nbFollowers: number

  @Column({
    default: 0,
  })
  nbPosts: number

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User
}
