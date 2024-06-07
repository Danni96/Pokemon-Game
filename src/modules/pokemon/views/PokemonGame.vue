<template>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="flex flex-col justify-center items-center w-screen h-screen"
  >
    <h1 class="text-3xl text-cyan-500 font-bold">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokémons...</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5 text-3xl text-cyan-500 font-bold">¿Quien es este pokémon?</h1>
    <div class="h-20">
      <button
        v-if="gameStatus != GameStatus.Playing"
        class="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-"
        @click="getNextRound(4)"
      >
        Jugar de nuevo
      </button>
    </div>

    <!-- Componente para mostrar la imagen -->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus != GameStatus.Playing"
    />

    <!-- compomente para las Options -->
    <PokemonOptions
      :options="options"
      :block-selection="gameStatus != GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selectedOption="checkAnswer"
    />
  </section>
</template>

<script setup>
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  isLoading,
  gameStatus,
  pokemonOptions: options,
  checkAnswer,
  getNextRound,
} = usePokemonGame();
</script>
