import React, { useState } from 'react';

function MeuComponente() {
    const [searchResults, setSearchResults] = useState([]);

    async function searchMovie() {
        const movieTitle = document.getElementById("movie-input").value;
        const omdbApiKey = "2d83b506";
    
        try {
            const omdbResponse = await fetch(`http://www.omdbapi.com/?s=${movieTitle}&apikey=${omdbApiKey}`);
            const searchData = await omdbResponse.json();
    
            if (!searchData || searchData.Response === "False") {
                throw new Error("Filmes não encontrados");
            }
    
            const results = [];
    
            for (const movie of searchData.Search) {
                const imdbID = movie.imdbID;
                const movieResponse = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
                const movieData = await movieResponse.json();
    
                const countries = movieData.Country.split(',').map(country => country.trim());
                const countryImages = [];
    
                for (const country of countries) {
                    try {
                        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${country}`);
                        const countryData = await countryResponse.json();
                        const countryName = countryData[0].name.common;
    
                        // Removido o trecho de código relacionado ao Unsplash
                        // const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${countryName}`);
                        // const unsplashData = await unsplashResponse.json();
    
                        // Devido à remoção do código do Unsplash, removi a referência a unsplashData
                        // if (unsplashData.results.length > 0) {
                        //     countryImages.push({
                        //         country: countryName,
                        //         imageUrl: unsplashData.results[0].urls.regular
                        //     });
                        // } else {
                        //     console.log(`Imagem para ${countryName} não encontrada`);
                        // }
    
                        // Como o código do Unsplash foi removido, só adicionamos o nome do país e uma imagem genérica
                        countryImages.push({
                            country: countryName,
                            // Adicione uma URL de imagem genérica ou deixe imageUrl como null, dependendo do seu caso
                            // imageUrl: 'URL_DA_IMAGEM_GENÉRICA' ou imageUrl: null
                        });
                    } catch (error) {
                        console.error(`Erro ao buscar informações do país ${country}:`, error);
                    }
                }
    
                results.push({
                    movieData: movieData,
                    countryImages: countryImages
                });
            }
    
            setSearchResults(results);
        } catch (error) {
            console.error("Erro:", error);
        }
    }
    

    return (
        <div>
            <header>
                <div className="container">
                    <h1>Localizador de Filmes</h1>
                    <div className="search-container">
                        <input type="text" id="movie-input" placeholder="Digite o título do filme ou programa de TV" />
                        <button onClick={searchMovie}>Buscar</button>
                    </div>
                </div>
            </header>
            <div id="result-container">
                {searchResults.map((result, index) => (
                    <div key={index}>
                        <h2>{result.movieData.Title}</h2>
                        <p><strong>Lançamento:</strong> {result.movieData.Released}</p>
                        <p><strong>Gênero:</strong> {result.movieData.Genre}</p>
                        <p><strong>Enredo:</strong> {result.movieData.Plot}</p>
                        <img src={result.movieData.Poster} alt={result.movieData.Title + " Poster"} />
                        {/* Removido o contêiner de imagem e o mapeamento das imagens */}
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MeuComponente;
