import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ImagesVideo } from '../images_videos/entities/images_video.entity';
import { relative } from 'path';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { extractPublicId } from 'cloudinary-build-url';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ImagesVideo)
    private readonly ImageVideoRepository: Repository<ImagesVideo>,

    private cloudinaryService?: CloudinaryService,
  ) {}
  async createReview(createReviewDto: CreateReviewDto, user) {
    const review = this.reviewRepository.create({
      review_rating: createReviewDto.review_rating,
      customer: { id: user.id },
      review_comment: createReviewDto.review_comment,
      product: { id: createReviewDto.product_id },
      order: createReviewDto.order_id ? { id: createReviewDto.order_id } : null,
    });
    const reviewData = await this.reviewRepository.save(review);
    for (const data of createReviewDto.images_videos) {
      const imageVideo = this.ImageVideoRepository.create({
        UrlImage: data.UrlImage,
        type: data.type,
        reviews: reviewData,
      });
      await this.ImageVideoRepository.save(imageVideo);
    }

    return {
      status: 200,
      message: 'Thêm đánh giá thành công ',
    };
  }

  async findAll() {
    const getAllReview = await this.reviewRepository.find({
      relations: ['images_videos', 'customer', 'product'], // Lấy thêm thông tin customer & product
    });

    if (getAllReview.length === 0) {
      return {
        status: 404,
        message: 'Không tìm thấy đánh giá nào!',
      };
    }

    const formattedReviews = getAllReview.map((review) => ({
      id: review.id,
      review_rating: review.review_rating,
      review_comment: review.review_comment,
      createdAt: review.createdAt,
      customer: {
        id: review.customer?.id,
        username: review.customer?.username,
        email: review.customer?.email,
        avatarUrl: review.customer?.avatarUrl,
      },
      product: {
        id: review.product?.id,
        title: review.product?.title,
        slug_product: review.product?.slug_product,
        images: review.product?.images?.slice(0, 3), // Lấy 3 ảnh đầu tiên
      },
      images_videos: review.images_videos?.map((item) => ({
        id: item.id,
        UrlImage: item.UrlImage,
      })),
    }));

    return {
      status: 200,
      message: 'Lấy danh sách đánh giá thành công!',
      data: formattedReviews,
    };
  }

  async findReviewsByProductId(productId: string) {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['images_videos', 'customer', 'product'],
    });

    if (!reviews || reviews.length === 0) {
      return {
        status: 404,
        message: `Không tìm thấy đánh giá cho sản phẩm với ID ${productId}`,
      };
    }

    return {
      status: 200,
      message: 'Lấy danh sách đánh giá thành công !',
      data: reviews.map((review) => ({
        id: review.id,
        review_rating: review.review_rating,
        review_comment: review.review_comment,
        createdAt: review.createdAt,
        customer: {
          id: review.customer?.id,
          username: review.customer?.username,
          email: review.customer?.email,
          avatarUrl: review.customer?.avatarUrl,
        },
        product: {
          id: review.product?.id,
          title: review.product?.title,
          slug_product: review.product?.slug_product,
        },
        images_videos: review.images_videos.map((item) => ({
          id: item.id,
          UrlImage: item.UrlImage,
          type: item.type,
        })),
      })),
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const { images_videos, ...data } = updateReviewDto;

    // tìm đánh giá review  theo id
    const findReview = await this.reviewRepository.findOne({
      where: { id: id },
      relations: ['images_videos'],
    });

    if (!findReview) {
      return {
        status: 404,
        message: `Không tìm thấy đánh giá với ID ${id}`,
      };
    }
    // Xóa hết ảnh cũ của review đó  trên clound + db
    for (const imageVideo of findReview.images_videos) {
      // lấy ra public id
      try {
        await this.cloudinaryService.removeFile(
          extractPublicId(imageVideo.UrlImage),
        );
        await this.ImageVideoRepository.delete(imageVideo.id);
      } catch (cloudError) {
        console.error(`Error removing file on Cloudinary}`, cloudError);
        // Có thể ném lỗi nếu cần thiết hoặc tiếp tục xử lý
        throw new BadRequestException(`Failed to remove image on Cloudinary}`);
      }
    }
    // thêm 1 mảng  ảnh vào db
    for (const data of images_videos) {
      const imageVideo = this.ImageVideoRepository.create({
        UrlImage: data.UrlImage,
        type: data.type,
        reviews: findReview,
      });
      await this.ImageVideoRepository.save(imageVideo);
    }
    // Cập nhật các trường của review
    await this.reviewRepository.update(id, data);
    return {
      status: 201,
      message: 'Cập nhật đánh giá thành công',
    };
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      return {
        status: 404,
        message: `Không tìm thấy đánh giá với ID ${id}`,
      };
    }

    await this.reviewRepository.softRemove(review);

    return {
      status: 200,
      message: `Đã xóa đánh giá với ID ${id}`,
    };
  }
  // Xóa hẳn review + imageVideo  luôn
  async removeHardReview(id: string) {
    const findReview = await this.reviewRepository.findOne({
      where: { id: id },
      relations: ['images_videos'],
    });

    if (!findReview) {
      return {
        status: 404,
        message: `Không tìm thấy đánh giá với ID ${id}`,
      };
    }
    // Xóa hết ảnh của review đó  trên clound + db
    for (const imageVideo of findReview.images_videos) {
      // lấy ra public id
      try {
        await this.cloudinaryService.removeFile(
          extractPublicId(imageVideo.UrlImage),
        );
        await this.ImageVideoRepository.delete(imageVideo.id);
      } catch (cloudError) {
        console.error(`Error removing file on Cloudinary}`, cloudError);
        // Có thể ném lỗi nếu cần thiết hoặc tiếp tục xử lý
        throw new BadRequestException(`Failed to remove image on Cloudinary}`);
      }
    }
    // xóa review
    await this.reviewRepository.delete(findReview.id);

    return {
      status: 200,
      message: `Đã xóa đánh giá với ID ${id}`,
    };
  }
  async uploadImages(folder: string, images: Express.Multer.File[]) {
    try {
      const uploadResults = await this.cloudinaryService.uploadFiles(
        images,
        folder,
      );
      return uploadResults.map((uploadResult) => ({
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      }));
    } catch (e) {
      throw e;
    }
  }

  async removeFileByPublicId(publicId: string) {
    try {
      const result = await this.cloudinaryService.removeFile(publicId);
      if (!result)
        throw new NotFoundException(`No file found with public id ${publicId}`);
      return true;
    } catch (e) {
      throw e;
    }
  }

  async removeFilesByPublicIds(publicIds: string[]) {
    try {
      const result = await this.cloudinaryService.removeFiles(publicIds);
      if (!result)
        throw new NotFoundException(
          `No files found with public ids ${publicIds}`,
        );
      return true;
    } catch (e) {
      throw e;
    }
  }
}
