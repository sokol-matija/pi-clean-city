using CleanCity.Core.Interfaces.Services;
using CleanCity.Core.Models;
using CleanCity.Core.Services.Decorators;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanCity.Tests.Services.Decorators
{
    public class LoggingReportServiceDecoratorUnitTests
    {
        private readonly Mock<IReportService> _mockWrappedService;
        private readonly LoggingReportServiceDecorator _decorator;

        public LoggingReportServiceDecoratorUnitTests()
        {
            _mockWrappedService = new Mock<IReportService>();
            _decorator = new LoggingReportServiceDecorator(_mockWrappedService.Object);
        }

        [Fact]
        public async Task GetReportsAsync_ShouldCallWrappedService()
        {
            // Arrange
            _mockWrappedService.Setup(s => s.GetReportsAsync()).ReturnsAsync(new List<Report>());

            // Act
            await _decorator.GetReportsAsync();

            // Assert
            _mockWrappedService.Verify(s => s.GetReportsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetReportByIdAsync_ShouldCallWrappedService()
        {
            // Arrange
            var id = 1;
            _mockWrappedService.Setup(s => s.GetReportByIdAsync(id)).ReturnsAsync((Report)null);

            // Act
            await _decorator.GetReportByIdAsync(id);

            // Assert
            _mockWrappedService.Verify(s => s.GetReportByIdAsync(id), Times.Once);
        }

        [Fact]
        public async Task AddReportAsync_ShouldCallWrappedService()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.AddReportAsync(report)).ReturnsAsync(true);

            // Act
            await _decorator.AddReportAsync(report);

            // Assert
            _mockWrappedService.Verify(s => s.AddReportAsync(report), Times.Once);
        }

        [Fact]
        public async Task UpdateReportAsync_ShouldCallWrappedService()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.UpdateReportAsync(report)).ReturnsAsync(true);

            // Act
            await _decorator.UpdateReportAsync(report);

            // Assert
            _mockWrappedService.Verify(s => s.UpdateReportAsync(report), Times.Once);
        }

        [Fact]
        public async Task DeleteReportAsync_ShouldCallWrappedService()
        {
            // Arrange
            var id = 1;
            _mockWrappedService.Setup(s => s.DeleteReportAsync(id)).ReturnsAsync(true);

            // Act
            await _decorator.DeleteReportAsync(id);

            // Assert
            _mockWrappedService.Verify(s => s.DeleteReportAsync(id), Times.Once);
        }

        [Fact]
        public void FormatReportForDisplay_ShouldCallWrappedService()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.FormatReportForDisplay(report)).Returns("");

            // Act
            _decorator.FormatReportForDisplay(report);

            // Assert
            _mockWrappedService.Verify(s => s.FormatReportForDisplay(report), Times.Once);
        }

        [Fact]
        public async Task GetReportsAsync_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            _mockWrappedService.Setup(s => s.GetReportsAsync()).ThrowsAsync(new InvalidOperationException("Test Exception"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _decorator.GetReportsAsync());
        }

        [Fact]
        public async Task GetReportByIdAsync_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            var id = 1;
            _mockWrappedService.Setup(s => s.GetReportByIdAsync(id)).ThrowsAsync(new ArgumentException("Test Exception"));

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _decorator.GetReportByIdAsync(id));
        }

        [Fact]
        public async Task AddReportAsync_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.AddReportAsync(report)).ThrowsAsync(new InvalidOperationException("Test Exception"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _decorator.AddReportAsync(report));
        }

        [Fact]
        public async Task UpdateReportAsync_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.UpdateReportAsync(report)).ThrowsAsync(new InvalidOperationException("Test Exception"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _decorator.UpdateReportAsync(report));
        }

        [Fact]
        public async Task DeleteReportAsync_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            var id = 1;
            _mockWrappedService.Setup(s => s.DeleteReportAsync(id)).ThrowsAsync(new InvalidOperationException("Test Exception"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _decorator.DeleteReportAsync(id));
        }

        [Fact]
        public void FormatReportForDisplay_ShouldPropagateException_WhenWrappedServiceThrows()
        {
            // Arrange
            var report = new Report();
            _mockWrappedService.Setup(s => s.FormatReportForDisplay(report)).Throws(new InvalidOperationException("Test Exception"));

            // Act & Assert
            Assert.Throws<InvalidOperationException>(() => _decorator.FormatReportForDisplay(report));
        }
    }
}
