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

TRASH_KEYWORDS = ["sharknado","critters","birdemic","piranha","killer tomatoes", "rubber", "Killer Klowns", "Evil Dead", "terrifier"]

MIN_VOTE_COUNT = 200

@app.get("/api/sortear")
def sortear_filme(
    perfil: str = Query(..., regex="^(critica|bom-gosto|tanto-faz)$"),
    genero: str = Query(..., regex="^(acao|comedia|terror|suspense|drama|aventura|romance|scifi|surpresa)$"),
    anteriores: str = ""
):
    nota_min = PROFILE_RATINGS.get(perfil, 0)
    anteriores_ids = set(int(x) for x in anteriores.split(",") if x.isdigit())

    print(f"\nDEBUG: Parâmetros recebidos - perfil: {perfil}, genero: {genero}, nota_min: {nota_min}, anteriores: {anteriores_ids}")

    filmes = []

    try:
        if genero == "surpresa":
            print("DEBUG: Modo TRASH ativado!")
            results = []
            for keyword in TRASH_KEYWORDS:
                print(f"DEBUG: Buscando keyword: {keyword}")
                search = tmdb.Search()
                response = search.movie(query=keyword)
                print(f"DEBUG: {len(search.results)} resultados para {keyword}")
                results += search.results
            seen = set()
            filtered = []
            for movie in results:
                if (
                    movie['id'] not in seen
                    and movie.get('vote_count', 0) >= MIN_VOTE_COUNT
                ):
                    filtered.append(movie)
                    seen.add(movie['id'])
            filmes = filtered
            print(f"DEBUG: {len(filmes)} filmes 'trash' após filtro de nota e votos")
        else:
            genre_id = GENRES[genero]
            filmes = []
            page = 1
            max_pages = 3
            while len(filmes) < 30 and page <= max_pages:
                discover = tmdb.Discover()
                response = discover.movie(
                    with_genres=genre_id,
                    vote_average_gte=nota_min,
                    vote_count_gte=MIN_VOTE_COUNT,
                    sort_by="popularity.desc",
                    language="en-US",
                    page=page
                )
                print(f"DEBUG: Página {page} - {len(discover.results)} resultados brutos do TMDB")
                page_filmes = [
                    f for f in discover.results
                    if f.get('vote_average', 0) >= nota_min
                    and f.get('vote_count', 0) >= MIN_VOTE_COUNT
                    and f['id'] not in anteriores_ids
                ]
                print(f"DEBUG: Página {page} - {len(page_filmes)} filmes após filtro de nota/votos/anteriores")
                filmes += page_filmes
                page += 1

            print(f"DEBUG: Total filmes após busca e filtro: {len(filmes)}")

        
        filmes = [f for f in filmes if f['id'] not in anteriores_ids][:30]
        print(f"DEBUG: Filmes finais disponíveis para sorteio: {len(filmes)}")
        if not filmes:
            print("DEBUG: Nenhum filme encontrado para os filtros.")
            raise HTTPException(status_code=404, detail="Nenhum filme encontrado para este filtro.")

        filme = random.choice(filmes)
        print(f"DEBUG: Filme sorteado: {filme.get('title')} (ID {filme.get('id')})")

        
        providers_data = {}
        try:
            providers_resp = tmdb.Movies(filme["id"]).watch_providers()
            br_providers = providers_resp.get('results', {}).get('BR', {})
            flatrate = br_providers.get('flatrate', [])
            providers_data = [
                {
                    "provider_name": p.get("provider_name"),
                    "logo_path": f"https://image.tmdb.org/t/p/original{p.get('logo_path')}" if p.get("logo_path") else None
                }
                for p in flatrate
            ]
        except Exception as e:
            print(f"DEBUG: Falha ao buscar provedores: {e}")


        return {
            "id": filme["id"],
            "title": filme.get("title"),
            "poster_path": f"https://image.tmdb.org/t/p/w500{filme['poster_path']}" if filme.get("poster_path") else None,
            "vote_average": filme.get("vote_average"),
            "vote_count": filme.get("vote_count"),
            "overview": filme.get("overview"),
            "release_date": filme.get("release_date"),
            "providers": providers_data
        }
    except Exception as e:
        print("DEBUG: Exceção ao buscar filmes:", e)
        raise HTTPException(status_code=500, detail="Erro ao buscar filmes. Veja logs do servidor.")