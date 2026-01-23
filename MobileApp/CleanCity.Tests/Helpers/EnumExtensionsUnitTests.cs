using System;
using CleanCity.Core.Helpers;
using CleanCity.Core.Models;

namespace CleanCity.Tests.Helpers
{
    // Define a test-specific attribute and enum for testing purposes
    public class MyTestAttribute : Attribute
    {
        public string Info { get; }
        public MyTestAttribute(string info) { Info = info; }
    }

    public enum MyTestEnum
    {
        [MyTest("HasAttribute")]
        WithAttribute,

        WithoutAttribute
    }

    public class EnumExtensionsUnitTests
    {
        [Fact]
        public void GetAttribute_ShouldReturnAttribute_WhenAttributeExists()
        {
            // Arrange
            var enumValue = MyTestEnum.WithAttribute;

            // Act
            var result = enumValue.GetAttribute<MyTestAttribute>();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("HasAttribute", result.Info);
        }

        [Fact]
        public void GetAttribute_ShouldReturnNull_WhenAttributeDoesNotExist()
        {
            // Arrange
            var enumValue = MyTestEnum.WithoutAttribute;

            // Act
            var result = enumValue.GetAttribute<MyTestAttribute>();

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetAttribute_ShouldReturnRealAttribute_FromReportStatusEnum()
        {
            // Arrange
            var enumValue = ReportStatus.Zaprimljeno;

            // Act
            var result = enumValue.GetAttribute<StatusMetadataAttribute>();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("zaprimljeno", result.Description);
            Assert.Equal("#FFE0B2", result.BackgroundColor);
            Assert.Equal("#E65100", result.StrokeColor);
        }

        [Fact]
        public void GetAttribute_ShouldReturnNull_ForInvalidEnumValue()
        {
            // Arrange
            // Cast an integer to an enum type that has no corresponding member.
            // This results in an enum value for which GetField() will return null.
            var invalidEnumValue = (MyTestEnum)999;

            // Act
            var result = invalidEnumValue.GetAttribute<MyTestAttribute>();

            // Assert
            Assert.Null(result);
        }
    }
}
