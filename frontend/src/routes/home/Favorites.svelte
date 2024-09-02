<script>
  import arrow from "$lib/assets/arrow-right-circle.svg";
  import refresh from "$lib/assets/refresh.svg";
  import MovieCard from "./MovieCard.svelte";

  let favMovies = { success: true, data: [] };

  async function getFav() {
    const response = await fetch("/api/fav");
    favMovies = await response.json();
  }
</script>

<div class="btn-bar">
  <a href="#" class="left-btn">
    Favorite Movies
    <img class="btn" src={arrow} alt="arrow" />
  </a>
  <a href="#" class="right-btn" on:click={getFav}>
    Refresh
    <img class="btn" src={refresh} alt="refresh" />
  </a>
</div>

{#if favMovies.success}
  {#if favMovies.data.length > 0}
    <div class="scrollable">
      {#each favMovies.data as data}
        <MovieCard data={data} />
      {/each}
    </div>
  {:else}
    <p>No favorite movies found.</p>
  {/if}
{:else}
  <p>
    Something went wrong when fetching favorite movies, please try to logout and
    login again.
  </p>
{/if}

<!-- <img src={refresh} alt="refresh" /> -->

<style>
  .btn-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #d9d9d9;
    width: 100%;
    margin-top: 4em;
  }
  a {
    text-decoration: none;
    color: #fff;
  }
  .left-btn {
    font-size: 1.2em;
  }
  .btn {
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
  }
  .right-btn {
    font-size: 1em;
    float: right;
  }
  .right-btn > .btn {
    width: 1em;
    height: 1em;
  }
  .scrollable {
    display: flex;
    flex-direction: row;
    overflow-y: scroll;
  }
</style>
