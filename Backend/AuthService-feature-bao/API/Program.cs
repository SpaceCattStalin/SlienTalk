using API;
using Infrastructure;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

Console.OutputEncoding = System.Text.Encoding.UTF8;

// Register infrastructure services (DbContext, Identity, etc.)
builder.AddInfrastructureServices();

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

// Register controller support
//builder.Services.AddControllers();
//builder.Services.AddControllers().AddNewtonsoftJson();

//builder.Services.AddHostedService<SimpleHttpServerService>();

// Register API documentation & explorer
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\n\nExample: \"Bearer abc123\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()    // Allow requests from any domain
            .AllowAnyMethod()    // Allow GET, POST, PUT, DELETE, etc.
            .AllowAnyHeader();   // Allow all headers
    });
});
var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];
var secret = builder.Configuration["Jwt:SecretKey"];

Console.WriteLine($"AZURE JWT DEBUG => Issuer={issuer}, Audience={audience}, KeyLength={secret?.Length}");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? throw new Exception("Empty")))
        };
    });
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("ApiScope", policy =>
//    {
//        policy.RequireAuthenticatedUser();
//        policy.RequireClaim("scope", "api");
//    });
//});
builder.Services.AddAuthorization();
builder.Services.AddHttpClient();

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".glb"] = "model/gltf-binary";

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// Enable Swagger UI in development environment
if (app.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();

    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(
//        Path.Combine(Directory.GetCurrentDirectory(), "Images")),
//    RequestPath = "/Images"
//});

//var env = app.Services.GetRequiredService<IWebHostEnvironment>();

//string imagesPath = Path.Combine(env.ContentRootPath, "wwwroot", "Images");

//if (!Directory.Exists(imagesPath))
//{
//    Directory.CreateDirectory(imagesPath);
//}

//var fileProvider = new PhysicalFileProvider(imagesPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Static")),
    RequestPath = "/static",
    ContentTypeProvider = provider
});

// Enforce HTTPS redirection
app.UseHttpsRedirection();
app.UseRouting();
// Enable authentication middleware
app.UseAuthentication();
// Enable authorization middleware
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Start the application
app.Run();

