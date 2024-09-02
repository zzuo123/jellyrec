<script>
  import cog from '$lib/assets/cog.svg';
</script>

<nav>
  <a href="/home" id="logo">JellyRec</a>
  <form action="/logout" method="post">
    <button>
      Logout
      <img id="cog" src={cog} alt="cog" />
    </button>
  </form>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #303030;
    color: #fff;
    padding: 1rem;
    padding: 1em 4em 1em 4em;
  }
  nav > form {
    float: right;
  }
  nav > form > button {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1.5em;
  }
  #logo {
    font-size: 2em;
    font-weight: bold;
    color: #fff;
    text-align: center;
    background: linear-gradient(135deg, #610699, #1ca1d8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  #cog {
    width: 1em;
    height: 1em;
  }
</style>