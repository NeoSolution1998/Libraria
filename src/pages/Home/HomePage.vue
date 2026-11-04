<template>
  <div class="home">
    <header-vue />

    <main class="home__main">
      <!-- ==================== GUEST LANDING ==================== -->
      <template v-if="!user">
      <!-- ============================ HERO ============================ -->
      <section class="home-hero">
        <div class="shell home-hero__grid">
          <div class="home-hero__copy">
            <p class="home-hero__eyebrow">Цифровая библиотека</p>

            <h1 class="home-hero__title">
              Читайте.<br />
              Обсуждайте.<br />
              <em>Возвращайтесь.</em>
            </h1>

            <p class="home-hero__text">
              Libraria — библиотека, где книги читают по главам, а о прочитанном
              пишут посты и спорят в комментариях. Найдите книгу в каталоге и
              начните с первой страницы.
            </p>

            <div class="home-hero__actions">
              <router-link :to="{ name: 'Books' }" class="btn btn--primary">
                Начать читать
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
              <router-link
                v-if="!user"
                :to="{ name: 'Registration' }"
                class="btn btn--outline"
              >
                Создать аккаунт
              </router-link>
              <router-link v-else :to="{ name: 'Profile' }" class="btn btn--outline">
                Мой профиль
              </router-link>
            </div>

            <p class="home-hero__note">
              <span class="icon-help-circled" aria-hidden="true"></span>
              Каталог открыт всем. Чтобы читать главы и комментировать, нужен аккаунт.
            </p>

            <dl class="stats">
              <div class="stats__item">
                <dt>Книг в каталоге</dt>
                <dd>{{ formatNumber(totalBooks) }}</dd>
              </div>
              <div class="stats__item">
                <dt>Постов читателей</dt>
                <dd>{{ formatNumber(totalPosts) }}</dd>
              </div>
              <div class="stats__item">
                <dt>Авторов</dt>
                <dd>{{ formatNumber(totalAuthors) }}</dd>
              </div>
            </dl>
          </div>

          <div class="home-hero__aside">
            <div class="stage">
              <router-link
                v-for="(book, index) in heroBooks"
                :key="book.id"
                :to="{ name: 'Book', params: { id: book.id } }"
                class="stage__book"
                :class="`stage__book--${index + 1}`"
                :style="stageStyle(index)"
                :aria-label="`Книга «${book.title}»`"
              >
                <span class="cover-art">
                  <span class="cover-art__frame" aria-hidden="true"></span>
                  <span class="cover-art__genre">{{ genreOf(book) }}</span>
                  <span class="cover-art__title">{{ book.title }}</span>
                  <span class="cover-art__author">{{ book.author || 'Libraria' }}</span>
                </span>
              </router-link>
            </div>

            <div class="home-hero__cards">
              <article class="today">
                <header class="today__head">
                  <span>Сегодня</span>
                  <time>{{ todayLabel }}</time>
                </header>
                <p class="today__quote">«Рукописи не горят».</p>
                <p class="today__author">Михаил Булгаков, «Мастер и Маргарита»</p>
              </article>

              <ol class="steps">
                <li v-for="(step, index) in steps" :key="step" class="steps__item">
                  <span class="steps__num" :class="{ 'is-first': index === 0 }">{{ index + 1 }}</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================ BOOKS ============================ -->
      <section class="home-section home-section--books">
        <div class="shell">
          <header class="home-section__head">
            <div class="home-section__intro">
              <h2>Что почитать</h2>
              <p>Свежие поступления и книги, к которым читатели возвращаются чаще всего.</p>
            </div>

            <div class="home-section__tools">
              <div class="segmented">
                <button
                  type="button"
                  :class="{ 'is-active': bookView === 'new' }"
                  @click="bookView = 'new'"
                >
                  Новые
                </button>
                <button
                  type="button"
                  :class="{ 'is-active': bookView === 'popular' }"
                  @click="bookView = 'popular'"
                >
                  Популярные
                </button>
              </div>
              <router-link :to="{ name: 'Books' }" class="link-arrow">
                Весь каталог
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
            </div>
          </header>

          <div v-if="homeBooks.length" class="book-grid">
            <article v-for="(book, index) in homeBooks" :key="book.id" class="shelf-card">
              <router-link
                :to="{ name: 'Book', params: { id: book.id } }"
                class="shelf-card__cover"
                :style="coverStyle(book, index)"
                :aria-label="`Открыть книгу: ${book.title}`"
              >
                <img
                  v-if="book.cover_image && !isBroken(`book-${book.id}`)"
                  :src="book.cover_image"
                  :alt="book.title"
                  loading="lazy"
                  @error="markBroken(`book-${book.id}`)"
                />
                <span v-else class="cover-art cover-art--compact">
                  <span class="cover-art__frame" aria-hidden="true"></span>
                  <span class="cover-art__genre">{{ genreOf(book) }}</span>
                  <span class="cover-art__title">{{ book.title }}</span>
                </span>
              </router-link>

              <h3 class="shelf-card__title">
                <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
              </h3>
              <p class="shelf-card__author">{{ book.author || 'Автор не указан' }}</p>
              <p class="shelf-card__meta">
                <span class="icon-star" aria-hidden="true"></span>
                <b>{{ ratingOf(book) }}</b>
                <template v-if="chaptersOf(book)">
                  <span class="shelf-card__dot">·</span>
                  <span>{{ chaptersOf(book) }}</span>
                </template>
              </p>
            </article>
          </div>

          <p v-else-if="loading" class="home-section__empty">Загружаем книги…</p>
          <p v-else class="home-section__empty">В каталоге пока нет книг.</p>
        </div>
      </section>

      <!-- ============================ POSTS ============================ -->
      <section class="home-section home-section--posts">
        <div class="shell">
          <header class="home-section__head">
            <div class="home-section__intro">
              <h2>Читать сейчас</h2>
              <p>Посты читателей о книгах: рецензии, заметки на полях и разборы глав.</p>
            </div>

            <router-link :to="{ name: 'Posts' }" class="link-arrow">
              Все посты
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
          </header>

          <div v-if="featuredPost" class="posts">
            <router-link
              :to="{ name: 'Post', params: { id: featuredPost.id } }"
              class="post-featured"
            >
              <div class="post-featured__media" :style="postMediaStyle(featuredPost, 0)">
                <img
                  v-if="featuredPost.image && !isBroken(`post-${featuredPost.id}`)"
                  :src="featuredPost.image"
                  :alt="featuredPost.title"
                  loading="lazy"
                  @error="markBroken(`post-${featuredPost.id}`)"
                />
                <span v-else class="post-media__letter" aria-hidden="true">
                  {{ initialOf(featuredPost.title) }}
                </span>
              </div>

              <div class="post-featured__body">
                <div class="post-meta">
                  <span v-if="tagOf(featuredPost)" class="chip" :class="tagClass(featuredPost)">{{ tagOf(featuredPost) }}</span>
                  <time>{{ dateLabel(featuredPost) }}</time>
                </div>

                <h3 class="post-featured__title">{{ featuredPost.title }}</h3>
                <p class="post-featured__excerpt">{{ excerptOf(featuredPost, 140) }}</p>

                <footer class="post-foot">
                  <span class="post-author">
                    <span class="post-author__avatar">
                      <img
                        v-if="featuredPost.user?.avatar && !isBroken(`avatar-${featuredPost.user.id}`)"
                        :src="featuredPost.user.avatar"
                        :alt="featuredPost.user?.name"
                        loading="lazy"
                        @error="markBroken(`avatar-${featuredPost.user.id}`)"
                      />
                      <span v-else>{{ initialsOf(featuredPost.user?.name) }}</span>
                    </span>
                    <span class="post-author__info">
                      <strong>{{ featuredPost.user?.name || 'Читатель' }}</strong>
                      <small>к книге «{{ featuredPost.title }}»</small>
                    </span>
                  </span>

                  <span class="post-stats">
                    <span><span class="icon-heart" aria-hidden="true"></span>{{ countsOf(featuredPost).likes }}</span>
                    <span><span class="icon-comment" aria-hidden="true"></span>{{ countsOf(featuredPost).comments }}</span>
                    <span><span class="icon-eye" aria-hidden="true"></span>{{ countsOf(featuredPost).views }}</span>
                  </span>
                </footer>
              </div>
            </router-link>

            <div class="post-list">
              <router-link
                v-for="(post, index) in sidePosts"
                :key="post.id"
                :to="{ name: 'Post', params: { id: post.id } }"
                class="post-mini"
              >
                <div class="post-mini__media" :style="postMediaStyle(post, index + 1)">
                  <img
                    v-if="post.image && !isBroken(`post-${post.id}`)"
                    :src="post.image"
                    :alt="post.title"
                    loading="lazy"
                    @error="markBroken(`post-${post.id}`)"
                  />
                  <span v-else class="post-media__letter" aria-hidden="true">{{ initialOf(post.title) }}</span>
                </div>

                <div class="post-mini__body">
                  <div class="post-meta">
                    <span v-if="tagOf(post)" class="chip chip--sm" :class="tagClass(post)">{{ tagOf(post) }}</span>
                    <time>{{ dateLabel(post) }}</time>
                  </div>
                  <h4>{{ post.title }}</h4>
                  <p class="post-mini__author">{{ post.user?.name || 'Читатель' }}</p>
                  <p class="post-stats post-stats--sm">
                    <span><span class="icon-heart" aria-hidden="true"></span>{{ countsOf(post).likes }}</span>
                    <span><span class="icon-comment" aria-hidden="true"></span>{{ countsOf(post).comments }}</span>
                    <span><span class="icon-eye" aria-hidden="true"></span>{{ countsOf(post).views }}</span>
                  </p>
                </div>
              </router-link>
            </div>
          </div>

          <p v-else class="home-section__empty">Пока никто не написал о книгах.</p>
        </div>
      </section>

      <!-- ============================ AUTHORS ============================ -->
      <section v-if="authors.length" class="home-section home-section--authors">
        <div class="shell">
          <header class="home-section__head">
            <div class="home-section__intro">
              <h2>Кого почитать</h2>
              <p>
                Авторы и читатели, которые пишут о книгах чаще других. Подпишитесь —
                их посты появятся в вашей ленте.
              </p>
            </div>

            <p v-if="!user" class="home-section__hint">
              <span class="icon-lock" aria-hidden="true"></span>
              Подписка доступна после входа
            </p>
          </header>

          <div class="author-grid">
            <article v-for="author in authors" :key="author.id" class="author-card">
              <router-link
                :to="user ? { name: 'Profile', params: { id: author.id } } : { name: 'Login' }"
                class="author-card__avatar"
              >
                <img
                  v-if="author.avatar && !isBroken(`avatar-${author.id}`)"
                  :src="author.avatar"
                  :alt="author.name"
                  loading="lazy"
                  @error="markBroken(`avatar-${author.id}`)"
                />
                <span v-else>{{ initialsOf(author.name) }}</span>
              </router-link>

              <h3 class="author-card__name">{{ author.name }}</h3>
              <p class="author-card__meta">{{ authorMeta(author) }}</p>

              <button
                type="button"
                class="author-card__action"
                :class="{ 'is-done': isFollowing(author) }"
                :disabled="followingId === author.id"
                @click="handleFollow(author)"
              >
                {{ isFollowing(author) ? 'Вы подписаны' : 'Подписаться' }}
              </button>
            </article>
          </div>
        </div>
      </section>

      <!-- ============================ PLANS ============================ -->
      <section class="home-section home-section--plans">
        <div class="shell plans">
          <div class="plans__intro">
            <h2>Доступ к библиотеке</h2>
            <p>
              Тариф открывает доступ к библиотеке на выбранный срок. В каждой
              карточке указан уровень доступа — базовый или премиум.
            </p>
            <p class="plans__note">
              <span class="icon-attention-alt" aria-hidden="true"></span>
              Блок носит справочный характер: оплата на сайте сейчас не проводится.
            </p>
          </div>

          <div class="plan-grid">
            <article
              v-for="plan in planCards"
              :key="plan.id"
              class="plan"
              :class="{ 'plan--premium': plan.premium }"
            >
              <span class="plan__badge">{{ plan.badge }}</span>
              <h3 class="plan__name">{{ plan.name }}</h3>
              <p class="plan__term">Срок — {{ plan.term }}</p>
              <p class="plan__price">
                {{ formatNumber(plan.price) }} <span>₽</span>
              </p>
              <p class="plan__hint">за весь срок</p>
            </article>
          </div>
        </div>

        <div class="shell">
          <section class="cta">
            <div class="cta__copy">
              <h2>Ваша следующая глава ждёт</h2>
              <p>
                С аккаунтом можно читать главы, сохранять место, где вы
                остановились, писать посты и обсуждать книги с другими читателями.
              </p>
            </div>

            <div class="cta__actions">
              <template v-if="!user">
                <router-link :to="{ name: 'Registration' }" class="btn btn--gold">Создать аккаунт</router-link>
                <router-link :to="{ name: 'Login' }" class="btn btn--ghost-dark">У меня есть аккаунт</router-link>
              </template>
              <template v-else>
                <router-link :to="{ name: 'Books' }" class="btn btn--gold">Открыть каталог</router-link>
                <router-link :to="{ name: 'Profile' }" class="btn btn--ghost-dark">Мой профиль</router-link>
              </template>
            </div>
          </section>
        </div>
      </section>
      </template>

      <!-- ==================== AUTHENTICATED HOME ==================== -->
      <template v-else>
        <section class="uh-hero">
          <div class="shell uh-hero__grid">
            <div class="uh-hero__main">
              <p class="uh-eyebrow">Цифровая библиотека</p>
              <h1 class="uh-title">С возвращением, <span>{{ firstName }}</span></h1>
              <p class="uh-sub">{{ heroSubtitle }}</p>

              <article v-if="continueItem" class="uh-continue">
                <span class="uh-continue__label">{{ continueItem.isNew ? 'Начать читать' : 'Продолжить чтение' }}</span>
                <div class="uh-continue__body">
                  <router-link
                    :to="continueItem.link"
                    class="uh-continue__cover"
                    :style="coverStyle(continueItem.book, 0)"
                    :aria-label="`Продолжить чтение: ${continueItem.title}`"
                  >
                    <img
                      v-if="continueItem.cover && !isBroken(`continue-${continueItem.bookId}`)"
                      :src="continueItem.cover"
                      :alt="continueItem.title"
                      @error="markBroken(`continue-${continueItem.bookId}`)"
                    />
                    <span v-else class="uh-continue__cover-text">{{ continueItem.title }}</span>
                  </router-link>

                  <div class="uh-continue__info">
                    <h2>{{ continueItem.title }}</h2>
                    <p class="uh-continue__meta">
                      <template v-if="continueItem.isNew">
                        {{ continueItem.author }}
                        <template v-if="continueItem.total">
                          · {{ continueItem.total }} {{ chapterWord(continueItem.total) }}
                        </template>
                      </template>
                      <template v-else>
                        {{ continueItem.author }} · {{ continueItem.chapterName }}: {{ continueItem.chapterTitle }}
                      </template>
                    </p>

                    <p v-if="continueItem.isNew && newBookBlurb" class="uh-continue__blurb">
                      {{ newBookBlurb }}
                    </p>

                    <div v-if="!continueItem.isNew" class="uh-progress">
                      <div class="uh-progress__bar"><span :style="{ width: `${continueItem.percent}%` }"></span></div>
                      <div class="uh-progress__meta">
                        <span>Прочитано {{ continueItem.percent }}%</span>
                        <span>Осталось {{ continueItem.left }} глав · всего {{ continueItem.total }}</span>
                      </div>
                    </div>

                    <div class="uh-continue__actions">
                      <router-link :to="continueItem.link" class="btn btn--primary">
                        {{ continueItem.isNew ? 'Начать читать' : 'Продолжить чтение' }}
                        <span class="icon-right-open" aria-hidden="true"></span>
                      </router-link>
                      <router-link
                        :to="{ name: 'Book', params: { id: continueItem.bookId } }"
                        class="uh-link"
                      >
                        Открыть страницу книги
                      </router-link>
                    </div>
                  </div>
                </div>
              </article>

              <div class="uh-actions">
                <router-link :to="{ name: 'Books' }" class="uh-ghost">
                  <svg class="uh-ghost__icon" viewBox="0 0 24 24" width="18" height="18" fill="none"
                       stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 6.6S10.4 5 7.8 5H4v13.2h3.8c2.6 0 4.2 1.6 4.2 1.6s1.6-1.6 4.2-1.6H20V5h-3.8C13.6 5 12 6.6 12 6.6z" />
                    <path d="M12 6.6v13.2" />
                  </svg>
                  Перейти к книгам
                </router-link>
                <router-link :to="{ name: 'PostCreate' }" class="uh-ghost">
                  <svg class="uh-ghost__icon" viewBox="0 0 24 24" width="18" height="18" fill="none"
                       stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20.6 13.4 12.6 5.4a2 2 0 0 0-1.4-.6H6a1 1 0 0 0-1 1v5.2c0 .5.2 1 .6 1.4l8 8a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8z" />
                    <circle cx="8.4" cy="8.4" r="1.1" />
                  </svg>
                  Написать пост
                </router-link>
              </div>
            </div>

            <aside class="uh-hero__side">
              <article class="uh-quote">
                <header class="uh-quote__head">
                  <span>Сегодня</span>
                  <time>{{ todayLabel }}</time>
                </header>
                <p class="uh-quote__text">«Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему».</p>
                <p class="uh-quote__author">Лев Толстой, «Анна Каренина»</p>
              </article>

              <dl class="uh-stats">
                <div>
                  <dd>{{ formatNumber(userStats.books) }}</dd>
                  <dt>Мои книги</dt>
                </div>
                <div>
                  <dd>{{ formatNumber(userStats.posts) }}</dd>
                  <dt>Мои посты</dt>
                </div>
                <div>
                  <dd>{{ formatNumber(userStats.following) }}</dd>
                  <dt>Подписки</dt>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section class="uh-section uh-section--feed">
          <div class="shell">
            <header class="uh-head">
              <div>
                <h2>Новое в подписках</h2>
                <p>Посты авторов и читателей, на которых вы подписаны.</p>
              </div>
              <router-link :to="{ name: 'Posts' }" class="link-arrow">
                Все посты
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
            </header>

            <div v-if="subscriptionPosts.length" class="uh-posts">
              <router-link
                v-for="(post, index) in subscriptionPosts"
                :key="post.id"
                :to="{ name: 'Post', params: { id: post.id } }"
                class="uh-post"
              >
                <div class="uh-post__media" :style="postMediaStyle(post, index)">
                  <img
                    v-if="post.image && !isBroken(`post-${post.id}`)"
                    :src="post.image"
                    :alt="post.title"
                    loading="lazy"
                    @error="markBroken(`post-${post.id}`)"
                  />
                  <span v-else class="post-media__letter" aria-hidden="true">{{ initialOf(post.title) }}</span>
                </div>

                <div class="uh-post__body">
                  <div class="post-meta">
                    <span v-if="tagOf(post)" class="chip chip--sm" :class="tagClass(post)">{{ tagOf(post) }}</span>
                    <time>{{ dateLabel(post) }}</time>
                  </div>

                  <h3>{{ post.title }}</h3>
                  <p class="uh-post__excerpt">{{ excerptOf(post, 120) }}</p>

                  <footer class="uh-post__foot">
                    <span class="post-author">
                      <span class="post-author__avatar">
                        <img
                          v-if="post.user?.avatar && !isBroken(`avatar-${post.user.id}`)"
                          :src="post.user.avatar"
                          :alt="post.user?.name"
                          loading="lazy"
                          @error="markBroken(`avatar-${post.user.id}`)"
                        />
                        <span v-else>{{ initialsOf(post.user?.name) }}</span>
                      </span>
                      <span class="post-author__info">
                        <strong>{{ post.user?.name || 'Читатель' }}</strong>
                      </span>
                    </span>

                    <span class="post-stats post-stats--sm">
                      <span><span class="icon-heart" aria-hidden="true"></span>{{ countsOf(post).likes }}</span>
                      <span><span class="icon-comment" aria-hidden="true"></span>{{ countsOf(post).comments }}</span>
                      <span><span class="icon-eye" aria-hidden="true"></span>{{ countsOf(post).views }}</span>
                    </span>
                  </footer>
                </div>
              </router-link>
            </div>

            <p v-else class="uh-empty">
              Пока тихо. Подпишитесь на авторов в каталоге — их посты появятся здесь.
            </p>
          </div>
        </section>

        <section class="uh-section uh-section--books">
          <div class="shell uh-layout">
            <div class="uh-books">
              <header class="uh-head">
                <div>
                  <h2>Что почитать</h2>
                  <p>Новые поступления и любимые у читателей.</p>
                </div>

                <div class="segmented">
                  <button type="button" :class="{ 'is-active': bookView === 'new' }" @click="bookView = 'new'">Новые</button>
                  <button type="button" :class="{ 'is-active': bookView === 'popular' }" @click="bookView = 'popular'">Популярные</button>
                </div>
              </header>

              <div class="uh-shelf">
                <article v-for="(book, index) in homeBooks.slice(0, 4)" :key="book.id" class="shelf-card">
                  <router-link
                    :to="{ name: 'Book', params: { id: book.id } }"
                    class="shelf-card__cover"
                    :style="coverStyle(book, index)"
                    :aria-label="`Открыть книгу: ${book.title}`"
                  >
                    <img
                      v-if="book.cover_image && !isBroken(`book-${book.id}`)"
                      :src="book.cover_image"
                      :alt="book.title"
                      loading="lazy"
                      @error="markBroken(`book-${book.id}`)"
                    />
                    <span v-else class="cover-art cover-art--compact">
                      <span class="cover-art__frame" aria-hidden="true"></span>
                      <span class="cover-art__genre">{{ genreOf(book) }}</span>
                      <span class="cover-art__title">{{ book.title }}</span>
                    </span>
                  </router-link>

                  <h3 class="shelf-card__title">
                    <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
                  </h3>
                  <p class="shelf-card__author">{{ book.author || 'Автор не указан' }}</p>
                  <p class="shelf-card__meta">
                    <span class="icon-star" aria-hidden="true"></span>
                    <b>{{ ratingOf(book) }}</b>
                    <template v-if="chaptersOf(book)">
                      <span class="shelf-card__dot">·</span>
                      <span>{{ chaptersOf(book) }}</span>
                    </template>
                  </p>
                </article>
              </div>

              <router-link :to="{ name: 'Books' }" class="uh-catalog-link">
                Открыть весь каталог
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
            </div>

            <aside class="uh-side">
              <section class="uh-card">
                <header class="uh-card__head">
                  <h3>Мои подписки</h3>
                  <span v-if="feedFollowing.length" class="uh-card__count">Все {{ feedFollowing.length }}</span>
                </header>

                <ul v-if="feedFollowing.length" class="uh-authors">
                  <li v-for="author in feedFollowing.slice(0, 3)" :key="author.id">
                    <router-link :to="{ name: 'Profile', params: { id: author.id } }" class="uh-author">
                      <span class="uh-author__avatar">
                        <img
                          v-if="author.avatar && !isBroken(`avatar-${author.id}`)"
                          :src="author.avatar"
                          :alt="author.name"
                          @error="markBroken(`avatar-${author.id}`)"
                        />
                        <span v-else>{{ initialsOf(author.name) }}</span>
                      </span>
                      <span class="uh-author__info">
                        <strong>{{ author.name }}</strong>
                        <small>{{ author.city || 'Читатель библиотеки' }}</small>
                      </span>
                    </router-link>
                    <button type="button" class="uh-pill uh-pill--done" disabled>Вы подписаны</button>
                  </li>
                </ul>
                <p v-else class="uh-empty uh-empty--sm">Вы пока ни на кого не подписаны.</p>

                <template v-if="feedSuggested.length">
                  <p class="uh-sub-head">Кого почитать</p>
                  <ul class="uh-authors">
                    <li v-for="author in feedSuggested.slice(0, 2)" :key="author.id">
                      <router-link :to="{ name: 'Profile', params: { id: author.id } }" class="uh-author">
                        <span class="uh-author__avatar">
                          <img
                            v-if="author.avatar && !isBroken(`avatar-${author.id}`)"
                            :src="author.avatar"
                            :alt="author.name"
                            @error="markBroken(`avatar-${author.id}`)"
                          />
                          <span v-else>{{ initialsOf(author.name) }}</span>
                        </span>
                        <span class="uh-author__info">
                          <strong>{{ author.name }}</strong>
                          <small>{{ authorMeta(author) }}</small>
                        </span>
                      </router-link>
                      <button
                        type="button"
                        class="uh-pill"
                        :disabled="followingId === author.id"
                        @click="handleFollow(author)"
                      >
                        Подписаться
                      </button>
                    </li>
                  </ul>
                </template>
              </section>

              <section class="uh-card uh-card--plans">
                <h3>Тарифы библиотеки</h3>
                <p class="uh-card__lead">Доступ к библиотеке на выбранный срок.</p>

                <ul class="uh-plans">
                  <li v-for="plan in planCards" :key="plan.id">
                    <span class="uh-plans__info">
                      <b>{{ plan.name }}</b>
                      <small>{{ plan.term }} · {{ plan.premium ? 'премиум' : 'базовый' }}</small>
                    </span>
                    <span class="uh-plans__price">{{ formatNumber(plan.price) }} ₽</span>
                  </li>
                </ul>

                <p class="uh-note">Справочная информация: оплата на сайте не производится.</p>
              </section>
            </aside>
          </div>
        </section>
      </template>
    </main>

    <footer-vue />

    <transition name="toast">
      <div v-if="toastMessage" class="toast" role="status">
        <span class="icon-ok" aria-hidden="true"></span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';

