<script>
  import PopupCard from "./PopupCard.svelte";
  export let data = [];
  
  let showPopup = false;

  function togglePopup() {
    showPopup = !showPopup;
  }
</script>

<PopupCard show={showPopup} data={data} close={togglePopup} />
<button class="card" on:click={togglePopup}>
    <img src="{data.poster_url}" alt="poster" class="poster"/>
    <p>{data.title}</p>
</button>

<style>
    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-right: 2em;
        background: transparent;
        border: 0;
        color: inherit;
        text-decoration: inherit;
        font: inherit;
        max-width: 12em;
    }
    .card:hover {
        cursor: pointer;
    }
    .poster {
        height: 12em;
    }
</style>
