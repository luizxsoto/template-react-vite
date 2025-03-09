import { ChangeEvent } from 'react'

import { ApplicationException } from '@/common/exceptions/application'
import { i18n } from '@/common/i18n'

export async function fileToBase64(event: ChangeEvent<HTMLInputElement>): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const base64Files: string[] = []

    if (!event.target.files) {
      resolve(base64Files)
    } else {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let fileIndex = 0; fileIndex < event.target.files.length; fileIndex++) {
        const reader = new FileReader()

        reader.onload = () => {
          const base64String = reader.result as string
          base64Files.push(base64String)
          if (event.target.files?.length === base64Files.length) {
            resolve(base64Files)
          }
        }

        reader.onerror = () => {
          reject(new ApplicationException({ message: i18n().common.helpers.file.failToRead }))
        }

        reader.readAsDataURL(event.target.files[fileIndex])
      }
    }
  })
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new ApplicationException({ message: i18n().common.helpers.file.failToRead }))
    }

    reader.readAsDataURL(blob)
  })
}

export function validateMaxFileSize(
  event: ChangeEvent<HTMLInputElement>,
  maxMbSize: number,
): boolean[] {
  const mbSize = 1024
  const validatedFiles: boolean[] = []
  if (!event.target.files) {
    return validatedFiles
  }
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let fileIndex = 0; fileIndex < event.target.files.length; fileIndex++) {
    const fileMbSize = Math.round(event.target.files[fileIndex].size / mbSize)
    validatedFiles.push(fileMbSize < maxMbSize)
  }
  return validatedFiles
}

export function parseFileName(fileName: string, extension: string): string {
  return `${fileName.replace(/\//g, '-')}${extension ? `.${extension}` : ''}`
}
