import { computed, onMounted, ref } from 'vue';
import { GameStatus, type PokemonListResponse, type Pokemon } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  // definimos como manejar los estados desde un interface
  const gameStatus = ref<GameStatus>(GameStatus.Playing);

  // propiedades computadas
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  // devolver un pokemon del pokemonOptions
  const randomPokemon = computed(() => {
    // devolver el pokemon random
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
    return pokemonOptions.value[randomIndex];
  });

  const isLoading = computed(() => pokemons.value.length === 0);

  //   peticiones al api
  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=800');

    const pokemonArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts.at(-2) ?? 0;
      return {
        name: pokemon.name,
        id: +id,
      };
    });

    return pokemonArray.sort(() => Math.random() - 0.5);
  };

  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);
  };

  const checkAnswer = (id: number) => {
    const hasWon = randomPokemon.value.id === id;
    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });
      return;
    } else {
      gameStatus.value = GameStatus.Lost;
    }
  };

  onMounted(async () => {
    // obtener los pokemons

    pokemons.value = await getPokemons();

    getNextRound();
  });

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,

    // metodos
    getNextRound,
    checkAnswer,
  };
};
