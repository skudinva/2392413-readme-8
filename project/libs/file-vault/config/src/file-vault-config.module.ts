import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import fileVaultConfig from './file-vault.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileVaultConfig],
    }),
  ],
})
export class FileVaultConfigModule {}
