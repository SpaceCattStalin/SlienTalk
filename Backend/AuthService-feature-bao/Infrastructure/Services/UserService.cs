using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserInfo?> GetUserInfo(Guid userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());

                if (user == null)
                {
                    return null;
                }

                return new UserInfo
                {
                    Id = userId,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber,
                    ImgUrl = user.ImageUrl
                };
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<UpdateUserResponse> UpdateUser(Guid userId, UpdateUserRequest request)
        {

            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new UpdateUserResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Không tìm thấy người dùng này"
                    };
                }

                //user.Email = request.Email;
                user.Name = request.Name;
                user.PhoneNumber = request.PhoneNumber;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return new UpdateUserResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Lỗi không thể lưu thông tin người dùng này"
                    };
                }

                return new UpdateUserResponse
                {
                    IsSuccess = true,
                    Message = "Cập nhật thông tin thành công",
                    UserInfo = new UserInfo
                    {
                        Id = userId,
                        Name = user.Name,
                        PhoneNumber = user.PhoneNumber,
                        ImgUrl = user.ImageUrl
                    }
                };
            }
            catch (Exception ex)
            {
                return new UpdateUserResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UpdateUserResponse> UpdateUser(Guid userId, string imageUrl)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new UpdateUserResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Không tìm thấy người dùng này"
                    };
                }

                user.ImageUrl = imageUrl;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return new UpdateUserResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Lỗi không thể lưu hình ảnh cho người dùng này"
                    };
                }

                return new UpdateUserResponse
                {
                    IsSuccess = true,
                    Message = "Cập nhật thông tin thành công",
                    UserInfo = new UserInfo
                    {
                        Id = userId,
                        ImgUrl = user.ImageUrl
                    }
                };
            }
            catch (Exception ex)
            {
                return new UpdateUserResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
            ;
        }

        //public async Task<UpdateUserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest request)
        //{
        //    try
        //    {
        //        var user = await _userManager.FindByIdAsync(userId.ToString());
        //        if (user == null)
        //        {
        //            return new UpdateUserResponse
        //            {
        //                IsSuccess = false,
        //                ErrorMessage = "User not found"
        //            };
        //        }

        //        if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
        //        {
        //            var existingUser = await _userManager.FindByEmailAsync(request.Email);
        //            if (existingUser != null && existingUser.Id != userId)
        //            {
        //                return new UpdateUserResponse
        //                {
        //                    IsSuccess = false,
        //                    ErrorMessage = "Email already exists"
        //                };
        //            }
        //        }

        //        var updateResult = user.UpdateUserInfo(request.Name, request.Email, request.PhoneNumber);
        //        if (updateResult.IsFailed)
        //        {
        //            return new UpdateUserResponse
        //            {
        //                IsSuccess = false,
        //                ErrorMessage = string.Join(". ", updateResult.Errors.Select(e => e.Message))
        //            };
        //        }

        //        var identityResult = await _userManager.UpdateAsync(user);
        //        if (!identityResult.Succeeded)
        //        {
        //            return new UpdateUserResponse
        //            {
        //                IsSuccess = false,
        //                ErrorMessage = string.Join(". ", identityResult.Errors.Select(e => e.Description))
        //            };
        //        }

        //        return new UpdateUserResponse
        //        {
        //            IsSuccess = true,
        //            Message = "User information updated successfully",
        //            UserInfo = new UserInfo
        //            {
        //                Id = user.Id,
        //                Name = user.Name,
        //                Email = user.Email,
        //                PhoneNumber = user.PhoneNumber,
        //                UpdatedAt = user.UpdatedAt
        //            }
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error occurred while updating user with ID {UserId}", userId);
        //        return new UpdateUserResponse
        //        {
        //            IsSuccess = false,
        //            ErrorMessage = $"An error occurred while updating user information: {ex.Message}"
        //        };
        //    }
        //}
    }
}
