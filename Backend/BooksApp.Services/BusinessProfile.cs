using AutoMapper;
using BooksApp.Data.Entities;
using BooksApp.Services.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksApp.Services
{
    public class BusinessProfile : Profile
    {
        public BusinessProfile()
        {
            CreateMap<BookEntity, BookModel>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                 .ReverseMap()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<CategoryEntity, CategoryModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CategoryId.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));
            
            CreateMap<UserEntity, UserModel>().ReverseMap();
            CreateMap<RegisterModel, UserEntity>()
                   .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                   .ForMember(dest => dest.DateCreated, opt => opt.Ignore())
                   .ForMember(dest => dest.DateModified, opt => opt.Ignore());

            CreateMap<RoleEntity, RoleModel>().ReverseMap();

            CreateMap<IdentityRole, RoleModel>()
                    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));
        }

    }
}
