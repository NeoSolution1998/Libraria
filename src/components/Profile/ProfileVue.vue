<template>
  <div class="container">
    <div class="main-body">
      <div class="row gutters-sm">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                <img 
                  v-if="imageLoaded && user.images.length > 0" 
                  :src="user.images[0].image" 
                  alt="Admin" 
                  class="rounded-circle" 
                  width="150" 
                  @load="imageLoaded = true" 
                />
                <div v-else class="loader">Loading...</div>
                <div class="mt-3">
                  <p>Автор, креативщик</p>
                  <p>Россия</p>
                  <div class="d-grid gap-2 d-md-block">
                    <button class="btn btn-outline-dark mb-2 test">Добавить в друзья</button>
                    <button class="btn btn-outline-dark mb-2 test">Написать сообщение</button>
                    <button class="btn btn-outline-primary mt-3" @click="openImageUpload">Изменить фото</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Full Name</h6>
                </div>
                <div class="col-sm-9">{{ user.name }}</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Email</h6>
                </div>
                <div class="col-sm-9">{{ user.email }}</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Телефон</h6>
                </div>
                <div class="col-sm-9">(239) 816-9029</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Telegram</h6>
                </div>
                <div class="col-sm-9">(320) 380-4539</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Адрес</h6>
                </div>
                <div class="col-sm-9">Россия. РИ</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-12">
                  <a class="btn btn-info me-2" target="__blank"
                    href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills">Редактировать</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isImageUploadVisible" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Загрузить новое изображение</h5>
            <button type="button" class="close" @click="closeImageUpload">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="file" @change="handleFileChange" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeImageUpload">Закрыть</button>
            <button type="button" class="btn btn-primary" @click="handleImageUpload">Загрузить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "ProfileVue",
  props: ["user"],
  data() {
    return {
      isImageUploadVisible: false,
      imageFile: null,
      imageLoaded: false,
    };
  },
  watch: {
    user(newUser) {
      if (newUser.images && newUser.images.length > 0) {
        this.imageLoaded = true;
      }
    }
  },
  methods: {
    ...mapActions('images', ['fetchUserProfileImage', 'uploadImage']),
    openImageUpload() {
      this.isImageUploadVisible = true;
    },
    closeImageUpload() {
      this.isImageUploadVisible = false;
    },
    handleFileChange(event) {
      this.imageFile = event.target.files[0];
    },
    async handleImageUpload() {
      if (!this.imageFile) {
        alert('Выберите изображение');
        return;
      }

      try {
        console.log(this.imageFile);
        await this.uploadImage({
          file: this.imageFile,
          imagetable_id: this.user.id,
          image_type: 'App\\Model\\User',
        });

        await this.fetchUserProfileImage(this.user.id);
        this.imageLoaded = false; 
        this.closeImageUpload();
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
      }
    }
  }
};
</script>

<style>
.container {
  padding-top: 10px;
}

.test {
  margin-left: 5px;
}

.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 100px auto;
}

.modal-content {
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}

.loader {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
