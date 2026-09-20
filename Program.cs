var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// ↑ criou a lista


var carros = new List<CarroDto>
{
    new CarroDto(1, "Fox", 2014, "Branco"),
    new CarroDto(2, "Gol", 2010, "Preto")
};

app.MapGet("/", () => "Api dos carros está no ar!");

app.MapGet("/api/carros", () =>
{
    return Results.Ok(carros);
});

app.MapGet("/api/carros/{id:int}", (int id) =>
{
    var carro = carros.Find(carroDaLista => carroDaLista.Id == id);

    if (carro is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(carro);

});

app.MapPost("/api/carros", (CarroEntradaDto dados) =>
{
    int proximoId = carros.Count + 1;

    var novoCarro = new CarroDto(proximoId, dados.Modelo, dados.Ano, dados.Cor);

    carros.Add(novoCarro);

    return Results.Created($"/api/carros/{novoCarro.Id}", novoCarro);
    
});

app.MapPut("/api/carros/{id:int}", (int id, CarroEntradaDto dados) =>
{
    var indice = carros.FindIndex(carroDaLista => carroDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var carroAtualizado = new CarroDto(id, dados.Modelo, dados.Ano, dados.Cor);

    carros[indice] = carroAtualizado;

    return Results.Ok(carroAtualizado);

});

app.MapDelete("/api/carros/{id:int}", (int id) =>
{
    var indice = carros.FindIndex(carroDaLista => carroDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }
    
    carros.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();


record CarroDto(int Id, string Modelo, int Ano, string Cor);
record CarroEntradaDto(string Modelo, int Ano, string Cor);