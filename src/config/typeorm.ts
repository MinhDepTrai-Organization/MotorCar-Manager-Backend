import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DetailImportSubscriber } from 'src/subscribers/detail-import.subscriber';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const config = {
  type: 'postgres',
  url: `${process.env.DATABASE_URL}`,
  autoLoadEntities: true,
  migrationsRun: true,
  entities: [join(__dirname, '..', '**', '*.entity.ts')],
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  // subscribers: [join(__dirname, '..', 'subscribers', '*.ts')],
  subscribers: [DetailImportSubscriber],
  ssl: false,
  logging: true,
  prepare: false,
  synchronize: false,
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
