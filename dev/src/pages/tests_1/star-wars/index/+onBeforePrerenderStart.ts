// https://vike.dev/onBeforePrerenderStart

import type { OnBeforePrerenderStartAsync } from 'vike/types';
import { filterMovieData } from '../filterMovieData';
import { fetchStarWarsMovies, filterMoviesData, getTitle } from './data';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async (): ReturnType<OnBeforePrerenderStartAsync> => {
  const movies = await fetchStarWarsMovies();

  return [
    {
      url: '/tests_1/star-wars',
      // We already provide `pageContext` here so that Vike
      // will *not* have to call the `onBeforeRender()` hook defined
      // above in this file.
      pageContext: {
        pageProps: {
          movies: filterMoviesData(movies),
        },
        title: getTitle(movies),
      },
    },
    ...movies.map((movie) => {
      const url = `/tests_1/star-wars/${ movie.id }`;
      return {
        url,
        // Note that we can also provide the `pageContext` of other pages.
        // This means that Vike will not call any
        // `onBeforeRender()` hook and the Star Wars API will be called
        // only once (in this `prerender()` hook).
        pageContext: {
          pageProps: {
            movie: filterMovieData(movie),
          },
          title: movie.title,
        },
      };
    }),
  ];
};
