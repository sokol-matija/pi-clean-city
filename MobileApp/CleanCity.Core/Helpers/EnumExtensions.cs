using System;
using System.Reflection;

namespace CleanCity.Core.Helpers
{
    public static class EnumExtensions
    {
        public static T GetAttribute<T>(this Enum enumValue) where T : Attribute
        {
            FieldInfo field = enumValue.GetType().GetField(enumValue.ToString());
            if (field == null)
                return null;

            return field.GetCustomAttribute<T>();
        }
    }
}
