<template>
    <div class="filters__date">
        <div class="filters__date_header">
            <label>Дата</label>
            <ResetButton :onReset="resetDateFilter">Сбросить</ResetButton>
        </div>

        <div class="filters__date_inputs">
            <input class="filters__date_input" type="date" v-model="startDate" @change="updateDateRange"
                placeholder="Начальная дата" />
            <input class="filters__date_input" type="date" v-model="endDate" @change="updateDateRange"
                placeholder="Конечная дата" />
        </div>
    </div>
</template>

<script>

export default {
    name: "DateFilter",

    data() {
        return {
            startDate: null, // Начальная дата
            endDate: null,   // Конечная дата
        };
    },
    methods: {
        resetDateFilter() {
            this.startDate = null; // Сбрасываем начальную дату
            this.endDate = null;   // Сбрасываем конечную дату
            this.updateDateRange(); // Обновляем модель
        },
        updateDateRange() {
            // Вы можете отправить данные в родительский компонент или сохранить их в состоянии
            console.log("Дата обновлена:", { startDate: this.startDate, endDate: this.endDate });
        },
    },
};
</script>

<style scoped>
.filters__date {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.filters__date_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filters__date label {
    font-size: 18px;

}

.filters__date_inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filters__date_input {
    border: none;
    background-color: var(--light);
    padding: 10px;
    padding-left: 15px;
    border-radius: 8px;
    width: 100%;
}

.filters__date_input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
}
</style>
