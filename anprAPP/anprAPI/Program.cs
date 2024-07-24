using anprAPI.Common;
using anprAPI.Hubs;
using anprAPI.Mappings;
using anprAPI.Models.Domain;
using anprAPI.Repositories.RepositoriesImpl;
using anprAPI.Services.IServices;
using anprAPI.Services.ServicesImpl;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins(allowedOrigins)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://localhost:7145")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
});
});*/

builder.Services.AddSignalR();

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddLogging(config =>
{
    config.AddDebug();
    config.AddConsole();
});

builder.Services.AddSingleton(provider => {
    var data = JSON.Load<Data>();
    DataSeeder.SeedData(data);
    Console.WriteLine(data.ToString());

    return data;
});


builder.Services.AddSingleton<ICameraRepository, CameraRepository>();
builder.Services.AddSingleton<IDetectionRepository, DetectionRepository>();
builder.Services.AddSingleton<ICameraManagerService, CameraManagerService>();

builder.Services.AddSingleton<DetectionManagerService>();
builder.Services.AddSingleton<IDetectionManagerService>(provider => provider.GetRequiredService<DetectionManagerService>());
builder.Services.AddHostedService(provider => provider.GetRequiredService<DetectionManagerService>());

//builder.Services.AddSingleton<IDetectionService, DetectionService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.MapHub<StreamHub>("/jpegHub");

app.MapHub<DetectionHub>("/detectionHub");

app.Run();
