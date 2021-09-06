import { Controller, Get, Param, Res } from '@nestjs/common'

@Controller('data')
export class DataController {
  @Get('pictures/cover/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: 'data/pictures/cover' })
  }

  @Get('pictures/avatar/:imgpath')
  getAvatar(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: 'data/pictures/avatar' })
  }

  @Get('pictures/thread/:imgpath')
  getThread(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: 'data/pictures/thread' })
  }
}
