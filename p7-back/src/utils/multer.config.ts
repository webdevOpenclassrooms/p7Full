import { extname } from 'path'
import { v4 as uuid } from 'uuid'
import { diskStorage, memoryStorage } from 'multer'

import { HttpException, HttpStatus } from '@nestjs/common'

const paths = [
  { name: '/api/thread', slug: 'thread' },
  { name: '/api/profile', slug: 'avatar' },
  { name: '/api/cover', slug: 'cover' },
]

const destination = (req: any) => {
  let uploadPath = process.env.LOCAL_STORAGE_FOLDER

  paths.map((path) => {
    path.name === req.route.path ? (uploadPath += path.slug) : false
  })
  return uploadPath
}

export const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      cb(
        new HttpException(
          'uniquement les images sont autorisé!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      )
    }
    cb(null, true)
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, destination(req))
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`)
    },
  }),
}
