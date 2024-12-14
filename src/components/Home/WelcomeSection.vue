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
    padding-left: 200px;
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
    margin-right: 200px;
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