﻿using BooksAPI.Data;
using BooksAPI.Data.Entities;
using BooksAPI.ViewModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JWTConfig>(Configuration.GetSection("JWTConfig"));

            services.AddDbContext<AppDBContext>(
                opt =>
                {
                    opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                }
            );

            services
                .AddIdentity<User, IdentityRole>(opt => { })
                .AddEntityFrameworkStores<AppDBContext>();

            services
                .AddAuthentication(
                    x =>
                    {
                        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    }
                )
                .AddJwtBearer(
                    options =>
                    {
                        var key = Encoding.ASCII.GetBytes(Configuration["JWTConfig:Key"]);
                        var issuer = Configuration["JWTConfig:Issuer"];
                        var audience = Configuration["JWTConfig:Audience"];
                        options.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(key),
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            RequireExpirationTime = true,
                            ValidIssuer = issuer,
                            ValidAudience = audience
                        };
                    }
                );

            services.AddControllers();
            services.AddSwaggerGen(
                c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BooksAPI", Version = "v1" });
                }
            );

            services.AddCors(
                options =>
                {
                    options.AddPolicy(
                        "CorsPolicy",
                        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
                    );
                }
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BooksAPI v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(
                endpoints =>
                {
                    endpoints.MapControllers();
                }
            );
        }
    }
}
