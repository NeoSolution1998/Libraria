<template>
    <section class="subscriptions" v-if="subscriptions && subscriptions.length">
        <header class="subscriptions__header">
            <h1>Выберите план подписки</h1>
        </header>
        <div class="subscriptions__list">
            <article class="subscription-card" v-for="subscription in subscriptions" :key="subscription.id">
                <header class="subscription-card__header">
                    <h2>{{ subscription.name }}</h2>
                    <p class="subscription-card__access">{{ subscription.access_level }}</p>
                </header>
                <div class="subscription-card__features">
                    <ul>
                        <li>Доступ к тысячам книг</li>
                        <li><strong>Без рекламы</strong></li>
                        <li><strong>Стать автором</strong></li>
                        <li>Ежемесячные обновления</li>
                        <li>Скидки на книги и аудиокниги</li>
                    </ul>
                </div>
                <footer class="subscription-card__footer">
                    <p class="subscription-card__duration">Длительность: {{ subscription.duration_months }} мес</p>
                    <p class="subscription-card__price">Цена: {{ subscription.price }}р</p>
                    <a href="#" class="btn btn-primary subscription-card__cta">Оформить подписку</a>
                </footer>
            </article>
        </div>
    </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";


export default {

    name: "SubscriptionsComponent",
    data() {
        return {

        }
    },
    computed: {
        ...mapState({
            subscriptions: state => state.subscriptions.subscriptions,
        }),
    },
    methods: {
        ...mapActions({
            getSubscriptions: "subscriptions/getSubscriptions",

        }),
    },

    mounted() {
        this.getSubscriptions();
    },
};
</script>
<style scoped>
/* Using global styles from main.css - .btn, .btn-primary, etc. */

.subscriptions {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-10) var(--container-padding);
}

.subscriptions__header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.subscriptions__header h1 {
  font-size: var(--text-4xl);
  font-weight: 300;
  color: var(--ink);
  font-family: var(--font-display);
}

.subscriptions__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.subscription-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.subscription-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.subscription-card__header {
  background: var(--ink);
  color: var(--text-on-dark);
  padding: var(--space-4);
  margin: calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-5);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  text-align: center;
}

.subscription-card__header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-on-dark);
}

.subscription-card__access {
  font-size: var(--text-sm);
  opacity: 0.8;
  margin: 0;
}

.subscription-card__features {
  flex: 1;
  margin-bottom: var(--space-5);
}

.subscription-card__features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subscription-card__features li {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  padding: var(--space-2) 0;
  padding-left: var(--space-6);
  position: relative;
}

.subscription-card__features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: bold;
}

.subscription-card__footer {
  text-align: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.subscription-card__duration {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.subscription-card__price {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--ink);
  margin: var(--space-2) 0 var(--space-4);
}

.subscription-card__cta {
  width: 100%;
}

@media (max-width: 1024px) {
  .subscriptions {
    padding: var(--space-6) var(--space-4);
  }

  .subscriptions__header h1 {
    font-size: var(--text-3xl);
  }

  .subscriptions__list {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .subscription-card {
    padding: var(--space-5);
  }
}

@media (max-width: 640px) {
  .subscriptions {
    padding: var(--space-4) var(--space-3);
  }

  .subscriptions__header h1 {
    font-size: var(--text-2xl);
  }

  .subscription-card {
    padding: var(--space-4);
  }

  .subscription-card__header {
    margin: calc(-1 * var(--space-4)) calc(-1 * var(--space-4)) var(--space-4);
    padding: var(--space-3);
  }

  .subscription-card__features li {
    font-size: var(--text-xs);
    padding-left: var(--space-5);
  }

  .subscription-card__price {
    font-size: var(--text-lg);
  }
}
</style>