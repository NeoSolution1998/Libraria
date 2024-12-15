<template>

    <div class="home-about-container">
        <div class="welcome-block">
            <div class="welcome-header">
                <h1>Добро пожаловать в нашу библиотеку</h1>
                <p>Читайте книги, делитесь мыслями, находите друзей</p>

                <router-link to="/books" class="welcome-header-button">
                    <button-vue> Начать читать</button-vue>
                </router-link>

            </div>
            <div class="welcome-banner">
                <div class="banner-background">

                </div>
                <img src="/images/home/welcome-notebook.png" alt="..." class="welcome-image img-fluid" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "WelcomeSection",
}
</script>

<style scoped>
.home-about-container {
    background-color: var(--dark);
    max-width: 1920px;
    height: 500px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 100px;
}

.welcome-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.welcome-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding-left: 140px;
    padding-right: 20px;
    text-align: start;
    width: 800px;

}

.welcome-header h1 {
    font-family: "Russo";
    width: 100%;
    font-size: 60px;
    color: var(--white);
}

.welcome-header p {
    color: var(--white);
    font-family: 'Ubuntu';
}

.welcome-banner {
    position: relative;
    width: 400px;
    height: 300px;
    overflow: visible;
    margin-right: 150px;
}

.banner-background {
    width: 500px;
    background-color: var(--dark-blue);
    height: 400px;
    border-radius: 20%;
    top: -50px;
    position: absolute;
    box-shadow: 0 0 20px 10px var(--dark-blue);
    /* Голубое свечение */

}

.welcome-banner img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 650px;
    height: auto;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
}

.welcome-banner img:hover {
    transform: translate(-50%, -50%) scale(1.15) rotate(3deg);
    /* Увеличение и легкий наклон */
    filter: brightness(1.1);
    /* Легкое осветление изображения */
}

@media(max-width:1550px) {
    .home-about-container {
        padding: 0 40px;
        height: 400px;
    }

    .welcome-header {
        padding-left: 80px;
    }

    .welcome-header h1 {
        font-size: 45px;
        width: 480px;

    }

    .welcome-banner {
        width: 400px;
        height: 300px;
        margin-right: 80px;
    }

    .banner-background {
        max-width: 500px;
        width: 100%;
        height: 300px;
        border-radius: 20%;
        position: absolute;
        top: -10px;
    }

    .welcome-banner img {
        position: absolute;
        left: 40%;
        transform: translate(-50%, -50%);
        max-width: 550px;
        height: auto;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    }
}

@media(max-width:1024px) {
    .home-about-container {
        padding: 0 20px;
    }

    .welcome-header {
        padding-left: 30px;
        width: 400px;
    }

    .welcome-header h1 {
        font-size: 35px;
        width: 350px;
    }

    .welcome-header p {
        font-size: 16px;
        width: 320px;
    }

    .welcome-banner {
        width: 400px;
        height: 300px;
        margin-right: 30px;
    }

    .banner-background {
        max-width: 300px;
        width: 100%;
        height: 250px;
        border-radius: 20%;
        position: absolute;
        top: 20px;
        left: 20%;
    }

    .welcome-banner img {
        position: absolute;
        left: 45%;
        transform: translate(-50%, -50%);
        max-width: 450px;
        height: auto;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    }
}

@media(max-width:880px) {
    .home-about-container {
        padding: 0 10px;
        height: 300px;
    }

    .welcome-header {
        padding-left: 20px;
        width: 300px;
    }

    .welcome-header h1 {
        font-size: 25px;
        width: 250px;
    }

    .welcome-header p {
        font-size: 14px;
        width: 200px;
    }

    .welcome-banner {
        width: 220px;
        height: 300px;
        margin-right: 20px;
    }

    .banner-background {
        max-width: 220px;
        width: 100%;
        height: 180px;
        border-radius: 20%;
        position: absolute;
        top: 60px;
        left: -5%;
    }

    .welcome-banner img {
        position: absolute;
        left: 35%;
        transform: translate(-50%, -50%);
        max-width: 300px;
        height: auto;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    }
}

@media(max-width:640px) {
    .welcome-header {
        padding-left: 10px;
        width: 300px;
    }

    .welcome-header h1 {
        font-size: 20px;
        width: 200px;
    }

    .welcome-header p {
        font-size: 12px;
        width: 180px;
    }

    .welcome-banner {
        width: 200px;
        height: 250px;
        margin-right: 0px;
    }

    .banner-background {
        max-width: 220px;
        width: 100%;
        height: 160px;
        border-radius: 20%;
        position: absolute;
        top: 40px;
        left: -5%;
    }

    .welcome-banner img {
        position: absolute;
        left: 35%;
        transform: translate(-50%, -50%);
        max-width: 250px;
        height: auto;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    }
}

@media (max-width: 440px) {
    .home-about-container {
        max-width: 440px;
        overflow: hidden;
        height: 200px;
        padding: 0px 10px;
    }

    .welcome-header {
        max-width: 180px;
        width: 100%;
        padding-left: 0px;
    }

    .welcome-header h1 {
        font-size: 16px;
        max-width: 200px;
        width: 100%;
    }

    .welcome-header p {
        font-size: 12px;
        width: 100%;
    }

    .welcome-banner {
        max-width: 180px;
        width: 100%;
        height: 200px;
        margin-right: 10px;
        position: relative;
    }

    .banner-background {
        max-width: 180px;
        width: 100%;
        height: 150px;
        border-radius: 20%;
        position: absolute;
        top: 20px;
    }

    .welcome-banner img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: auto;
    }
}

@media (max-width: 340px) {
    .home-about-container {
        max-width: 340px;
        overflow: hidden;
        height: 180px;
        padding: 0px 10px;
    }

    .welcome-header {
        max-width: 160px;
        padding-left: 0px;
    }

    .welcome-header h1 {
        font-size: 11px;
        max-width: 150px;
        width: 80%;
    }

    .welcome-header p {
        font-size: 9px;
        width: 80%;
    }

    .welcome-banner {
        max-width: 180px;
        width: 100%;
        height: 160px;
        margin-right: 00px;
        position: relative;
    }


    .banner-background {
        max-width: 180px;
        width: 100%;
        height: 120px;
        border-radius: 20%;
        position: absolute;
        top: 20px;
    }

    .welcome-banner img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: auto;
    }
}
</style>