/* Book cover palette taken from the design system */
const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];
const HERO_COVER_COLORS = ['#6B2E2E', '#36513F', '#24324A'];

const PLANS = [
  { id: 'reader', name: 'Читатель', term: '1 месяц', price: 200, badge: 'Базовый доступ', premium: false },
  { id: 'season', name: 'Сезон', term: '3 месяца', price: 790, badge: 'Базовый доступ', premium: false },
  { id: 'biblio', name: 'Библиофил', term: '12 месяцев', price: 2490, badge: 'Премиум-доступ', premium: true },
];

export default {
  name: 'HomePage',
  data() {
    return {
      feed: null,
      newBooksList: [],
      popularBooksList: [],
      postsList: [],
      authorsList: [],
      totals: { books: 0, posts: 0, authors: 0 },
      readingHistory: [],
      loading: true,
      bookView: 'new',
      followingId: null,
      toastMessage: '',
      toastTimer: null,
      broken: {},
      steps: ['Найдите книгу', 'Читайте по главам', 'Обсуждайте прочитанное'],
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),

    todayLabel() {
      return new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      });
    },

    authorIdsFollowing() {
      return (this.feed?.following || []).map((author) => Number(author.id));
    },

    heroBooks() {
      return this.newBooksList.slice(0, 3);
    },

    homeBooks() {
      const list = this.bookView === 'popular' ? this.popularBooksList : this.newBooksList;
      return (list || []).slice(0, 6);
    },

    /* Personal posts first, then the library feed — always four entries */
    allPosts() {
      const preferred = [
        ...(this.feed?.posts || []),
        ...(this.feed?.recommended_posts || []),
      ];
      const seen = new Set();

      return [...preferred, ...this.postsList]
        .filter((post) => {
          const id = Number(post?.id);
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .slice(0, 4);
    },

    featuredPost() {
      return this.allPosts[0] || null;
    },

    sidePosts() {
      return this.allPosts.slice(1, 4);
    },

    /* Suggestions first, then the library authors — always four cards */
    authors() {
      const merged = [
        ...(this.feed?.suggested_authors || []),
        ...this.authorsList,
      ];
      const seen = new Set();

      return merged
        .filter((author) => {
          const id = Number(author.id);
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .slice(0, 4);
    },

    totalBooks() {
      return this.totals.books;
    },

    totalPosts() {
      return this.totals.posts;
    },

    totalAuthors() {
      return this.totals.authors;
    },

    firstName() {
      const name = String(this.user?.name || '').trim();
      return name ? name.split(/\s+/)[0] : 'читатель';
    },

    userStats() {
      return {
        books: this.feed?.stats?.books_count ?? 0,
        posts: this.feed?.stats?.posts_count ?? 0,
        following: this.feed?.stats?.following_count ?? (this.feed?.following?.length || 0),
      };
    },

    feedFollowing() {
      return this.feed?.following || [];
    },

    feedSuggested() {
      return this.feed?.suggested_authors || [];
    },

    subscriptionPosts() {
      const personal = this.feed?.posts?.length
        ? this.feed.posts
        : (this.feed?.recommended_posts || []);
      const list = personal.length ? personal : this.postsList;
      return list.slice(0, 3);
    },

    newBookBlurb() {
      const text = this.stripHtml(this.continueItem?.book?.description || '');
      if (!text) return '';
      return text.length > 150 ? `${text.slice(0, 150).replace(/\s+\S*$/, '')}…` : text;
    },

    heroSubtitle() {
      if (!this.continueItem) {
        return 'Ваша полка, подписки и новые поступления — всё, что стоит открыть сегодня.';
      }
      if (this.continueItem.isNew) {
        return 'Вы ещё не открывали книгу. Начнём с первой главы?';
      }
      return `Вы остановились на ${this.continueItem.sentenceLabel}. Продолжим с того же места?`;
    },

    continueItem() {
      const entry = this.readingHistory[0];
      if (!entry) {
        const book = this.feed?.new_books?.[0] || this.newBooksList[0];
        if (!book) return null;

        return {
          isNew: true,
          bookId: book.id,
          title: book.title,
          author: book.author || 'Автор не указан',
          cover: book.cover_image || '',
          book,
          total: Number(book.chapters_count) || 0,
          link: { name: 'Book', params: { id: book.id } },
        };
      }

      const total = Number(entry.totalChapters) || 0;
      const index = Math.max(1, Number(entry.chapterIndex) || 1);
      const percent = total ? Math.min(100, Math.round((index / total) * 100)) : 0;

      return {
        ...entry,
        book: {
          id: entry.bookId,
          title: entry.title,
          author: entry.author,
          cover_image: entry.cover,
        },
        chapterName: `Глава ${index}`,
        sentenceLabel: `${this.ordinalChapter(index)} главе`,
        percent,
        left: Math.max(0, total - index),
        total,
        link: {
          name: 'Chapter',
          params: { bookId: entry.bookId, chapterId: entry.chapterId },
        },
      };
    },

    planCards() {
      /* The pricing block is a three-card layout, so fall back to the
         reference plans when the API does not return the full set */
      if (this.feed?.plans?.length >= 3) {
        return this.feed.plans.slice(0, 3).map((plan) => ({
          id: plan.id,
          name: plan.name,
          term: `${plan.duration_months} ${this.plural(plan.duration_months, ['месяц', 'месяца', 'месяцев'])}`,
          price: plan.price,
          badge: plan.access_level === 'premium' ? 'Премиум-доступ' : 'Базовый доступ',
          premium: plan.access_level === 'premium',
        }));
      }
      return PLANS;
    },
  },
  async mounted() {
    this.readReadingHistory();
    await this.loadPage();
  },
  beforeUnmount() {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),

    async loadPage() {
      this.loading = true;

      if (!this.user && Cookies.get('auth_token')) {
        await this.fetchUser();
      }

      const tasks = [this.loadLibrary()];

      if (this.user) tasks.push(this.loadFeed());

      await Promise.all(tasks);
      this.loading = false;
    },

    async loadFeed() {
      try {
        this.feed = await this.fetchFeed();
      } catch (error) {
        this.feed = null;
      }
    },

    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async fetchFeed() {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/feed`, {
        headers: this.authHeaders(),
      });
      return response.data;
    },

    /* Library-wide content for the landing blocks — always requested in full */
    async loadLibrary() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const headers = { Accept: 'application/json' };

      const results = await Promise.allSettled([
        axios.get(`${apiUrl}/api/v1/books`, { params: { per_page: 6, sort: 'date_desc' }, headers }),
        axios.get(`${apiUrl}/api/v1/books`, { params: { per_page: 6, sort: 'likes_desc' }, headers }),
        axios.get(`${apiUrl}/api/v1/posts`, { params: { per_page: 6, sort: 'date_desc' }, headers }),
        axios.get(`${apiUrl}/api/v1/posts/authors`, { params: { limit: 100 }, headers }),
      ]);

      const payload = (result) => (result.status === 'fulfilled' ? result.value.data : null);

      const latestBooks = payload(results[0]);
      const popularBooks = payload(results[1]);
      const posts = payload(results[2]);
      const authors = payload(results[3]);

      this.newBooksList = latestBooks?.books || [];
      this.popularBooksList = popularBooks?.books || this.newBooksList;
      this.postsList = posts?.posts || [];
      this.authorsList = authors?.authors || [];

      this.totals = {
        books: latestBooks?.total_books ?? this.newBooksList.length,
        posts: posts?.total_posts ?? this.postsList.length,
        authors: this.authorsList.length,
      };
    },

    handleFollow(author) {
      if (!this.user) {
        this.$router.push({ name: 'Login' });
        return;
      }
      this.followAuthor(author);
    },

    async followAuthor(author) {
      if (this.followingId) return;
      this.followingId = author.id;

      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/users/${author.id}/follow`,
          {},
          { headers: this.authHeaders() }
        );
        this.feed = await this.fetchFeed();
        this.showToast(`Вы подписались на ${author.name}`);
      } catch (error) {
        this.showToast('Не удалось оформить подписку');
      } finally {
        this.followingId = null;
      }
    },

    /* Позицию чтения пишет читалка (libraria:reading-history) */
    readReadingHistory() {
      try {
        const raw = JSON.parse(localStorage.getItem('libraria:reading-history') || '[]');
        this.readingHistory = Array.isArray(raw)
          ? raw.filter((entry) => entry && entry.bookId && entry.title)
          : [];
      } catch (error) {
        this.readingHistory = [];
      }
    },

    ordinalChapter(index) {
      const words = [
        'первой', 'второй', 'третьей', 'четвёртой', 'пятой', 'шестой',
        'седьмой', 'восьмой', 'девятой', 'десятой', 'одиннадцатой', 'двенадцатой',
        'тринадцатой', 'четырнадцатой', 'пятнадцатой', 'шестнадцатой',
        'семнадцатой', 'восемнадцатой', 'девятнадцатой', 'двадцатой',
      ];
      return words[index - 1] || `${index}-й`;
    },

    chapterWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'глава';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'главы';
      return 'глав';
    },

    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = '';
      }, 2600);
    },

    /* ---------------------------------------------------------------- */
    /* Presentation helpers                                             */
    /* ---------------------------------------------------------------- */

    coverColor(book, index) {
      const seed = Number(book?.id ?? index) || index;
      return COVER_COLORS[seed % COVER_COLORS.length];
    },

    coverStyle(book, index) {
      return { '--cover-color': this.coverColor(book, index) };
    },

    /* Hero stage keeps the fixed cover palette from the design */
    stageStyle(index) {
      return { '--cover-color': HERO_COVER_COLORS[index % HERO_COVER_COLORS.length] };
    },

    genreOf(book) {
      const name = book?.categories?.[0]?.name || book?.tags?.[0]?.name || 'Книга';
      return String(name).toUpperCase();
    },

    ratingOf(book) {
      const value = Number(book?.average_rating || book?.rating || 0);
      if (!value) return '—';
      return value.toFixed(1).replace('.', ',');
    },

    chaptersOf(book) {
      const count = Number(book?.chapters_count || 0);
      if (!count) return '';
      return `${count} ${this.plural(count, ['глава', 'главы', 'глав'])}`;
    },

    tagOf(post) {
      return post?.tags?.[0]?.name || post?.categories?.[0]?.name || '';
    },

    tagClass(post) {
      const tag = this.tagOf(post);
      let hash = 0;
      for (let i = 0; i < tag.length; i += 1) hash += tag.charCodeAt(i);
      return ['chip--sage', 'chip--blue', 'chip--gold'][hash % 3];
    },

    dateLabel(post) {
      const raw = post?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    },

    excerptOf(post, limit = 150) {
      const text = this.stripHtml(post?.content);
      if (text.length <= limit) return text;
      return `${text.slice(0, limit).replace(/\s+\S*$/, '')}…`;
    },

    countsOf(post) {
      return {
        likes: this.compactNumber(post?.likes_count ?? 0),
        comments: this.compactNumber(post?.comments_count ?? 0),
        views: this.compactNumber(post?.views_count ?? 0),
      };
    },

    postMediaStyle(post, index) {
      const color = COVER_COLORS[(Number(post?.id ?? index) + index) % COVER_COLORS.length];
      return { '--media-color': color };
    },

    authorMeta(author) {
      const posts = Number(author?.posts_count || 0);
      const books = Number(author?.books_count || 0);
      const parts = [];
      if (books) parts.push(`${books} ${this.plural(books, ['книга', 'книги', 'книг'])}`);
      parts.push(`${posts} ${this.plural(posts, ['пост', 'поста', 'постов'])}`);
      return parts.join(' · ');
    },

    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },

    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },

    isFollowing(author) {
      return this.authorIdsFollowing.includes(Number(author.id));
    },

    stripHtml(html) {
      if (!html) return '';
      if (typeof DOMParser === 'undefined') {
        return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      const doc = new DOMParser().parseFromString(String(html), 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    },

    formatNumber(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return '—';
      return number.toLocaleString('ru-RU').replace(/\u00A0/g, ' ');
    },

    compactNumber(value) {
      const number = Number(value) || 0;
      if (number < 1000) return String(number);
      const thousands = number / 1000;
      const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
      return `${String(rounded).replace('.', ',')} тыс.`;
    },

    plural(value, forms) {
      const number = Math.abs(Number(value) || 0);
      const mod10 = number % 10;
      const mod100 = number % 100;

      if (mod10 === 1 && mod100 !== 11) return forms[0];
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return forms[1];
      return forms[2];
    },
  },
};
</script>

