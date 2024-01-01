import type { MovieDetails } from './types';

export function filterMovieData(
  movie: MovieDetails,
): MovieDetails {
  const { id, title, release_date, director, producer } = movie;
  movie = { id, title, release_date, director, producer };
  return movie;
}
