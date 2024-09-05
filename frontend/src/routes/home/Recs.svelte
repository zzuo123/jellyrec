<script>
  import arrow from "$lib/assets/arrow-right-circle.svg";
  import refresh from "$lib/assets/refresh.svg";
    import {onMount} from "svelte";
  import MovieCard from "./MovieCard.svelte";

  let favMovies = { success: true, data: [] };

  async function getRec() {
    const response = await fetch("/api/rec");
    favMovies = await response.json();
  }

  onMount(getRec);
</script>

<div class="btn-bar">
  <a href="#" class="left-btn">
    Recommendations
    <img class="btn" src={arrow} alt="arrow" />
  </a>
  <a href="#" class="right-btn" on:click={getRec}>
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
  <div class="error-msg">
    <p>
      Something went wrong when generating recommendations, possible because there is no favorited movies in Jellyfin or favorite movies not loaded yet.
    </p>
    <p>Error message from server: {favMovies.message}</p>
  </div>
{/if}

<!-- <img src={refresh} alt="refresh" /> -->

<style>
  .btn-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #d9d9d9;
    width: 100%;
    margin: 4em 0 2em 0;
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
  .error-msg {
    color: red;
  }
</style>
