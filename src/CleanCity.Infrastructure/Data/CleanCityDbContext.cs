using Microsoft.EntityFrameworkCore;
using CleanCity.Domain.Entities;
using CleanCity.Domain.Enums;

namespace CleanCity.Infrastructure.Data;

public class CleanCityDbContext : DbContext
{
    public CleanCityDbContext(DbContextOptions<CleanCityDbContext> options) : base(options)
    {
        //empty    
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CityService> CityServices { get; set; }
    public DbSet<GeoLocation> GeoLocations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //User conf
        modelBuilder.Entity<User>(entity =>
        {
            entity. HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity. HasIndex(e => e.Email).IsUnique();
        });

        // Ticket conf
        modelBuilder.Entity<Ticket>(entity =>
        {
            entity. HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e. Description).HasMaxLength(2000);

            entity.HasOne(e => e. CreatedBy)
                .WithMany(u => u.CreatedTickets)
                .HasForeignKey(e => e.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Tickets)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior. Restrict);

            entity.HasOne(e => e. AssignedToService)
                .WithMany(s => s. AssignedTickets)
                .HasForeignKey(e => e.AssignedToServiceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Location)
                .WithOne(l => l.Ticket)
                .HasForeignKey<GeoLocation>(l => l.TicketId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        //Category conf
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        //CityService conf
        modelBuilder.Entity<CityService>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        //GeoLocaiton conf
        modelBuilder.Entity<GeoLocation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Address).HasMaxLength(300);
        });

        //Seed
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        //Seed categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Road Damage", Description = "Potholes, cracks" },
            new Category { Id = 2, Name = "Waste Management", Description = "Garbage, recycling" },
            new Category { Id = 3, Name = "Street Lighting", Description = "Broken lights" },
            new Category { Id = 4, Name = "Graffiti", Description = "Vandalism" }
        );

        //Seed CityServices
        modelBuilder.Entity<CityService>().HasData(
            new CityService { Id = 1, Name = "Roads Team", Email = "roads@city.com", PhoneNumber = "123-456" },
            new CityService { Id = 2, Name = "Garbage Team", Email = "garbage@city.com", PhoneNumber = "123-457" },
            new CityService { Id = 3, Name = "Lighting Team", Email = "lighting@city.com", PhoneNumber = "123-458" }
        );

        //Seed Admin user 
        modelBuilder.Entity<User>().HasData(
            new User 
            { 
                Id = 1, 
                Email = "admin@cleancity.com",
                FirstName = "Admin",
                LastName = "User",
                PasswordHash = "TempPasswordHash", //fix this after adding JWT
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.Now
            }
        );
    }
}