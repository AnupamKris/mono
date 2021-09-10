<template>
  <div class="namemenu trans" :class="{ inview: showName, hide: !showName }">
    <div class="text">
      <input
        class="trans"
        type="text"
        v-model="name"
        :class="{ hidden: !showName }"
        ref="input"
        @keyup.enter="addNew"
      />
    </div>
    <div class="buttons trans">
      <div
        class="btn red trans"
        @click="toggleNameMenu"
        :class="{ hidden: !showName }"
      >
        <i class="fa fa-times trans" :class="{ 'fa-hidden': !showName }"></i>
      </div>
      <div
        class="btn colored trans"
        @click="addNew"
        :class="{ hidden: !showName }"
      >
        <i class="fa fa-check trans" :class="{ 'fa-hidden': !showName }"></i>
      </div>
    </div>
  </div>
  <div class="home">
    <div class="players">
      <div class="player" v-for="(item, index) in players" :key="index">
        <div class="text">
          <p>
            {{ item }}
          </p>
        </div>
        <div class="remove" @click="removePlayer(item)">
          <i class="fa fa-times"></i>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="btn addnew" @click="toggleNameMenu">
        <i class="fa fa-plus"></i>
      </button>
      <button class="btn addnew" @click="remove">
        <i class="fa fa-minus"></i>
      </button>
      <button class="btn continue" @click="continue">
        <i class="fa fa-check"></i>
      </button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NewPlayer from "@/components/NewPlayer.vue";

export default {
  name: "Home",
  components: {
    NewPlayer,
  },
  data() {
    return {
      players: this.$store.state.players,
      name: "",
      showName: false,
    };
  },
  methods: {
    removePlayer(name) {
      var index = this.players.indexOf(name);
      if (index !== -1) this.players.splice(index, 1);
    },
    toggleNameMenu() {
      this.showName = !this.showName;
      this.$refs.input.focus();
    },
    addNew() {
      if (this.name) {
        this.players.push(this.name);
        this.name = "";
        this.toggleNameMenu();
        this.$refs.input.blur();
      }
    },
    remove() {
      this.players.pop();
    },
    continue() {
      this.$router.push("/controls");
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  overflow: auto;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #202020;
  color: white;

  .players {
    height: 80%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 5px;
    .player {
      width: 90%;
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #141414;
      border-radius: 25px;
      margin: 5px 0;

      .text {
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        p {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 80%;
          background: #202020;
          border-radius: 20px;
        }
      }
      .remove {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          color: #ee3535;
          background: #202020;
          border-radius: 20px;
          font-size: 20px;
        }
      }
    }
  }
  .buttons {
    height: 125px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    .addnew {
      width: 45%;
      background: #141414;
    }
    .btn {
      height: 50px;
      border-radius: 30px;
      border: none;
      color: white;
      margin: 5px 0;
      font-size: 20px;
    }
    .continue {
      background: #141414;
      width: 95%;
      color: #0088ff;
      font-weight: 600;
    }
  }
}
.namemenu {
  position: fixed;
  height: 150px;
  z-index: 1;
  left: 5%;
  top: 50%;
  width: 90%;
  transform: translateY(-50%);
  transition: 0.3s;
  background: #181818;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  .text {
    // margin-top: 10px;
    height: 75px;
    width: 90%;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    color: white;
    input {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      background: #303030;
      border: none;
      text-align: center;
      color: white;
      font-size: 20px;
      outline: none;
    }
  }
  .buttons {
    height: 75px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    .btn {
      display: none;
      width: 40%;
      height: 40px;
      border-radius: 20px;
      background: #303030;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.inview {
  height: 150px;
  display: flex;
}
.red {
  color: #ff3f3f !important;
}
.colored {
  color: #0088ff !important;
}

.trans {
  transition: 0.3s;
}

.hide {
  height: 0;
  z-index: -1;
}

.hidden {
  height: 0 !important;
}

.fa-hidden {
  font-size: 0;
}
</style>