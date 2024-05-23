import React, { useEffect, useState } from 'react';

function MeuComponente() {
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Adicionando o estado para controlar a página atual
    const [totalPages, setTotalPages] = useState(0); // Adicionando o estado para controlar o número total de páginas
    
    async function searchMovie(page = 1) { // Permitindo a busca por uma página específica
        const movieTitle = document.getElementById("movie-input").value;
        
        const omdbApiKey = "2d83b506";
        
        try {
            const omdbResponse = await fetch(`http://www.omdbapi.com/?s=${movieTitle}&page=${page}&apikey=${omdbApiKey}`); // Adicionando o parâmetro de página
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

                        countryImages.push({
                            country: countryName,
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
            setTotalPages(Math.ceil(searchData.totalResults / 10)); // Calculando o número total de páginas
        } catch (error) {
            console.error("Erro:", error);
        }
    }
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        searchMovie(pageNumber); // Chamar a função de busca com o número da página atual
    };
    
    // useEffect(() =>{
    //     const passaPagina = document.getElementsByClassName("pagination")
    //     if(passaPagina) {
    //         if (passaPagina.hasAttribute('hidden')) {
    //             passaPagina.removeAttribute('hidden')
    //             alert('deu boa!')
    //         }
    //     }
    // })
    return (
        <div>
            <header>
                <div className="container">
                    <h1>Localizador de Filmes</h1>
                    <div className="search-container">
                        <input type="text" id="movie-input" placeholder="Digite o título do filme ou programa de TV" />
                        <button onClick={() => { handlePageChange(1) }}>Buscar</button>
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
                        <p><strong>Duração:</strong> {result.movieData.Runtime}</p>
                        <img src={result.movieData.Poster} alt={result.movieData.Title + " Poster"} />
                        <hr />
                    </div>
                ))}
            </div>
            <div className="pagination" hidden>
                <button onClick={() => { handlePageChange(currentPage - 1) }} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span> {/* Mostrando o número da página atual e o número total de páginas */}
                <button onClick={() => { handlePageChange(currentPage + 1) }} disabled={currentPage === totalPages}>Próxima</button>
            </div>
        </div>
    );
    
}

export default MeuComponente;