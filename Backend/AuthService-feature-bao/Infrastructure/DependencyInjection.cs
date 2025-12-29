using Application.Commons.Interfaces.Repositories;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.External;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;


namespace Infrastructure
{
    public static class DependencyInjection
    {
        /// <summary>
        ///  Registers infrastructure-level services such as the database context and ASP.NET Core Identity.
        /// </summary>
        /// <param name="builder">The application host builder, used for configuring services and accessing configuration.</param>
        public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
        {
            var logger = LoggerFactory
               .Create(logging =>
               {
                   logging.AddConsole();
                   logging.SetMinimumLevel(LogLevel.Debug);
               })
               .CreateLogger("InfrastructureSetup");

            //Get the connection string from configuration or environment variables
            //var connectionString = builder.Configuration["ConnectionString:DefaultConnection"]
            //        ?? Environment.GetEnvironmentVariable("ConnectionString:DefaultConnection");
            var connectionString =
                builder.Configuration.GetConnectionString("DefaultConnection") ??
                builder.Configuration["ConnectionStrings:DefaultConnection"] ??
                Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection") ??
                Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");


            //var connectionString =
            //    builder.Configuration.GetConnectionString("DefaultConnection") ??
            //    builder.Configuration["ConnectionStrings:DefaultConnection"] ??
            //    Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection");
            //Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

            //if (string.IsNullOrEmpty(connectionString))
            //{
            //    logger.LogError("❌ Connection string not found! Check appsettings.json or Docker environment variables.");
            //}
            //else
            //{
            //    logger.LogInformation("✅ Connection string loaded successfully.");
            //}

            logger.LogInformation($"--- DATABASE CONNECTION ATTEMPT ---");
            logger.LogDebug($"Connection string: {connectionString}");
            logger.LogInformation($"--- DATABASE CONNECTION ATTEMPT END ---");

            // Register the ApplicationDbContext with EF Core, using SQL Server as the provider.
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });

            // Register ASP.NET Core Identity with custom User entity and GUID as the primary key type.
            // Adds EF Core stores for persisting identity data and default token providers for features like password reset.
            builder.Services.AddIdentity<User, IdentityRole<Guid>>()
                       .AddEntityFrameworkStores<ApplicationDbContext>()
                       .AddDefaultTokenProviders();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<UserManager<User>>();
            builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            builder.Services.AddScoped<IUserPlanRepository, UserPlanRepository>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

            builder.Services.AddScoped<ITokenHasher, TokenHasher>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<ICollectionService, CollectionService>();

            builder.Services.AddScoped<GoogleAuthService>();
            builder.Services.AddScoped<ZaloAuthService>();
            builder.Services.AddScoped<ISocialAuthFactory, SocialAuthFactory>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserPlanService, UserPlanService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddHttpClient<IZaloPayClient, ZaloPayClient>();


            //builder.Services.Configure<IdentityOptions>(options =>
            //{
            //    // Password settings.
            //    options.Password.RequireDigit = false;
            //    options.Password.RequireLowercase = false;
            //    options.Password.RequireNonAlphanumeric = false;
            //    options.Password.RequireUppercase = false;
            //    options.Password.RequiredLength = 0;
            //    options.Password.RequiredUniqueChars = 0;
            //});
        }
    }
}
