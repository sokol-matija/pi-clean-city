using CleanCity.Core.Helpers;

namespace CleanCity.Tests.Helpers
{
    public class StatusMetadataAttributeTests
    {
        [Fact]
        public void Constructor_ShouldSetPropertiesCorrectly()
        {
            // Arrange
            var description = "Test";
            var backgroundColor = "#FFFFFF";
            var strokeColor = "#000000";

            // Act
            var attribute = new StatusMetadataAttribute(description, backgroundColor, strokeColor);

            // Assert
            Assert.Equal(description, attribute.Description);
            Assert.Equal(backgroundColor, attribute.BackgroundColor);
            Assert.Equal(strokeColor, attribute.StrokeColor);
        }
    }
}
