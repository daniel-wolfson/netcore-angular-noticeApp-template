using NoticeAPI.Interfaces;
using NoticeAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient("Products",
    httpClient =>
    {
        var endpoint = builder.Configuration.GetSection($"AppConfig:Endpoint").Value;
        httpClient.BaseAddress = new Uri($"{endpoint}Products");
        httpClient.Timeout = TimeSpan.FromSeconds(10);
    })
    .ConfigurePrimaryHttpMessageHandler(provider =>
    {
        var handler = new HttpClientHandler();
        var env = provider.GetService<IWebHostEnvironment>();
        if (env != null && env.IsDevelopment())
            handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
        return handler;
    });

builder.Services.AddScoped<INoticeDataService, NoticeDataService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Notice API",
        Version = "v1",
        Description = "REST API for managing notice posts"
    });
    
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
    c.EnableAnnotations();
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Compie API v1");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
