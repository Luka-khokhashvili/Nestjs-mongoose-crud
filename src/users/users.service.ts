import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) throw new BadRequestException('user already exists');

    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Id provided is not valid!');

    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Id provided is not valid!');

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    return { message: 'User has updates succefully!', data: user };
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Id provided is not valid!');

    const user = await this.userModel.findByIdAndDelete(id);

    return { message: 'User deleted!', data: user };
  }
}
