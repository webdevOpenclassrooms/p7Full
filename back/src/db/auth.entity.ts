import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import User from './user.entity'

@Entity()
export default class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    nullable: true,
  })
  email: string

  @Column({
    nullable: true,
  })
  password: string

  @Column({
    nullable: true,
  })
  refreshtoken: string

  @Column({
    nullable: true,
  })
  refreshtokenexpires: Date

  @OneToOne(() => User, (user) => user.auth, {
    cascade: true,
  })
  user: User
}
