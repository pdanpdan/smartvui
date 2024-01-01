import fetch from 'cross-fetch';
import type { Movie, MovieDetails } from '../types';

export async function fetchStarWarsMovies(): Promise<MovieDetails[]> {
  const response = await fetch('https://star-wars.brillout.com/api/films.json');
  let movies: MovieDetails[] = ((await response.json())).results;
  movies = movies.map((movie: MovieDetails, i: number) => ({
    ...movie,
    id: String(i + 1),
  }));
  return movies;
}

export function filterMoviesData(movies: MovieDetails[]): Movie[] {
  return movies.map((movie: MovieDetails) => {
    const { title, release_date, id } = movie;
    return { title, release_date, id };
  });
}

export function getTitle(movies: Movie[] | MovieDetails[]): string {
  const title = `${ movies.length } Star Wars Movies`;
  return title;
}
