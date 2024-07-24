using anprAPI.Models.Domain;
using anprAPI.Models.DTO;
using AutoMapper;
using Stream = anprAPI.Models.Domain.Stream;

namespace anprAPI.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Camera, CameraDto>()
                .ForMember(dto => dto.Url, conf => conf.MapFrom(cam => cam.Stream.Url));

            CreateMap<AddCameraDto, Camera>()
                .ForMember(cam => cam.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(cam => cam.Stream, opt => opt.MapFrom(dto => new Stream( dto.Url, "HD" )));


            CreateMap<Detector, DetectorDto>()
                .ForMember(dto => dto.CameraId, opt => opt.MapFrom(det => det.Camera != null ? det.Camera.Id : (Guid?)null));

        }
    }
}
