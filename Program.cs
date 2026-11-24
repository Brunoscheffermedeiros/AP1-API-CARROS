using ApiCarros.Models;
using ApiCarros.Dtos;
using ApiCarros.Data;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApiDbContext> (options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// ↑ criou a lista

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { mensagem = "Ocorreu um erro interno no servidor." });
    });
});


var carros = new List<CarroDto>
{
    new CarroDto(1, "Fox", 2014, "Branco"),
    new CarroDto(2, "Gol", 2010, "Preto")
};

app.MapGet("/",() => "Api dos carros está no ar!");

app.MapGet("/api/carros", async (ApiDbContext db) =>
{
    var carros = await db.Carros.ToListAsync();
    return Results.Ok(carros);

});

app.MapGet("/api/carros/{id:int}", async (int id, ApiDbContext db) =>
{
    var carro = await db.Carros.FirstOrDefaultAsync(carroDaLista => carroDaLista.Id == id);

    if (carro is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(carro);

});

app.MapPost("/api/carros", async (CarroEntity dados, ApiDbContext db) =>
{

    db.Carros.Add(dados);
    await db.SaveChangesAsync();
    return Results.Created($"/api/carros/{dados.Id}", dados);
    
});

app.MapPut("/api/carros/{id:int}", async (int id, CarroEntity dados, ApiDbContext db) =>
{
    var carro = await db.Carros.FindAsync(id);

    if (carro is null)
    {
        return Results.NotFound();
    }
    carro.Ano = dados.Ano;
    carro.Modelo = dados.Modelo;
    carro.Cor = dados.Cor;
    await db.SaveChangesAsync();
    return Results.Ok(carro);
    
});

app.MapDelete("/api/carros/{id:int}", async (int id, ApiDbContext db) =>
{
    var carro = await db.Carros.FindAsync(id);
    if (carro is null) return Results.NotFound();
    db.Carros.Remove(carro);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    dbContext.Database.Migrate();
}

app.Run();