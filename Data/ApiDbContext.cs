namespace ApiCarros.Data;
using Microsoft.EntityFrameworkCore;
using ApiCarros.Models;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions <ApiDbContext> options) : base(options)
    {
        
    }
    public DbSet<CarroEntity> Carros => Set<CarroEntity> ();
}