using Application.Commons.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services
{
    public sealed class SocialAuthFactory : ISocialAuthFactory
    {
        private readonly IServiceProvider _serviceProvider;
        public SocialAuthFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public IExternalAuthService Get(string provider)
        {
            return provider.ToLower() switch
            {
                "google" => _serviceProvider.GetRequiredService<GoogleAuthService>(),
                // To-do: Add FacebookAuthService when implemented
                //"facebook" => _serviceProvider.GetRequiredService<FacebookAuthService>(),
                "zalo" => _serviceProvider.GetRequiredService<ZaloAuthService>(),
                _ => throw new ArgumentException("Invalid provider")
            };
        }
    }
}