<style scoped>
/* ==================================================================
   Libraria — home page (design handoff)
   ================================================================== */

.home {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ------------------------------------------------------------------
   Shared bits
   ------------------------------------------------------------------ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 46px;
  padding: 0 24px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn .icon-right-open {
  font-size: 11px;
}

.btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
}

.btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.btn--outline {
  color: var(--ink);
  background: var(--cream);
  border-color: var(--line);
}

.btn--outline:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.btn--gold {
  color: #241c0d;
  background: var(--gold);
}

.btn--gold:hover {
  color: #241c0d;
  background: #bb9445;
}

.btn--ghost-dark {
  color: var(--cream);
  background: transparent;
  border-color: rgba(251, 248, 242, 0.32);
}

.btn--ghost-dark:hover {
  color: var(--cream);
  background: rgba(251, 248, 242, 0.08);
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
}

.link-arrow .icon-right-open {
  font-size: 11px;
  transition: transform 0.2s ease;
}

.link-arrow:hover {
  color: var(--accent);
}

.link-arrow:hover .icon-right-open {
  transform: translateX(3px);
}

/* ------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------ */
.home-hero {
  padding: 62px 0 70px;
  background: var(--paper);
}

.home-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 583px;
  gap: 72px;
  align-items: start;
}

.home-hero__eyebrow {
  margin: 0 0 18px;
  font-size: 13px;
  color: var(--text-secondary);
}

