<script>
  export let show = false;
  export let close = () => {};
  export let data = [];
  import x from "$lib/assets/x.svg";
</script>

{#if show}
  <div class="popup-backdrop" on:click={close}>
    <div class="popup-card" on:click|stopPropagation>
        <button on:click={close} class="close-btn">
            <img src={x} alt="close">
        </button>
        <div class="split">
            <div class="left">
                <img src="{data.poster_url}" alt="poster" class="poster"/>
                <p class="imdb_link">{data.title} <a href={"https://www.imdb.com/title/" + data.imdb_id} target="_blank">(IMDB)</a></p>
            </div>
            <div class="right">
                <table class="info-table">
                    <tr>
                        <td>Release Date</td>
                        <td>{data.released}</td>
                    </tr>
                    <tr>
                        <td>Rating</td>
                        <td>{data.rating}</td>
                    </tr>
                    <tr>
                        <td>Genres</td>
                        <td>{data.genre}</td>
                    </tr>
                    <tr>
                        <td>Director</td>
                        <td>{data.director}</td>
                    </tr>
                    <tr>
                        <td>Actors</td>
                        <td>{data.actors}</td>
                    </tr>
                    <tr>
                        <td>Awards</td>
                        <td>{data.awards}</td>
                    </tr>
                    <tr>
                        <td>Runtime</td>
                        <td>{data.runtime}</td>
                    </tr>
                    <tr>
                        <td>Language</td>
                        <td>{data.language}</td>
                    </tr>
                    <tr>
                        <td>Overview</td>
                        <td>{data.plot}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
  </div>
{/if}

<style>
  .popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup-card {
    background: #303030;
    max-width: 80vw;
    max-height: 80vh;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .close-btn {
    background: transparent;
    border: 0;
    color: #fff;
    font-size: 1.2em;
    cursor: pointer;
    float:right;
  }
  .split {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left : 2em;
  }
  .imdb_link {
    font-size: 1.2em;
    margin-top: 1em;
  }
  .imdb_link a {
    color: #fff;
    text-decoration: none;
  }
  .info-table {
    width: 100%;
  }
  .info-table td {
    padding: 0.5em;
    min-width: 7em;
  }

  /* mobile view */
  @media only screen and (max-width: 1000px) {
    .popup-card {
        overflow-y: scroll;
    }
    .split {
      flex-direction: column;
    }
    .right {
      margin-left: 0;
      margin-top: 2em;
    }
  }
</style>
