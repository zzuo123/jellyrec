<!-- half transparent login pane centered mobile optimized with separate css style tag -->

<style>
    .login {
        background: rgba(217, 217, 217, 0.5);
        padding: 0px 0px 20px 0px;
        border-radius: 10px;
        width: 25em;
    }
    .label {
        color: #fff;
        font-weight: 500;
        font-size: 1.2em;
    }
    .login input[type="text"],
    .login input[type="password"] {
        width: calc(100% - 20px);
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 15px;
        border: none;
        background: rgba(217, 217, 217, 0.7);
        border-radius: 10px;
        color: #000000;
        font-weight: 500;
        font-size: 1em;
    }
    .login input[type="submit"] {
        padding: 10px;
        border: none;
        background: #915F5F;
        cursor: pointer;
        border-radius: 5px;
        color: #fff;
        font-size: 1em;
        font-weight: 500;
        float: right;
    }
    .prompt {
        color: #fff;
        text-align: center;
        font-size: 1.2em;
        font-weight: 500;
        margin: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #915F5F;
        border-radius: 10px 10px 0px 0px;
    }
    #login-form {
        padding: 20px;
    }
    hr {
        border: 1px solid white;
        margin-bottom: 20px;
    }
</style>

<div class="login">
    <p class="prompt">Login Using Jellyfin Credential</p>
    <form id="login-form">
        <hr>
        <label class="label" for="uname">Username</label>
        <input id="uname" type="text" placeholder="Username">
        <label class="label" for="pw">Password</label>
        <input id="pw" type="password" placeholder="Password">
        <hr>
        <input id="submit" type="submit" value="Login">
    </form>
</div>


