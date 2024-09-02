<script>
  import Navbar from "../Navbar.svelte";
  import Favorites from "./Favorites.svelte";
</script>

<head>
  <title>JellyRec Home</title>
</head>

<Navbar />

<div class="content">
  <Favorites />
</div>

<style>
  :global(body) {
    background-color: #202020;
  }
  .content {
    display: flex;
    flex-direction: column;
    padding-left: 4em;
    padding-right: 4em;
    color: #D9D9D9;
  }
</style>
