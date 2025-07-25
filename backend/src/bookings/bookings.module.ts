import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './bookings.entity';
import { User } from '../user/user.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Teacher])],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
