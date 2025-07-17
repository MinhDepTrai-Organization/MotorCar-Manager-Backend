import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressAPI } from 'src/constants/address.enum';

@Injectable()
export class DistrictService {
  async getAllDistricts(
    provinceId?: number,
    page?: number,
    size?: number,
    query?: string,
  ) {
    try {
      let paramQuery = '';
      if (!page) page = 0;
      if (!size) size = 1000;
      if (provinceId) paramQuery += '/' + provinceId;
      if (query) paramQuery += `?page=${page}&size=${size}&query=${query}`;
      else paramQuery += `?page=${page}&size=${size}`;
      const response = await fetch(AddressAPI.DISTRICT_API + paramQuery, {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.data || data.data.length === 0)
        throw new NotFoundException('Could not find any district');
      return data;
    } catch (e) {
      throw e;
    }
  }
}