.home-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 57px;
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.home-hero__title em {
  font-style: italic;
  color: var(--accent);
}

.home-hero__text {
  max-width: 452px;
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.62;
  color: var(--text-secondary);
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.home-hero__note {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 20px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.home-hero__note .icon-help-circled {
  font-size: 14px;
  color: var(--gold);
}

.stats {
  display: flex;
  margin: 34px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.stats__item {
  flex: 0 0 auto;
  margin-right: 34px;
  padding-right: 34px;
  border-right: 1px solid var(--line);
}

.stats__item:last-child {
  margin-right: 0;
  padding-right: 0;
  border-right: 0;
}

.stats dt {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
}

.stats dd {
  margin: 6px 0 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  color: var(--ink);
}

.home-hero__aside {
  position: relative;
  min-height: 516px;
  margin-top: 32px;
}

.stage {
  position: absolute;
  top: 0;
  right: 0;
  width: 514px;
  max-width: 100%;
  height: auto;
  aspect-ratio: 514 / 492;
  overflow: hidden;
  border-radius: 18px;
  background: var(--cream);
}

/* Geometry below is taken 1:1 from the design file:
   centre 200×300 (966,169), left 178×255 rotated -6° about its top-left
   corner at the panel edge (814,216), right 177×240 rotated 6° (1130,225). */
.stage__book {
  position: absolute;
  text-decoration: none;
  transform-origin: top left;
  transition: transform 0.35s ease;
}

.stage__book--1 {
  top: 11.585%;
  left: 0;
  width: 34.63%;
  height: 51.83%;
  transform: rotate(-6deg);
}

.stage__book--2 {
  top: 2.03%;
  left: 29.57%;
  z-index: 3;
  width: 38.91%;
  height: 60.98%;
}

.stage__book--3 {
  top: 13.41%;
  left: 61.48%;
  width: 34.44%;
  height: 48.78%;
  transform: rotate(6deg);
}

.stage__book:hover {
  transform: translateY(-6px) rotate(-6deg);
}

.stage__book--2:hover {
  transform: translateY(-6px);
}

.stage__book--3:hover {
  transform: translateY(-6px) rotate(6deg);
}

/* The stage sets the size, so the cover fills its slot instead of
   deriving the height from the 2:3 poster ratio */
.stage__book .cover-art {
  height: 100%;
  aspect-ratio: auto;
}

.stage__book .cover-art__title {
  font-size: 19px;
}

.stage__book--1 .cover-art__title,
.stage__book--3 .cover-art__title {
  font-size: 16px;
}

.cover-art {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  width: 100%;
  aspect-ratio: 2 / 3;
  padding: 20px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--cover-color, var(--accent));
  box-shadow: 0 18px 34px rgba(30, 33, 36, 0.18);
}

.cover-art__frame {
  position: absolute;
  inset: 11px;
  border: 1px solid rgba(251, 248, 242, 0.22);
  border-radius: 4px;
  pointer-events: none;
}

.cover-art__genre {
  position: absolute;
  top: 26px;
  left: 26px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: rgba(251, 248, 242, 0.72);
}

.cover-art__title {
  font-family: var(--font-display);
  font-size: 19px;
  line-height: 1.16;
  color: #fbf8f2;
}

.cover-art__author {
  font-size: 11px;
  color: rgba(251, 248, 242, 0.72);
}

.cover-art--compact {
  padding: 18px;
}

.cover-art--compact .cover-art__genre {
  top: 22px;
  left: 20px;
}

.cover-art--compact .cover-art__title {
  font-size: 17px;
}

.home-hero__cards {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
}

.today {
  width: 320px;
  min-height: 158px;
  padding: 20px 24px;
  border-radius: 16px;
  background: var(--cream);
  box-shadow: 0 14px 34px rgba(30, 33, 36, 0.08);
}

.today__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.today__head time {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
}

.today__quote {
  margin: 16px 0 8px;
  font-family: var(--font-display);
  font-size: 18px;
  font-style: italic;
  line-height: 1.3;
  color: var(--ink);
}

.today__author {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-muted);
}

.steps {
  width: 240px;
  min-height: 152px;
  margin: 0;
  padding: 22px 20px;
  list-style: none;
  border-radius: 16px;
  background: #1e2124;
}

.steps__item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  line-height: 1.3;
  color: var(--cream);
}

