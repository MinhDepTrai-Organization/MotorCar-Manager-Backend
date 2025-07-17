import { Expose, Transform } from 'class-transformer';
import { transformDto } from 'src/helpers/transformObjectDto';
import { ResponseBlogDto } from 'src/modules/blog/dto/response-blog';
import { Blog } from 'src/modules/blog/entities/blog.entity';

export class ResponseBlogCategoryDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description?: string;
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.blogs || !Array.isArray(obj.blogs)) {
      return [];
    }
    return obj.blogs.map((blog: Blog) => {
      const res = transformDto(ResponseBlogDto, blog);
      return {
        id: res.id,
        title: res.title,
        thumbnail: res.thumbnail,
        content: res.content,
      };
    });
  })
  blogs: ResponseBlogDto[];
  @Expose()
  slug: string;
  @Expose()
  updatedAt: Date;
  @Expose()
  createdAt: Date;
  @Expose()
  deletedAt: Date | null;
}
