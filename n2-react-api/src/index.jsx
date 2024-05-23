import React, { useState } from 'react';

function MeuComponente() {
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    async function searchMovie(page = 1) {
        const movieTitle = document.getElementById("movie-input").value;
        const omdbApiKey = "2d83b506";
    
        try {
            const omdbResponse = await fetch(`http://www.omdbapi.com/?s=${movieTitle}&page=${page}&apikey=${omdbApiKey}`);
            const searchData = await omdbResponse.json();
    
            if (!searchData || searchData.Response === "False") {
                throw new Error("Filmes não encontrados");
            }
    
            const results = await Promise.all(searchData.Search.map(async (movie) => {
                const imdbID = movie.imdbID;
                const movieResponse = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
                const movieData = await movieResponse.json();
                return movieData;
            }));
    
            setSearchResults(results);
            setTotalPages(Math.ceil(searchData.totalResults / 10));
        } catch (error) {
            console.error("Erro:", error);
        }
    }
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        searchMovie(pageNumber);
    };
    
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
                    <div key={index} className="movie-container">
                        <img src={result.Poster} alt={`${result.Title} Poster`} />
                        <div className="movie-details">
                            <h2>{result.Title}</h2>
                            <p><strong style={{ color: '#E61D00' }}>Lançamento:</strong> {result.Released}</p>
                            <p><strong style={{ color: '#E61D00' }}>Gênero:</strong> {result.Genre}</p>
                            <p><strong style={{ color: '#E61D00' }}>Enredo:</strong> {result.Plot}</p>
                            <p><strong style={{ color: '#E61D00' }}>Tipo:</strong> {result.Type}</p>
                            <p><strong style={{ color: '#E61D00' }}>Duração:</strong> {result.Runtime}</p>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => { handlePageChange(currentPage - 1) }} disabled={currentPage === 1}>Anterior</button>
                    <span style={{ color: 'white' }}>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => { handlePageChange(currentPage + 1) }} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            )}
        </div>
    );
}

export default MeuComponente;
