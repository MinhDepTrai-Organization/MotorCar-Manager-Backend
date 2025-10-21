import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
export default registerAs(
  'typeormConfig',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: `${process.env.DATABASE_URL}`,
    autoLoadEntities: true,
    migrationsRun: true,
    entities: [join(__dirname, '..', '**', '*.entity.ts')],
    migrations: [join(__dirname, '..', 'migrations', '*.ts')],
    ssl: false,
    logging: true,
    synchronize: true,
  }),
);
