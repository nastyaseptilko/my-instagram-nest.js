import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth controller')
@Controller('/')
export class AuthController {}
