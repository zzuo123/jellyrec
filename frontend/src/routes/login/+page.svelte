<script>
  import Login from "./Login.svelte";
</script>

<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
    rel="stylesheet"
  />
  <title>Login To JellyRec</title>
</head>

<div
    id="login-page"
  style="background-image: url('https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;"
>
  <div id="center-pane">
    <h1 id="title">JelllyRec</h1>
    <p id="short-desc">Movie Recommendation System with Jellyfin Integration</p>
    <div id="login-pane"><Login /></div>
  </div>

  <div id="img-credit">
    Image Credit: <a href="https://www.pexels.com/photo/7991582"
      >Tima Miroshnichenko on Pixels</a
    >
  </div>
</div>

<style>
  #login-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
    font-family: "Roboto", sans-serif;
  }
  #center-pane {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  #title {
      color: #fff;
      text-align: center;
      font-size: 5em;
      background: linear-gradient(135deg, #610699, #1ca1d8);
      -webkit-background-clip: text;
      background-clip: text; /* Add the standard property */
      color: transparent;
      margin-bottom: 10px;
  }
  #short-desc {
    color: #fff;
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 40px;
  }
  #img-credit {
    position: fixed;
    bottom: 0;
    right: 0;
    color: #fff;
    text-decoration: none;
    padding: 5px;
    background: rgba(0, 0, 0, 0.5);
  }
  #img-credit a {
    color: #fff;
  }
  #login-pane {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
