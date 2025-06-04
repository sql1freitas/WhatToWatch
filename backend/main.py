import os
import random
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import tmdbsimple as tmdb

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY não definida no .env")

tmdb.API_KEY = TMDB_API_KEY

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


PROFILE_RATINGS = {
    "critica": 8.0,
    "bom-gosto": 6.5,
    "tanto-faz": 5.5
}


GENRES = {
    "acao": 28,
    "comedia": 35,
    "terror": 27,
    "suspense": 53,
    "drama": 18,
    "aventura": 12,
    "romance": 10749,
    "scifi": 878,
    "surpresa": "trash"
}


TRASH_KEYWORDS = ["trash", "bad movie", "cult", "so bad it's good"]

@app.get("/api/sortear")
def sortear_filme(
    perfil: str = Query(..., regex="^(critica|bom-gosto|tanto-faz)$"),
    genero: str = Query(..., regex="^(acao|comedia|terror|suspense|drama|aventura|romance|scifi|surpresa)$"),
    anteriores: str = ""
):
    nota_min = PROFILE_RATINGS[perfil]
    anteriores_ids = set(int(x) for x in anteriores.split(",") if x.isdigit())

    
    if genero == "surpresa":
        
        results = []
        for keyword in TRASH_KEYWORDS:
            search = tmdb.Search()
            response = search.movie(query=keyword)
            results += search.results
        
        seen = set()
        filtered = []
        for movie in results:
            if movie['id'] not in seen and movie.get('vote_average', 0) >= nota_min:
                filtered.append(movie)
                seen.add(movie['id'])
        filmes = filtered
    else:
        genre_id = GENRES[genero]
        discover = tmdb.Discover()
        response = discover.movie(
            with_genres=genre_id,
            vote_average_gte=nota_min,
            sort_by="popularity.desc",
            language="pt-BR"
        )
        filmes = [f for f in discover.results if f.get('vote_average', 0) >= nota_min]

    
    filmes = [f for f in filmes if f['id'] not in anteriores_ids][:30]
    if not filmes:
        raise HTTPException(status_code=404, detail="Nenhum filme encontrado para este filtro.")

    filme = random.choice(filmes)
    return {
        "id": filme["id"],
        "title": filme.get("title"),
        "poster_path": f"https://image.tmdb.org/t/p/w500{filme['poster_path']}" if filme.get("poster_path") else None,
        "vote_average": filme.get("vote_average"),
        "overview": filme.get("overview"),
        "release_date": filme.get("release_date")
    }