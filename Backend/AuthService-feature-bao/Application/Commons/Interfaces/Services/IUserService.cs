using Application.Commons.DTOs;

namespace Application.Commons.Interfaces.Services
{
    public interface IUserService
    {
        Task<UpdateUserResponse> UpdateUser(Guid userId, UpdateUserRequest request);
        Task<UpdateUserResponse> UpdateUser(Guid userId, string imageUrl);

        Task<UserInfo?> GetUserInfo(Guid userId);
    }
}
