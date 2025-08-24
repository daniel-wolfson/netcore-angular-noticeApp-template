using Xunit;
using NoticeAPI.Services;
using NoticeAPI.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

public class NoticeDataServiceTests
{
    private readonly NoticeDataService _service;
    private readonly Mock<ILogger<NoticeDataService>> _loggerMock = new();
    private readonly Mock<IConfiguration> _configMock = new();

    public NoticeDataServiceTests()
    {
        _configMock.Setup(c => c.GetSection("ApiConfig:NoticeDataPath").Value)
                   .Returns("TestData/notices.json");
        _service = new NoticeDataService(_configMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAllNoticesAsync_ReturnsList()
    {
        var result = await _service.GetAllNoticesAsync();
        Assert.NotNull(result);
        Assert.IsType<List<Notice>>(result);
    }
}