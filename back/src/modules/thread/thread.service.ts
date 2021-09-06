import { Injectable } from '@nestjs/common'
const fs = require('fs')
import { ReplyDto, ThreadDto } from './thread.dto'

import User from 'src/db/user.entity'
import Thread from 'src/db/thread.entity'
import ThreadReply from 'src/db/threadReply.entity'
import Like from 'src/db/like.entity'
import Profile from 'src/db/profile.entity'

@Injectable()
export class ThreadService {
  async find(id?: number): Promise<Thread[]> {
    if (id) {
      const thread = await Thread.findOne(id)
      return [thread]
    }
    return await Thread.find({
      order: {
        id: 'DESC',
      },
    })
  }

  async createThread(
    threadDto: ThreadDto,
    userId: number,
    postId = null,
  ): Promise<Thread | any> {
    let thread: Thread = new Thread()

    thread = Object.assign({}, thread, threadDto)
    thread.user = await User.findOne(userId)
    if (thread.user === undefined) {
      return 'utilisateur non existant'
    }
    if (postId != null) {
      const tempThread = await this.find(postId)
      if (tempThread[0].user.id != userId) {
        return 'erreur'
      }
      await Thread.update(postId, thread)
      return this.find(postId)
    }

    this._updateUserNbThreads(userId)

    return await Thread.save(thread)
  }

  async delete(id: number, userId: number): Promise<any> {
    const thread = await this.find(id)

    if (thread[0]?.user.id !== userId) {
      return { message: 'erreur' }
    }
    this.deletePicture(thread)
    await Thread.delete(id)

    this._updateUserNbThreads(userId)
    return { message: `Thread ${id} supprimé` }
  }

  async deletePicture(thread: Thread[]) {
    const { imagePath } = thread[0]
    if (imagePath) {
      try {
        fs.unlinkSync(imagePath)
      } catch (err) {
        console.error(err)
      }
    }
  }

  async getAllReplies(): Promise<ThreadReply[]> {
    return await ThreadReply.find()
  }

  async deleteReply(id: number, userId: number): Promise<any> {
    const reply = await ThreadReply.findOne(id)
    if (reply?.user.id !== userId) {
      return 'erreur'
    }

    await ThreadReply.delete(id)
    return `Réponse ${id} supprimé`
  }

  async createReply(
    replyDto: ReplyDto,
    userId: number,
    id: number,
  ): Promise<Thread[] | string> {
    let reply: ThreadReply = new ThreadReply()

    reply.content = replyDto.content
    reply.thread = await Thread.findOne(id)
    reply.user = await User.findOne(userId)
    if (reply.thread === undefined || reply.user === undefined) {
      return 'erreur'
    }
    await ThreadReply.save(reply)

    return this.find(id)
  }

  async updateReply(reply: ReplyDto) {
    const tempReply = await ThreadReply.findOne(reply.id)

    if (tempReply.user.id != reply.userId) {
      return 'erreur'
    }
    await ThreadReply.update(reply.id, { content: reply.content })

    return ThreadReply.findOne(reply.id)
  }

  async addLike(userId: number, id: number): Promise<any> {
    const like = new Like()

    like.user = await User.findOne(userId)
    like.thread = await Thread.findOne(id)

    const testLike = await Like.createQueryBuilder('like')
      .where('like.threadId =  :id', { id })
      .andWhere('userId = :userId', { userId })
      .getMany()

    if (testLike.length >= 1) {
      testLike.map((like) => {
        Like.delete(like.id)
      })
    } else {
      await Like.save(like)
    }

    const nbLike = await Like.createQueryBuilder('like')
      .where('like.threadId =  :id', { id })
      .getCount()

    Thread.update(id, { nbLike })
    return nbLike
  }

  async _updateUserNbThreads(userId: number) {
    const nbPosts = await Thread.count({
      where: { user: userId },
    })
    return Profile.update(userId, { nbPosts })
  }
}
