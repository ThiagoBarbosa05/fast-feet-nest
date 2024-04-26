/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger'

export class AttachmentData {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}

export class AttachmentResponse {
  @ApiProperty({ type: 'string' })
  attachmentId: string
}

export class AttachmentIdBody {
  @ApiProperty({ type: 'string' })
  attachments: string
}
