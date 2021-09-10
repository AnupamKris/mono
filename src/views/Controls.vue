<template>
  <div class="statusmenu" :class="{ inview: showStatus }">
    <div class="text">
      <div class="name">
        {{ statusData.name }}
      </div>
      <div class="close" @click="showStatusMenu">
        <i class="fa fa-times"></i>
      </div>
    </div>
    <div class="balance">
      <div>Balance</div>
      <div>{{ statusData.balance }}</div>
    </div>
    <div class="debts">
      <div class="gives">
        <div class="give">To Give</div>
        <div
          class="give"
          v-for="(item, key) in statusData.debts.give"
          :key="key"
        >
          <div class="item">{{ item }}</div>
          <i class="fa fa-arrow-right"></i>
          <div class="key">{{ key }}</div>
        </div>
      </div>
      <div class="gets">
        <div class="get">To Get</div>
        <div class="get" v-for="(item, key) in statusData.debts.get" :key="key">
          <div class="item">{{ item }}</div>
          <i class="fa fa-arrow-left"></i>
          <div class="key">{{ key }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="debtmenu" :class="{ inview: showDebt }">
    <div class="text">{{ debtText }}</div>
    <div class="buttons">
      <div class="btn red" @click="closeDebtMenu">No</div>
      <div class="btn colored" @click="addDebt">Yes</div>
    </div>
  </div>
  <div class="allBal" :class="{ inview: showBal }">
    <div class="pl-wrapper">
      <div class="player" v-for="(item, index) in players" :key="index">
        <div class="name">
          {{ item }}
        </div>
        <div class="bal">
          {{ getBalance(item) }}
        </div>
      </div>
    </div>
    <div class="close" @click="showAllBal">
      <i class="fa fa-times"></i>
    </div>
  </div>
  <div class="history" :class="{ inview: showHistory }">
    <div class="tr-wrapper">
      <div
        class="transaction"
        v-for="(item, index) in transactions"
        :key="index"
      >
        <div class="pts pts-from">{{ item.from }}</div>
        <i class="sym fa fa-arrow-right"></i>
        <div class="pts pts-to">{{ item.to }}</div>
        <i class="sym fa fa-angle-double-right"></i>
        <div class="pts amount">{{ item.amount }}</div>
      </div>
    </div>
    <div class="close" @click="showAllTrans">
      <i class="fa fa-times"></i>
    </div>
  </div>
  <div class="controls">
    <div class="players">
      <div class="from">
        <div
          class="player"
          v-for="(item, index) in players"
          :key="index"
          @click="chooseFrom(item)"
          @dblclick="showStatusMenu(item)"
          :class="{ colored: '#0088ff' ? currentFrom == item : '#141414' }"
        >
          {{ item }}
        </div>
      </div>
      <div class="to">
        <div
          class="player"
          v-for="(item, index) in players"
          :key="index"
          @click="chooseTo(item)"
          :class="{ colored: '#0088ff' ? currentTo == item : '#141414' }"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="input">
      <input type="text" v-model="amount" />
      <input type="text" v-model="log" />
    </div>
    <div class="controlbar">
      <div class="numbers">
        <div
          class="number"
          v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="index"
          @click="addDigit(item)"
          :class="{
            red: true ? item == 'X' : false,
            green: true ? item == 'Send' : false,
          }"
        >
          {{ item }}
        </div>
        <div class="number red" @dblclick="deleteAll" @click="deleteChar">
          <i class="fa fa-times"></i>
        </div>
        <div class="number" @click="addDigit(0)">0</div>
        <div class="number go" @click="giveGO">GO</div>
      </div>
      <div class="extras">
        <div class="btn undo" @click="undo"><i class="fa fa-undo"></i></div>
        <div class="btn allbal" @click="showAllBal">
          <i class="fa fa-pager"></i>
        </div>
        <div class="btn allbal" @click="showAllTrans">
          <i class="fa fa-file"></i>
        </div>
        <div class="btn green" @click="sendAmount">
          <i class="fa fa-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Controls",
  data() {
    return {
      players: this.$store.state.players,
      from: "",
      to: "",
      amount: "",
      balance: {},
      debts: {},
      log: "",
      showHistory: false,
      transactions: [],
      showBal: false,
      showDebt: false,
      debtText: "",
      showStatus: false,
      statusData: { name: "", balance: "", debts: { give: {}, get: {} } },
    };
  },
  methods: {
    showStatusMenu(name) {
      if (name == "Bank") {
        this.showAllBal();
      } else {
        if (!this.showStatus) {
          this.statusData = {
            name: name,
            debts: this.debts[name],
            balance: this.balance[name],
          };
        }
        this.showStatus = !this.showStatus;
      }
    },
    closeDebtMenu() {
      this.showDebt = false;
    },
    showDebtMenu(from, to, amount) {
      this.showDebt = true;
      this.debtText = `You have insufficient Balance. You need $${amount} more. Would you like to add it as a debt to ${to}?`;
    },
    addDebt() {
      const debt = this.amount - this.balance[this.from];
      console.log(debt);
      this.debts[this.from].give[this.to] += debt;
      this.debts[this.to].get[this.from] += debt;
      this.amount -= debt;
      this.showDebt = false;
      this.sendAmount();
    },
    chooseFrom(name) {
      console.log(name);
      this.from = name;
    },
    chooseTo(name) {
      console.log(name);
      this.to = name;
    },
    addDigit(num) {
      this.amount += num;
    },
    getBalance(name) {
      return this.balance[name];
    },
    showBalance(name) {
      this.logger(name + " Balance : " + this.balance[name]);
    },
    deleteChar() {
      this.amount = this.amount.slice(0, -1);
    },
    sendAmount() {
      if (this.amount == "") {
        this.amount = "0";
      }
      if (this.to != "Bank") {
        let debt = this.debts[this.to].give[this.from];
        if (debt > 0) {
          if (debt >= this.amount) {
            this.debts[this.to].give[this.from] -= parseInt(this.amount);
            this.debts[this.from].get[this.to] -= parseInt(this.amount);
            this.logger("Reduced " + this.amount + " from Debt");
            this.amount = "";
          } else {
            this.amount -= debt;
            this.debts[this.to].give[this.from] = 0;
            this.debts[this.from].get[this.to] = 0;
            this.sendAmount();
          }
        } else if (this.amount > this.balance[this.from]) {
          this.showDebtMenu(
            this.from,
            this.to,
            this.amount - this.balance[this.from]
          );
        } else {
          this.balance[this.from] -= parseInt(this.amount);
          this.balance[this.to] += parseInt(this.amount);
          this.logger(
            "Sent " + this.amount + " from " + this.from + " to " + this.to
          );
          this.transactions.push({
            from: this.from,
            to: this.to,
            amount: this.amount,
          });
          this.amount = "";
        }
      } else {
        if (this.balance[this.from] >= this.amount) {
          this.balance[this.from] -= parseInt(this.amount);
          this.balance[this.to] += parseInt(this.amount);
          this.logger(
            "Sent " + this.amount + " from " + this.from + " to " + this.to
          );
          this.transactions.push({
            from: this.from,
            to: this.to,
            amount: this.amount,
          });
          this.amount = "";
        } else {
          this.logger(
            "Insufficient balance need " +
              (this.amount - this.balance[this.from]) +
              " more!"
          );
        }
      }
    },
    showAllTrans() {
      this.showHistory = !this.showHistory;
    },
    showAllBal() {
      this.showBal = !this.showBal;
    },
    giveGO() {
      this.to = this.from;
      this.from = "Bank";
      this.amount = 200;
      this.sendAmount();
    },
    undo() {
      const transaction = this.transactions.pop();

      const from = transaction.from;
      const to = transaction.to;
      const amount = transaction.amount;
      this.balance[to] -= parseInt(amount);
      this.balance[from] += parseInt(amount);
      this.logger("Undoed last transaction");
    },
    deleteAll() {
      this.amount = "";
    },
    logger(msg) {
      this.log = msg;
      setTimeout(() => {
        this.log = "";
      }, 2000);
    },
    showAllBal() {
      this.showBal = !this.showBal;
    },
  },
  computed: {
    currentFrom() {
      return this.from;
    },
    currentTo() {
      return this.to;
    },
  },
  mounted() {
    this.players.forEach((item) => {
      if (item == "Bank") {
        this.balance[item] = 150000;
      } else {
        this.debts[item] = { give: {}, get: {} };
        this.balance[item] = 1500;
      }
    });
    this.players.forEach((from) => {
      this.players.forEach((to) => {
        if (from != to && from != "Bank" && to != "Bank") {
          this.debts[from].give[to] = 0;
          this.debts[from].get[to] = 0;
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
.controls {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  background: #2e2b2b;
  .players {
    display: flex;
    width: 95%;
    height: 40%;
    .player {
      background: #141414;
      color: white;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px 2px;
      border-radius: 30px;
    }
    .from {
      width: 100%;
    }
    .to {
      width: 100%;
    }
  }
}
.colored {
  background: #0088ff !important;
}

.input {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  input {
    height: 95%;
    width: calc(95% - 20px);
    border: 2px solid #2e2b2b;
    background: #141414;
    color: white;
    padding: 0 10px;
    outline: none;
    border-radius: 25px;
    text-align: center;
    &:active {
      background: #0088ff;
    }
  }
}
.controlbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 50%;
  .extras {
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    flex-wrap: wrap;
    .btn {
      width: 80px;
      height: 80px;
      background: #0088ff;
      color: white;
      border-radius: 40px;
      transition: 0.3s;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 1px 0;
      font-size: 20px;
      &:hover {
        transition: 0.3s;
        background: #141414;
      }
    }
  }
  .numbers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 75%;
    height: 100%;

    .number {
      width: 80px;
      height: 80px;
      background: #141414;
      color: white;
      border-radius: 40px;
      transition: 0.3s;
      font-size: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 1px 0;
      &:hover {
        transition: 0.3s;
        background: #0088ff;
      }
    }
  }
}
.red {
  background: #ff3f3f !important;
}
.green {
  background: #27b127 !important;
}
.go {
  background: #c0f824 !important;
  color: black !important;
}
.history {
  position: fixed;
  transition: 0.3s;
  top: -100%;
  width: 100%;
  height: 100%;
  background: #181818;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .tr-wrapper {
    height: 90%;
    width: 100%;
    display: flex;
    // justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    margin: 10px 0;
    overflow: scroll;

    .transaction {
      width: 90%;
      min-height: 50px;
      background: #141414;
      margin: 2px 0;
      border-radius: 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .pts {
        width: 30%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }

      .pts-from {
        color: #ff3f3f;
      }
      .pts-to {
        color: #0088ff;
      }

      .sym {
        width: 10%;
        color: white;
      }
      .from {
        border-radius: 10px 0 0 10px;
        background: #ff3f3f;
      }
      .to {
        background: #0088ff;
      }
      .amount {
        width: 20%;
      }
    }
  }
  .close {
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 40px;
      background: #ff3f3f;
      height: 60px;
      width: 60px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
}

.allBal {
  position: fixed;
  top: -100%;
  transition: 0.3s;
  width: 100%;
  height: 100%;
  background: #181818;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .pl-wrapper {
    width: 100%;
    height: 90%;

    display: flex;
    flex-direction: column;

    align-items: center;
    margin: 10px 0;
    .player {
      height: 60px;
      width: 95%;
      margin: 10px 0;
      background: #141414;
      color: white;
      border-radius: 20px;

      display: flex;
      justify-content: space-around;
      align-items: center;
      .name,
      .bal {
        width: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
      }
      .bal {
        height: 40px;
        background: #181818;
        border-radius: 10px;
        margin: 0 10px;
      }
    }
  }
  .close {
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 40px;
      background: #ff3f3f;
      height: 60px;
      width: 60px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
}
.debtmenu {
  position: fixed;
  left: 5%;
  top: -100%;
  width: 90%;
  height: 30%;
  transition: 0.3s;
  background: #181818;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  .text {
    margin-top: 10px;
    height: 60%;
    width: 90%;
    background: #141414;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    color: white;
  }
  .buttons {
    height: 40%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    .btn {
      width: 40%;
      height: 40px;
      border-radius: 20px;
      color: white;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.statusmenu {
  position: fixed;
  transition: 0.3s;
  top: -100%;
  width: 100%;
  height: 100%;
  background: #181818;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  color: white;
  .text {
    width: 90%;
    background: #141414;
    height: 10%;
    border-radius: 10px;

    display: flex;
    justify-content: space-around;
    align-items: center;
    .name {
      flex: 3;
    }
    .close {
      flex: 1;
      height: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 40px;
        background: #ff3f3f;
        height: 60px;
        width: 60px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }
  .balance {
    width: 90%;
    background: #141414;
    height: 10%;
    border-radius: 10px;

    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .debts {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 75%;
    .gives,
    .gets {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      height: 45%;
      width: 90%;
      border-radius: 10px;
      background: #141414;
      .give,
      .get {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 95%;
        height: 40px;
        border-radius: 10px;
        background: #111111;
      }
    }
  }
}
.inview {
  top: 0;
}
</style>

