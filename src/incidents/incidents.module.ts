import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from 'src/core/entities/incident.entity';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([Incident]), CacheService],
  controllers: [IncidentsController],
  providers: [IncidentsService]
})
export class IncidentsModule {}
