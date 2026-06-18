# 1. Base Image (البيئة اللي هتشغل البروجيكت في النهاية)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# 2. Build Image (البيئة اللي هتعمل بيلد للكود)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# الشغل النضيف: ننسخ كل ملفات الـ csproj لمساراتها عشان نعمل Restore سليم
COPY ["Her Journey/Her Journey.csproj", "Her Journey/"]
COPY ["Persistence/Persistence.csproj", "Persistence/"]
COPY ["Presentation/Presentation.csproj", "Presentation/"]
COPY ["Services/Services.csproj", "Services/"]
COPY ["ServicesAbstraction/ServicesAbstraction.csproj", "ServicesAbstraction/"]
COPY ["DomainLayer/DomainLayer.csproj", "DomainLayer/"]
COPY ["Shared/Shared.csproj", "Shared/"]

# نعمل ريستور للمشروع الأساسي (وهو هيجيب كل المشاريع المربوطة بيه)
RUN dotnet restore "./Her Journey/Her Journey.csproj"

# ننسخ باقي ملفات الكود كلها
COPY . .

# ندخل جوه فولدر المشروع الأساسي عشان نعمل Build
WORKDIR "/src/Her Journey"
RUN dotnet build "./Her Journey.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 3. Publish Image (عشان نطلع النسخة النهائية المضغوطة)
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Her Journey.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 4. Final Stage (نجمع الشغل في الـ Image النهائية)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Her Journey.dll"]