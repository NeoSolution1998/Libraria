<template>
  <header-vue></header-vue>
  <div class="vuex-container">
    <div class="grid-list1">
      <div class="grid-item1">
        <span>search</span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. At voluptatum perspiciatis beatae assumenda eum eveniet
        rem facilis accusantium, omnis non possimus culpa vitae praesentium? Sapiente at aperiam fugiat dolorum itaque?
        Ut nostrum velit nisi. Nostrum tempore animi earum quos a repellendus provident ea doloribus ducimus
        reprehenderit fugit dolores fugiat obcaecati rerum sapiente repudiandae ut maxime optio, nemo doloremque
        temporibus? Maiores?
      </div>
    </div>
    <div class="grid-list2">
      <div class="grid-item2">
        <span>filters</span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro iste, pariatur animi commodi ex eligendi atque
        eveniet facere soluta vero amet obcaecati vel consectetur aliquam blanditiis, impedit dignissimos tempore
        explicabo?
        Minus quia explicabo voluptas at eum necessitatibus cum delectus officia animi aliquam non soluta, porro nihil
        ipsam. Tempore odio consectetur eligendi omnis quas voluptatibus. Nulla quis enim quae nostrum alias?
        Voluptas a nesciunt eos nisi, laborum natus perferendis animi porro maiores sequi ullam quae temporibus
        consequatur sed, vitae eligendi magnam error accusantium unde rerum iusto labore dolorem ut. Quidem,
        officia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam tenetur fugit ex voluptatem, nulla
        reprehenderit nisi voluptates accusamus! Totam provident atque laboriosam consectetur accusantium aperiam sunt
        eaque blanditiis error eius?
        Tenetur velit esse delectus cum obcaecati similique iure. Quidem beatae eligendi quas vel laborum ab officia
        odio minima. Id veritatis doloremque porro aspernatur cupiditate sunt rem amet tenetur culpa iure.
        Deleniti asperiores illum voluptas repudiandae eaque at iure, voluptatum repellat dolore eligendi minus quod
        aperiam, quidem accusantium error ut nam nemo quos fuga distinctio. Itaque quae ad temporibus quibusdam
        inventore.
        Excepturi, quam facere! Veniam libero cum quidem incidunt, iusto amet at sed placeat aperiam consequatur magnam
        eaque molestiae voluptatem quod inventore eum dolores beatae ratione iure excepturi. Nostrum, architecto
        expedita.
      </div>
    </div>
    <div class="grid-list3">
      <div v-if="numbers" class="grid-item3">
        <span>books</span>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat maiores repellat hic saepe? Debitis, mollitia!
        Voluptatum alias ad laudantium temporibus ducimus earum, autem dolorum iusto, odio fuga eaque voluptate cum!
        Animi sequi recusandae mollitia consequatur facere vel fuga! Odit error fugit nihil commodi accusantium, ratione
        fugiat officiis impedit inventore aliquam reiciendis cupiditate nulla! Saepe, exercitationem? Fugiat omnis ipsum
        accusamus modi?
        Nihil adipisci fugiat accusamus iure libero vero incidunt, accusantium excepturi ducimus ea error recusandae
        voluptatum vitae hic nesciunt aperiam quia tempore quis autem eveniet earum officiis at. Aliquam, rem dolor.
        At in architecto quasi autem illo distinctio dolores obcaecati aperiam earum numquam ducimus, explicabo et vero
        aliquam rerum iusto qui tenetur commodi repellendus provident ipsum facere quidem ullam. Sequi, a.
        Culpa accusantium perferendis quis, odit pariatur facere quod! Impedit totam recusandae nostrum magnam hic
        dolorum doloribus aliquid quaerat eligendi tempore. Numquam similique eos obcaecati ad suscipit, omnis
        necessitatibus quidem veritatis?
        Qui impedit tempora nisi dignissimos possimus nulla voluptatum necessitatibus consectetur est, iusto quasi,
        dolores voluptatem dolore deserunt. Incidunt laboriosam beatae totam provident vitae, cum in error et tempore
        assumenda alias.
        Rerum nostrum natus, error soluta provident quo reprehenderit, dolores tempore suscipit corrupti, expedita
        placeat veniam. Accusamus illum illo quo iste suscipit est exercitationem perspiciatis nam blanditiis. Quaerat
        porro quibusdam explicabo.
        Sint consectetur laborum ipsam eaque rerum officiis officia recusandae dolore magni at fugit quae cumque aliquid
        vel voluptas impedit in, dolorum eveniet nam vero. Similique, aperiam. Cupiditate nemo quasi quae?
        Amet omnis reprehenderit ab optio voluptatibus nobis aliquid labore doloremque iusto perspiciatis consequatur,
        laborum voluptate velit? Alias mollitia neque, deserunt non atque pariatur veritatis commodi, doloremque error
        modi, iste temporibus!
        Ullam minima iusto amet, id voluptas vero illo. Autem vero quas eius, perspiciatis cumque ullam provident
        tempora praesentium qui dolorem quaerat rerum ea corporis animi fuga enim corrupti perferendis nemo?
      </div>
      <div v-else>
        books not
      </div>
    </div>
  </div>
  <!-- Колонка с икноками -->
  <div class="container bg-white mt-5">
    <h2>Fontello Icons</h2>
    <fontello-icons></fontello-icons>
  </div>

  <footer-vue></footer-vue>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "vuexComponent",
  data() {
    return {
     
    };
  },
}
</script>
<style scoped>
.vuex-container {
  margin: auto;
  max-width: 1920px;
  display: grid;
  grid-template-areas:
    "search search"
    "filters books";
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto auto;
  column-gap: 5px;
  row-gap: 10px;
}

.grid-list1 {
  grid-area: search;
  background-color: var(--green);
}

.grid-list2 {
  background-color: var(--blue);
  grid-area: filters;
  align-self: start;

}

.grid-list3 {
  background-color: var(--red);
  grid-area: books;
  align-self: start;
}
</style>
