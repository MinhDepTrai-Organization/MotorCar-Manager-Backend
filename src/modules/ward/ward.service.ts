import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressAPI } from 'src/constants/address.enum';

@Injectable()
export class WardService {
  async getAllDistricts(
    districtId?: number,
    page?: number,
    size?: number,
    query?: string,
  ) {
    try {
      let paramQuery = '';
      if (!page) page = 0;
      if (!size) size = 1000;
      if (districtId) paramQuery += '/' + districtId;
      if (query) paramQuery += `?page=${page}&size=${size}&query=${query}`;
      else paramQuery += `?page=${page}&size=${size}`;
      const response = await fetch(AddressAPI.WARD_API + paramQuery, {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.data || data.data.length === 0)
        throw new NotFoundException('Could not find any ward');
      return data;
    } catch (e) {
      throw e;
    }
  }
}
