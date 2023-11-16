import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { RegisterUserDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path: '.env',
});
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async googleRegistrationService(token: string) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    const userExists = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new BadRequestException('user already exists ');
    }
    const newUser = await this.userRepo.create({
      email: email,
      isGoogleUser: true,
    });
    this.logger.log(`User with email ${email} created successfully`);
    return this.userRepo.save(newUser);
  }
  async getUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
  }
  async getUserById(id: number) {
    console.log('id is', id);
    return await this.userRepo.findOne({
      where: {
        id: id,
      },
    });
  }
  async create(dto: RegisterUserDTO) {
    const { email, password } = dto;
    const userExists = await this.getUserByEmail(email);
    if (userExists) {
      throw new BadRequestException('User with credentials already exists');
    }
    const hashedPassword = await argon.hash(password);
    console.log(hashedPassword);
    const newUser = await this.userRepo.create({
      email: email,
      password: hashedPassword,
    });
    console.log(newUser);
    // await newUser.save();
    await this.entityManager.save(newUser);
    this.logger.log(`User with email ${dto.email} successfully registered`);
    return newUser;
  }

  async login(dto: RegisterUserDTO) {
    const { email, password } = dto;
    const userExists = await this.getUserByEmail(email);
    if (!userExists) {
      throw new BadRequestException('User with credentials not found');
    }
    const isPasswordMatch = await argon.verify(userExists.password, password);
    if (!isPasswordMatch) {
      throw new BadRequestException(
        'User with credentials not found - password',
      );
    }
    const payload = { sub: userExists.id };
    const token = await this.jwtService.signAsync(payload);
    this.logger.log(`User with email ${dto.email} successfully signed in`);
    return {
      userExists,
      token,
    };
  }
}
