
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ModawantyAPI.Configuration;
using ModawantyAPI.Middleware;
using ModawantyBLL.IService;
using ModawantyBLL.Service;
using ModawantyDAL.Contracts;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using System.Globalization;
using System.Text;

namespace ModawantyAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddLocalization();

            // Add exception handling middleware
            builder.Services.AddExceptionHandler<GlobalExceptionHandlingMiddleware>();
            builder.Services.AddProblemDetails();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // DB
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("ProductionConnection")));

            // Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            #region JWT Authentication Configuration
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,

                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });
            #endregion
            builder.Services.AddAuthorization();

            //Add Cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("LiveCors", policy =>
                {
                    policy.WithOrigins("https://tareekhalshoob.com/")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            

            //Add HangFire
            builder.Services.AddHangfire(config =>
            config.UseSqlServerStorage(builder.Configuration.GetConnectionString("ProductionConnection"),
                new SqlServerStorageOptions
                {
                    SchemaName = "Hangfire", // optional but recommended
                    PrepareSchemaIfNecessary = true
                }));
            builder.Services.AddHangfireServer();


            //register custom services

            builder.Services.Configure<JwtSettings>(
                     builder.Configuration.GetSection("Jwt"));

            builder.Services.Configure<CloudinarySettings>(
                     builder.Configuration.GetSection("Cloudinary"));

            builder.Services.Configure<CloudflareR2Settings>(
                     builder.Configuration.GetSection("Cloudflare:R2"));

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IEmailService, BrevoEmailService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IArticleService, ArticleService>();
            builder.Services.AddScoped<ITagService, TagService>();
            builder.Services.AddScoped<IImageService, ImageService>();
            builder.Services.AddScoped<ICommentService, CommentService>();
            builder.Services.AddScoped<IPdfUploadService, PdfUploadR2Service>();
            builder.Services.AddScoped<IBookService, BookService>();
            builder.Services.AddScoped<IProfileService, ProfileService>();
            builder.Services.AddScoped<IAuthorService, AuthorService>();
            builder.Services.AddScoped<IStatisticsService, StatisticsService>();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddSingleton<ExceptionMessageLocalizer>();
            builder.Services.AddHttpClient<IEmailService, BrevoEmailService>();


            var app = builder.Build();

            var supportedCultures = new[]
            {
                new CultureInfo("en"),
                new CultureInfo("ar")
            };

            var localizationOptions = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            };

            localizationOptions.RequestCultureProviders =
            [
                new QueryStringRequestCultureProvider(),
                new AcceptLanguageHeaderRequestCultureProvider()
            ];

            // Add exception handling middleware to the pipeline
            app.UseExceptionHandler();
            app.UseRequestLocalization(localizationOptions);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseHangfireDashboard("/hangfire");

                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Angular fallback (IMPORTANT)
            //app.MapFallbackToFile("index.html");
            app.MapFallbackToFile("/app/{*path:nonfile}", "app/index.html");

            app.UseCors("LiveCors");

            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
