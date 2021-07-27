import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { BaseError } from '../../../shared/app/error/BaseError';
import { Result } from '../../../shared/app/Result';
import { config } from '../../../shared/utils/config';

type Cloudinary = typeof import('cloudinary').v2;

export interface IImageService {
  create: (file: FileUpload) => Promise<Result<UploadApiResponse>>;
  update: (file: FileUpload, publicID: string) => Promise<Result<UploadApiResponse>>;
  delete: (publicID: string) => Promise<Result<void>>;
}

export class ImageService implements IImageService {
  constructor(private cloudinary: Cloudinary) {
    this.cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,

      secure: true,
    });
  }

  async create(file: FileUpload) {
    return this.upload(file);
  }

  async update(file: FileUpload, publicID: string) {
    return this.upload(file, publicID);
  }

  async delete(publicID: string) {
    try {
      await this.cloudinary.uploader.destroy(publicID, { invalidate: true });
      return Result.ok<void>();
    } catch (e) {
      return BaseError.unexpected<void>(e);
    }
  }

  private upload({ createReadStream }: FileUpload, public_id?: string) {
    return new Promise<Result<UploadApiResponse>>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'simply',
          async: true,
          public_id,
          invalidate: public_id ? true : undefined,
        },
        (err, result) => {
          if (err) reject(BaseError.unexpected(err));
          resolve(Result.ok<UploadApiResponse>(result));
        }
      );

      createReadStream().pipe(stream);
    });
  }
}