.steps__item + .steps__item {
  margin-top: 14px;
}

.steps__num {
  display: inline-flex;
  flex: 0 0 24px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 11px;
  font-weight: 600;
  color: #2b2f31;
  border-radius: 50%;
  background: #6b6f70;
}

.steps__num.is-first {
  color: #2b2314;
  background: var(--gold);
}

/* ------------------------------------------------------------------
   Sections
   ------------------------------------------------------------------ */
.home-section {
  padding: 90px 0 88px;
}

.home-section--books,
.home-section--authors {
  background: var(--cream);
}

.home-section--books {
  padding-bottom: 104px;
}

.home-section--posts {
  padding-bottom: 72px;
}

.home-section--authors {
  padding-bottom: 80px;
}

.home-section--plans {
  padding-top: 80px;
}

.home-section--posts,
.home-section--plans {
  background: var(--paper);
}

.home-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 33px;
}

.home-section__intro h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.home-section__intro p {
  max-width: 520px;
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.home-section__tools {
  display: flex;
  align-items: center;
  gap: 26px;
  padding-top: 32px;
}

.home-section__hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 30px 0 0;
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
}

.home-section__hint .icon-lock {
  color: var(--gold);
}

.home-section__empty {
  margin: 0;
  padding: 28px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.segmented {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--cream);
  border: 1px solid var(--line);
}

