import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchMarketQueryDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SearchService {
  constructor(
    private categoryService: CategoryService,
  ) { }

  async findAll(searchText: string) {
    try {
      if (!searchText || !searchText.trim()) {
        return [];
      }
      // const result = await this.marketService.findMarketByName(
      //   searchText.trim(),
      // );
      // return result;
    } catch (error) {
      console.error('Error in searching market globally:', error);
      throw new InternalServerErrorException(
        'Error in searching market globally',
      );
    }
  }


}
