import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../cart_item/entities/cart_item.entity';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';
import { RoleEnum } from 'src/constants/role.enum';

@Injectable()
export class CartService {
  @InjectRepository(Cart)
  private cartRepository: Repository<Cart>;

  @InjectRepository(CartItem)
  private cartItemRepository: Repository<CartItem>;
  // Lấy hoặc tạo giỏ hàng cho user
  async addToCart(createCartDto: CreateCartDto, user: UserValidationType) {
    try {
      if (!user || !user.id) {
        throw new NotFoundException('User không hợp lệ hoặc không tồn tại');
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem') // Tải quan hệ cartItem
        .leftJoinAndSelect('cartItem.skus', 'skus') // Tải quan hệ skus trong cartItem
        .where('cart.customer = :customerId', { customerId: user.id })
        .select([
          'cart.id', // Chỉ lấy ID của Cart
          'cartItem.id', // Chỉ lấy ID của CartItem
          'cartItem.quantity', // Lấy số lượng từ CartItem
          'skus.id', // Chỉ lấy ID của Skus
          'skus.name', // Lấy thêm tên của Skus (nếu có)
        ])
        .getOne();

      if (!cart) {
        cart = this.cartRepository.create({
          customer: { id: user.id },
          cartItem: [],
        });
        await this.cartRepository.save(cart);
      }
      // 3. Kiểm tra xem sản phẩm (sku_id) đã tồn tại trong giỏ hàng chưa
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItem = cart.cartItem.find(
        (item) => item.skus.id == createCartDto.cart_item.sku_id,
      );

      //  cộng thêm vào
      if (existingItem) {
        existingItem.quantity += createCartDto.cart_item.quantity;
        return await this.cartItemRepository.save(existingItem);
      }
      // 5. Nếu chưa tồn tại, tạo mới CartItem và thêm vào giỏ
      const newItem = this.cartItemRepository.create({
        skus: { id: createCartDto.cart_item.sku_id },
        quantity: createCartDto.cart_item.quantity,
        cart, // Liên kết với giỏ hàng
      });
      return await this.cartItemRepository.save(newItem);
    } catch (e) {
      throw e;
    }
  }

  // Lấy ra cart của user

  async getCart(user: UserValidationType) {
    try {
      if (!user || !user.id) {
        throw new BadRequestException(
          'User không hợp lệ hoặc không tồn tại hoặc chưa đăng nhập',
        );
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      let getCart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem')
        .leftJoinAndSelect('cartItem.skus', 'skus')
        .leftJoinAndSelect('skus.product', 'product')
        .leftJoinAndSelect('skus.detail_import', 'detail_import')
        .where('cart.customer = :customerId', { customerId: user.id })
        .select([
          'cart.id',
          'cartItem.id',
          'cartItem.quantity',
          'cartItem.createdAt',
          'skus.id',
          'skus.name',
          'skus.price_sold',
          'skus.image',
          'product.id',
          'product.title',
          'product.type',
          'detail_import.quantity_remaining',
        ])
        .orderBy('cartItem.createdAt', 'DESC') // Sắp xếp theo thứ tự tạo
        .getOne();

      if (!getCart) {
        getCart = this.cartRepository.create({
          customer: { id: user.id },
          cartItem: [],
        });
        await this.cartRepository.save(getCart);
      }

      // Tính tổng quantity_remaining từ detail_import đã join
      getCart.cartItem = getCart.cartItem.map((item) => {
        const totalQuantityRemaining = item.skus.detail_import.reduce(
          (sum, detail) => sum + (detail.quantity_remaining || 0),
          0,
        );
        item.skus['skus_quantity_remaining'] = totalQuantityRemaining;
        delete item.skus.detail_import;
        return item;
      });

      return getCart;
    } catch (e) {
      throw e;
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async remove(user: UserValidationType, skusId: string) {
    try {
      if (!user || !user.id) {
        throw new BadRequestException(
          'User không hợp lệ hoặc không tồn tại hoặc chưa đăng nhập',
        );
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      // 1. Lấy giỏ hàng của user
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem') // Tải quan hệ cartItem
        .leftJoinAndSelect('cartItem.skus', 'skus') // Tải quan hệ skus trong cartItem
        .where('cart.customer = :customerId', { customerId: user.id })
        .select([
          'cart.id', // Chỉ lấy ID của Cart
          'cartItem.id', // Chỉ lấy ID của CartItem
          'cartItem.quantity', // Lấy số lượng từ CartItem
          'skus.id', // Chỉ lấy ID của Skus
          'skus.name', // Lấy thêm tên của Skus (nếu có)
        ])
        .getOne();
      // 2. Tìm CartItem cần xóa
      const cartItem = cart.cartItem.find((item) => item.skus.id === skusId);
      if (!cartItem) {
        throw new NotFoundException(
          `Sản phẩm với SKU ${skusId} không tồn tại trong giỏ hàng`,
        );
      }

      // 3. Xóa CartItem
      await this.cartItemRepository.remove(cartItem);

      // 4. Trả về giỏ hàng đã cập nhật
      return await this.getCart(user);
    } catch (e) {
      throw e;
    }
  }

  async removeCartItem(user: UserValidationType, cartItemId: string) {
    try {
      if (!user || !user.id) {
        throw new BadRequestException(
          'User không hợp lệ hoặc không tồn tại hoặc chưa đăng nhập',
        );
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      // 1. Lấy giỏ hàng của user kèm theo cartItem
      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem')
        .where('cart.customer = :customerId', { customerId: user.id })
        .select(['cart.id', 'cartItem.id']) // chỉ cần ID
        .getOne();

      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng');
      }

      // 2. Kiểm tra cartItem tồn tại trong cart
      const cartItem = cart.cartItem.find((item) => item.id === cartItemId);
      if (!cartItem) {
        throw new NotFoundException(`Không tìm thấy sản phẩm trong giỏ hàng`);
      }

      // 3. Xóa cartItem theo id
      await this.cartItemRepository.remove(cartItem);

      // 4. Trả về giỏ hàng mới
      return await this.getCart(user);
    } catch (e) {
      throw e;
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(user: UserValidationType): Promise<void> {
    try {
      // 1. Lấy giỏ hàng của user
      if (!user || !user.id) {
        throw new BadRequestException(
          'User không hợp lệ hoặc không tồn tại hoặc chưa đăng nhập',
        );
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem') // Tải quan hệ cartItem
        .leftJoinAndSelect('cartItem.skus', 'skus') // Tải quan hệ skus trong cartItem
        .where('cart.customer = :customerId', { customerId: user.id })
        .select([
          'cart.id', // Chỉ lấy ID của Cart
          'cartItem.id', // Chỉ lấy ID của CartItem
          'cartItem.quantity', // Lấy số lượng từ CartItem
          'skus.id', // Chỉ lấy ID của Skus
          'skus.name', // Lấy thêm tên của Skus (nếu có)
        ])
        .getOne();

      // 2. Xóa tất cả CartItem
      await this.cartItemRepository.delete({ cart: { id: cart.id } });

      // 3. (Tùy chọn) Xóa cả Cart nếu muốn
      // await this.cartRepository.remove(cart);
    } catch (e) {
      throw e;
    }
  }
  // Cập nhật sản phẩm trong giỏ hàng
  async updateCart(
    user: UserValidationType,
    Id: string,
    quantity: UpdateCartDto,
  ) {
    try {
      if (!user || !user.id) {
        throw new BadRequestException(
          'User không hợp lệ hoặc không tồn tại hoặc chưa đăng nhập',
        );
      }
      if (user.role !== RoleEnum.USER) {
        throw new UnauthorizedException(
          'Bạn không có quyền truy cập vào giỏ hàng này',
        );
      }
      // 1. Lấy giỏ hàng của user
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItem', 'cartItem') // Tải quan hệ cartItem
        .leftJoinAndSelect('cartItem.skus', 'skus') // Tải quan hệ skus trong cartItem
        .where('cart.customer = :customerId', { customerId: user.id })
        .select([
          'cart.id', // Chỉ lấy ID của Cart
          'cartItem.id', // Chỉ lấy ID của CartItem
          'cartItem.quantity', // Lấy số lượng từ CartItem
          'skus.id', // Chỉ lấy ID của Skus
          'skus.name', // Lấy thêm tên của Skus (nếu có)
        ])
        .getOne();

      // 2. Tìm CartItem cần cập nhật
      const cartItem = cart.cartItem.find((item) => item.id == Id);
      if (!cartItem) {
        throw new NotFoundException(
          `Sản phẩm với SKU ${Id} không tồn tại trong giỏ hàng`,
        );
      }

      // 3. Cập nhật số lượng hoặc xóa nếu quantity = 0
      if (quantity.quantity == 0) {
        await this.cartItemRepository.remove(cartItem);
      } else if (quantity.quantity) {
        cartItem.quantity = quantity.quantity;
        await this.cartItemRepository.save(cartItem);
      }

      // 4. Trả về giỏ hàng đã cập nhật
      return await this.getCart(user);
    } catch (e) {
      throw e;
    }
  }
}
