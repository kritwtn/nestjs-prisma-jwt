import { Injectable, NotFoundException , HttpException , HttpStatus } from '@nestjs/common'
import { CreateUserDto  } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from './../prisma.service';
import { Users, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService) {}

  private validateCreateUserDto(createUserDto: CreateUserDto): string[] | null {
    const requiredFields = ['name', 'email', 'password'];
    let errors = [];
    for (const field of requiredFields) {
        if (!createUserDto[field]) {
          errors.push(`${field} is required`);
        }
    }

    return errors.length > 0 ? errors : null;
  }

  private mapCreateUserDtoToUsersCreateInput(createUserDto: CreateUserDto): Prisma.UsersCreateInput | any {
    const validationError = this.validateCreateUserDto(createUserDto);

    if (validationError) {
        const returnObject = {
          errors : validationError
        }
        return returnObject; // Validation failed
    }

    // Create the Prisma input object
    const data: Prisma.UsersCreateInput = {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        created_at: createUserDto.created_at,
        updated_at: createUserDto.updated_at,
    };

    return data;
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
        const mappedData = this.mapCreateUserDtoToUsersCreateInput(createUserDto);
        if ('errors' in mappedData) {
          return mappedData;
        }

        const newUser = await this.prisma.users.create({
            data: mappedData,
        });

        return newUser;
     
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user');
    }
  }

  async findAll(): Promise<Users[]> {
    try {
      const allUsers = await this.prisma.users.findMany();
      return allUsers;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<Users | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users | null> {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update user');
    }
  }

  async remove(id: number): Promise<Users | null> {
    try {
      const deletedUser = await this.prisma.users.delete({
        where: { id },
      });

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to remove user');
    }
  }

  async findUserByEmail(email: string,password: string): Promise<Users | null> {
    try {
      if (!password) {
        return null;
      }
      
      const user = await this.prisma.users.findFirst({
        where: {
          email : email,
          password : password
        },
        
      })
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      
      return user;
    } catch (error) {
      const errorMessage = error.message;
     
      throw new NotFoundException(errorMessage);
      //throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }
}