.segmented button {
  height: 32px;
  padding: 0 16px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.segmented button.is-active {
  color: var(--cream);
  background: #1e2124;
}

/* Books grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
}

.shelf-card {
  min-width: 0;
}

.shelf-card__cover {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 8px;
  background: var(--cover-color, var(--accent));
  box-shadow: 0 10px 22px rgba(30, 33, 36, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.shelf-card__cover:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 32px rgba(30, 33, 36, 0.18);
}

.shelf-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shelf-card__cover .cover-art {
  box-shadow: none;
}

.shelf-card__title {
  margin: 16px 0 0;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.shelf-card__title a {
  color: inherit;
  text-decoration: none;
}

.shelf-card__title a:hover {
  color: var(--accent);
}

.shelf-card__author {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.shelf-card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.shelf-card__meta b {
  font-weight: 500;
  color: var(--text-secondary);
}

.shelf-card__meta .icon-star {
  font-size: 11px;
  color: var(--gold);
}

.shelf-card__dot {
  margin: 0 1px;
}

/* ------------------------------------------------------------------
   Posts
   ------------------------------------------------------------------ */
.posts {
  display: grid;
  grid-template-columns: minmax(0, 698px) minmax(0, 1fr);
  gap: 24px;
}

.post-featured {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  border-radius: 14px;
  background: var(--cream);
  border: 1px solid var(--line);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.post-featured:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(30, 33, 36, 0.1);
}

.post-featured__media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 380px;
  overflow: hidden;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.post-featured__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-media__letter {
  font-family: var(--font-display);
  font-size: 96px;
  color: rgba(251, 248, 242, 0.28);
}

.post-featured__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 338px;
  padding: 22px 24px 24px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-muted);
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  font-size: 11px;
  color: var(--accent);
  background: #e6eddd;
  border: 0;
  border-radius: 999px;
}

