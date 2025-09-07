/**
 * Data Transfer Objects (DTOs) Exports
 *
 * This module exports base DTO classes and will export specific DTOs
 * when they are implemented. DTOs provide a stable contract between
 * the use case layer and external concerns.
 */

// Base DTO classes
export {
  BaseDto,
  BasePaginatedResponseDto,
  BaseRequestDto,
  BaseResponseDto,
} from './BaseDto';

// TODO: Add specific DTOs here when implemented
// Example:
// export { CreateUserRequestDto, CreateUserResponseDto } from './CreateUserDto';
// export { GetUserRequestDto, GetUserResponseDto } from './GetUserDto';
// export { ListUsersRequestDto, ListUsersResponseDto } from './ListUsersDto';