.chip--sm {
  height: 20px;
  padding: 0 8px;
  font-size: 10px;
}

.chip--blue {
  color: #24324a;
  background: #e2e7ee;
}

.chip--gold {
  color: #6d5220;
  background: #f0e5cd;
}

.chip--sage {
  color: #3c5c47;
  background: #e2ebdf;
}

.post-featured__title {
  min-height: 62px;
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.post-featured__excerpt {
  min-height: 44px;
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.post-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.post-author__avatar {
  display: inline-flex;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  border-radius: 50%;
  background: var(--accent-light);
}

.post-author__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-author__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.post-author__info strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.post-author__info small {
  overflow: hidden;
  font-size: 11px;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.post-stats span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.post-stats [class^='icon-'] {
  font-size: 12px;
}

.post-stats--sm {
  margin: 8px 0 0;
  gap: 12px;
  font-size: 11px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.post-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 176px;
  padding: 18px;
  text-decoration: none;
  border-radius: 14px;
  background: var(--cream);
  border: 1px solid var(--line);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.post-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(30, 33, 36, 0.08);
}

.post-mini__media {
  position: relative;
  display: flex;
  flex: 0 0 96px;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 10px;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.post-mini__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-mini__media .post-media__letter {
  font-size: 40px;
}

.post-mini__body {
  min-width: 0;
}

.post-mini h4 {
  display: -webkit-box;
  overflow: hidden;
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-mini__author {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* ------------------------------------------------------------------
   Authors
   ------------------------------------------------------------------ */
.author-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 264px;
  padding: 28px 20px 22px;
  text-align: center;
  border-radius: 14px;
  background: var(--paper);
  border: 1px solid var(--line);
}

.author-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--accent);
  text-decoration: none;
  border-radius: 50%;
  background: var(--accent-light);
}

.author-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-card__name {
  margin: 18px 0 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--ink);
}

.author-card__meta {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.author-card__action {
  width: 100%;
  height: 38px;
  margin-top: 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.author-card__action:hover {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.author-card__action.is-done {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: var(--accent);
}

.author-card__action:disabled {
  opacity: 0.6;
  cursor: default;
}

/* ------------------------------------------------------------------
   Plans + CTA
   ------------------------------------------------------------------ */
.plans {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.plans__intro h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.plans__intro > p {
  max-width: 360px;
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.plans__note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  max-width: 372px;
  margin-top: 24px !important;
  padding: 14px 16px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--text-secondary);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.plans__note .icon-attention-alt {
  margin-top: 2px;
  color: var(--gold);
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 21px;
}

.plan {
  padding: 26px 24px 32px;
  border-radius: 12px;
  background: var(--cream);
  border: 1px solid var(--line);
}

.plan__badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  font-size: 11px;
  color: var(--text-secondary);
  background: #efe7d8;
  border-radius: 999px;
}

.plan__name {
  margin: 18px 0 0;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  color: var(--ink);
}

.plan__term {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.plan__price {
  margin: 26px 0 0;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 500;
  color: var(--ink);
}

.plan__price span {
  font-size: 20px;
}

.plan__hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.plan--premium {
  color: var(--cream);
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 16px 36px rgba(54, 81, 63, 0.22);
}

.plan--premium .plan__badge {
  color: #2b2314;
  background: var(--gold);
}

.plan--premium .plan__name,
.plan--premium .plan__price {
  color: var(--cream);
}

.plan--premium .plan__term,
.plan--premium .plan__hint {
  color: rgba(251, 248, 242, 0.72);
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 220px;
  margin-top: 65px;
  padding: 44px 52px;
  border-radius: 20px;
  background: #1e2124;
}

.cta__copy h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--cream);
}

.cta__copy p {
  max-width: 540px;
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: #b6bab3;
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

/* ------------------------------------------------------------------
   Toast
   ------------------------------------------------------------------ */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  font-size: 13px;
  color: var(--cream);
  background: #1e2124;
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(30, 33, 36, 0.28);
  transform: translateX(-50%);
}

.toast .icon-ok {
  color: #9cc09f;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* ------------------------------------------------------------------
   Responsive
   ------------------------------------------------------------------ */
/* ==================================================================
   Authenticated home
   ================================================================== */
.uh-hero {
  padding: 32px 0 64px;
  background: var(--paper);
}

.uh-hero__grid {
  display: grid;
  grid-template-columns: 800px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.uh-eyebrow {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--text-secondary);
}

.uh-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.uh-sub {
  max-width: 560px;
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.uh-continue {
  min-height: 265px;
  padding: 24px 28px 26px 24px;
  margin-top: 76px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(30, 33, 36, 0.05);
}

.uh-continue__label {
  display: block;
  margin: 0 0 12px 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.uh-continue__body {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.uh-continue__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.uh-continue__cover {
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100px;
  height: 150px;
  padding: 12px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--cover-color, var(--accent));
  text-decoration: none;
}

.uh-continue__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uh-continue__cover-text {
  position: relative;
  font-family: var(--font-display);
  font-size: 12px;
  line-height: 1.2;
  color: #fbf8f2;
}

.uh-continue__info h2 {
  margin: 2px 0 0;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.uh-continue__meta {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.uh-continue__blurb {
  max-width: 600px;
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.uh-progress {
  margin-top: 18px;
}

.uh-progress__bar {
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--line);
}

.uh-progress__bar span {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: var(--accent);
}

.uh-progress__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  font-size: 12px;
  color: var(--text-muted);
}

.uh-continue__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 22px;
}

.uh-continue__actions .btn {
  height: 44px;
  padding: 0 22px;
}

.uh-link {
  padding-bottom: 2px;
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px solid var(--line-strong);
}

.uh-link:hover {
  color: var(--accent);
}

.uh-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.uh-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  color: var(--ink);
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

.uh-ghost:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.uh-ghost__icon {
  flex: 0 0 auto;
  color: var(--accent);
}

.uh-hero__side {
  margin-top: 112px;
}

.uh-quote {
  min-height: 190px;
  padding: 18px 24px;
  color: var(--cream);
  background: #202426;
  border-radius: 18px;
}

.uh-quote__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: rgba(251, 248, 242, 0.6);
}

.uh-quote__text {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: 19px;
  font-style: italic;
  line-height: 1.32;
  color: var(--cream);
}

.uh-quote__author {
  margin: 10px 0 0;
  font-size: 12px;
  color: rgba(251, 248, 242, 0.6);
}

.uh-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 20px 0 0;
  padding: 22px 0;
  text-align: center;
  background: var(--cream);
  border-radius: 24px;
}

.uh-stats div + div {
  border-left: 1px solid var(--line);
}

.uh-stats dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  color: var(--ink);
}

.uh-stats dt {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-muted);
}

.uh-section {
  padding: 64px 0;
}

.uh-section--feed {
  background: var(--cream);
}

.uh-section--books {
  background: var(--paper);
}

.uh-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.uh-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.uh-head p {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.uh-head .segmented {
  margin-top: 6px;
}

.uh-posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.uh-post {
  display: flex;
  flex-direction: column;
  min-height: 516px;
  overflow: hidden;
  text-decoration: none;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.uh-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(30, 33, 36, 0.09);
}

.uh-post__media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  overflow: hidden;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.uh-post__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uh-post__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
}

.uh-post h3 {
  margin: 12px 0 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.uh-post__excerpt {
  display: -webkit-box;
  overflow: hidden;
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.uh-post__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
}

.uh-post__foot .post-stats {
  gap: 12px;
}

.uh-empty {
  margin: 0;
  padding: 24px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.uh-empty--sm {
  padding: 8px 0 0;
  font-size: 12px;
}

.uh-layout {
  display: grid;
  grid-template-columns: 798px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.uh-shelf {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.uh-shelf .shelf-card__cover {
  aspect-ratio: 181.5 / 240;
}

.uh-shelf .shelf-card__title {
  margin-top: 14px;
  font-size: 15px;
}

.uh-catalog-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
}

.uh-catalog-link:hover {
  color: var(--accent);
}

.uh-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.uh-card {
  padding: 30px 24px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
}

.uh-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.uh-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.uh-card__count {
  font-size: 12px;
  color: var(--text-muted);
}

.uh-sub-head {
  margin: 28px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.uh-authors {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.uh-authors li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.uh-author {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.uh-author__avatar {
  display: flex;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  overflow: hidden;
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.uh-author__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uh-author__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.uh-author__info strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.uh-author__info small {
  overflow: hidden;
  font-size: 11px;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uh-pill {
  height: 27px;
  padding: 0 12px;
  font-family: var(--font-sans);
  font-size: 11px;
  white-space: nowrap;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.uh-pill:hover {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.uh-pill--done {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: transparent;
  cursor: default;
}

.uh-card--plans .uh-card__lead {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.uh-plans {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.uh-plans li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.uh-plans li:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.uh-plans__info {
  display: flex;
  flex-direction: column;
}

.uh-plans__info b {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.uh-plans__info small {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}

.uh-plans__price {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--ink);
  white-space: nowrap;
}

.uh-note {
  margin: 16px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-muted);
}

@media (max-width: 1279px) {
  .uh-hero__grid {
    grid-template-columns: minmax(0, 1fr) 360px;
  }

  .uh-layout {
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 28px;
  }

  .uh-shelf {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1279px) {
  .home-hero__grid {
    grid-template-columns: minmax(0, 1fr) 500px;
    gap: 40px;
  }

  .stage {
    width: 100%;
  }

  .stage__book--3 {
    right: -20px;
    left: auto;
  }

  .book-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }

  .posts {
    grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  }
}

@media (max-width: 1024px) {
  .uh-hero__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .uh-hero__side {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    margin-top: 0;
  }

  .uh-stats {
    margin: 0;
  }

  .uh-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .uh-posts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-hero {
    padding-top: 40px;
  }

  .home-hero__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .home-hero__aside {
    min-height: 470px;
  }

  .home-hero__title {
    font-size: 46px;
  }

  .home-section {
    padding: 56px 0 64px;
  }

  .home-section__head {
    flex-direction: column;
    gap: 18px;
    margin-bottom: 28px;
  }

  .home-section__tools,
  .home-section__hint {
    margin-top: 0;
    padding-top: 0;
  }

  .posts {
    grid-template-columns: minmax(0, 1fr);
  }

  .author-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .plans {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
  }

}

@media (max-width: 760px) {
  .uh-title {
    font-size: 32px;
  }

  .uh-hero__side {
    grid-template-columns: minmax(0, 1fr);
  }

  .uh-continue {
    padding: 18px;
  }

  .uh-continue__body {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 14px;
  }

  .uh-continue__cover {
    width: 84px;
    height: 126px;
  }

  .uh-continue__actions {
    flex-wrap: wrap;
    gap: 12px;
  }

  .uh-posts {
    grid-template-columns: minmax(0, 1fr);
  }

  .uh-post__media {
    height: 200px;
  }

  .uh-shelf {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .uh-head {
    flex-direction: column;
  }

  .home-hero__aside {
    min-height: 0;
  }

  /* On phones the fan is rebuilt at a fixed size so the panel hugs the
     covers instead of keeping the tall desktop proportion */
  .stage {
    position: relative;
    width: 100%;
    height: 296px;
    aspect-ratio: auto;
  }

  .stage__book--1 {
    top: 46px;
    left: -14px;
    width: 132px;
    height: 189px;
  }

  .stage__book--2 {
    top: 18px;
    left: 50%;
    width: 150px;
    height: 225px;
    transform: translateX(-50%);
  }

  .stage__book--3 {
    top: 54px;
    right: -14px;
    left: auto;
    width: 130px;
    height: 176px;
  }

  .stage__book .cover-art {
    gap: 3px;
    padding: 14px;
  }

  .stage__book .cover-art__title {
    font-size: 14px;
  }

  .stage__book--1 .cover-art__title,
  .stage__book--3 .cover-art__title {
    font-size: 12px;
  }

  .stage__book .cover-art__author {
    font-size: 9px;
  }

  .stage__book .cover-art__genre {
    top: 17px;
    left: 17px;
    font-size: 8px;
    letter-spacing: 0.08em;
  }

  .stage__book .cover-art__frame {
    inset: 8px;
  }

  .home-hero__cards {
    position: static;
    flex-direction: column;
    margin-top: 16px;
  }

  .today,
  .steps {
    width: 100%;
  }

  .home-hero__title {
    font-size: 38px;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .stats__item {
    margin-right: 0;
    padding-right: 0;
    border-right: 1px solid var(--line);
  }

  .stats__item:last-child {
    border-right: 0;
  }

  .today {
    min-height: 0;
  }

  .home-hero__actions .btn {
    flex: 0 0 50px;
    width: 100%;
  }

  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .author-grid,
  .plan-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .post-featured__media {
    height: 240px;
  }

  .post-featured__title {
    font-size: 22px;
  }

  .post-mini {
    gap: 12px;
  }

  .post-mini__media {
    flex-basis: 78px;
    width: 78px;
    height: 78px;
  }

  .cta {
    padding: 26px 22px;
  }

  .cta__copy h2 {
    font-size: 26px;
  }
}

@media (max-width: 760px) {
  .home-hero {
    padding: 24px 0 38px;
    text-align: center;
  }

  .home-hero__eyebrow {
    margin-bottom: 14px;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .home-hero__title {
    font-size: 40px;
    line-height: 1.02;
  }

  .home-hero__text {
    max-width: 340px;
    margin: 14px auto 0;
    font-size: 14px;
    line-height: 1.55;
  }

  .home-hero__actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .home-hero__actions .btn {
    width: 100%;
    height: 50px;
    font-size: 14px;
  }

  .home-hero__note {
    justify-content: center;
    margin-top: 16px;
    font-size: 11.5px;
    line-height: 1.4;
    text-align: left;
  }

  .home-hero__note .icon-help-circled {
    margin-top: 2px;
  }

  .home-hero__aside {
    margin-top: 26px;
  }

  .home-hero__cards {
    flex-direction: column;
    gap: 14px;
  }

  .today,
  .steps {
    width: 100%;
  }

  .stats {
    margin-top: 26px;
    text-align: left;
  }

  .home-section {
    padding: 44px 0 46px;
  }

  .home-section__head {
    margin-bottom: 20px;
  }

  .home-section__intro h2 {
    font-size: 26px;
  }

  .home-section__intro p {
    font-size: 13px;
  }

  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 14px;
  }

  .post-featured__media {
    height: 200px;
  }

  .post-featured__title {
    font-size: 19px;
  }

  .post-featured__body {
    min-height: 0;
    padding: 16px;
  }

  .post-mini {
    min-height: 0;
    padding: 14px;
  }

  .post-mini__media {
    flex-basis: 76px;
    width: 76px;
    height: 76px;
  }

  .post-mini h4 {
    font-size: 15px;
  }

  .section__hint {
    margin-top: 0;
  }

  .author-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .author-card {
    min-height: 0;
    padding: 20px 14px 16px;
  }

  .author-card__avatar {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }

  .author-card__name {
    font-size: 15px;
  }

  .plan-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .cta {
    padding: 24px 20px;
  }

  .cta__copy h2 {
    font-size: 24px;
  }

  .cta__actions {
    width: 100%;
  }

  .cta__actions .btn {
    flex: 1 1 160px;
  }
}

@media (max-width: 420px) {
  .home-hero__title {
    font-size: 32px;
  }

  .book-grid {
    gap: 16px;
  }
}

/* ------------------------------------------------------------------
   «Что почитать»: размер обложек по ширине экрана
   ------------------------------------------------------------------ */
@media (max-width: 1024px) {
  .book-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 700px) {
  .book-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
}

@media (max-width: 520px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 14px;
  }
}

</style>
