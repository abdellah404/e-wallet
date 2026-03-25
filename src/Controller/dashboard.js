import {getbeneficiaries ,finduserbyaccount,findbeneficiarieByid} from "../Model/database.js";
const user = JSON.parse(sessionStorage.getItem("currentUser"));
// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");
const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transfer-section");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
const submitTransferBtn=document.getElementById("submitTransferBtn");

// Guard
if (!user) {
  alert("User not authenticated");
  window.location.href = "/index.html";
}

// Events
  transferBtn.addEventListener("click", handleTransfersection);
  closeTransferBtn.addEventListener("click", closeTransfer);
  cancelTransferBtn.addEventListener("click", closeTransfer);
  submitTransferBtn.addEventListener("click",handleTransfer)


// Retrieve dashboard data
const getDashboardData = () => {
  const monthlyIncome = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);

  return {
    userName: user.name,
    currentDate: new Date().toLocaleDateString("fr-FR"),
    availableBalance: `${user.wallet.balance} ${user.wallet.currency}`,
    activeCards: user.wallet.cards.length,
    monthlyIncome: `${monthlyIncome} MAD`,
    monthlyExpenses: `${monthlyExpenses} MAD`,
  };
};

function renderDashboard(){
const dashboardData = getDashboardData();
if (dashboardData) {
  greetingName.textContent = dashboardData.userName;
  currentDate.textContent = dashboardData.currentDate;
  solde.textContent = dashboardData.availableBalance;
  incomeElement.textContent = dashboardData.monthlyIncome;
  expensesElement.textContent = dashboardData.monthlyExpenses;
  activecards.textContent = dashboardData.activeCards;
}
// Display transactions
transactionsList.innerHTML = "";
user.wallet.transactions.forEach(transaction => {
  const transactionItem = document.createElement("div");
  transactionItem.className = "transaction-item";
  transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
  `;
  transactionsList.appendChild(transactionItem);
});

}

renderDashboard();

// Transfer popup
function closeTransfer() {
  transferSection.classList.add("hidden");
}

function handleTransfersection() {
  transferSection.classList.remove("hidden");
}

// Beneficiaries
const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();
function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type+"****"+card.numcards;
    sourceCard.appendChild(option);
    
  });
}

renderCards();


const checkUser = (numcompte)=> new Promise((resolve, reject)=>{
  setTimeout(()=>{
     const beneficiary=finduserbyaccount(numcompte);
     if(beneficiary){
        resolve(beneficiary);
     }
     else{
        reject("beneficiary not found");
     }
     },200);

});



const checkSolde = (expediteur, amount)=> new Promise((resolve, reject)=>{
  setTimeout(()=>{
      if(expediteur.wallet.balance>amount){
        resolve("Sufficient balance");
      }else{
        reject("Insufficient balance");
      }
  },300)
});

const updateSolde = (expediteur, destinataire, amount)=> new Promise((resolve, reject)=>{
    setTimeout(()=>{
        expediteur.wallet.balance-=amount;
        destinataire.wallet.balance+=amount;
        resolve("update balance done");
  },200);
});

const addtransactions = (expediteur, destinataire, amount)=> new Promise((resolve, reject)=>{
   setTimeout(()=>{
    // create credit transaction
 const credit={
    id:Date.now(),
    type:"credit",
    amount: amount,
    date: new Date().toLocaleString("fr-FR"),
    from: expediteur.name
 }
 //create debit transaction
const debit= {
    id:Date.now(),
    type:"debit",
    amount: amount,
    date: new Date().toLocaleString("fr-FR"),
    to: destinataire.name, 
 }
  expediteur.wallet.transactions.push(debit);
  destinataire.wallet.transactions.push(credit);
   resolve("transaction added successfully");
   },300)
})

// **************************************transfer***************************************************//

function transfer(expediteur,numcompte,amount){
  
   checkUser(numcompte)//p0
     .then( ()=> //p1
      checkSolde(expediteur, amount)) //p2
        .then(()=> //p3
           updateSolde(expediteur, finduserbyaccount(numcompte), amount))//p4
            .then(()=> //p5
              addtransactions(expediteur, finduserbyaccount(numcompte), amount)) //p6
                .then((message)=>{ //
                    console.log(message);
                    renderDashboard();
                  }).catch((error)=>{
                    console.log(error);
                  })
                  closeTransfer();

  
} 


function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

transfer(user, beneficiaryAccount, amount);
} 






    // -------------  Recharger  ----------------






    


    const rechargeBtn = document.getElementById("rechargeBtn");
    const rechargeSection = document.getElementById("recharge-section");
    const closeRechargeBtn = document.getElementById("closeRechargeBtn");
    const cancelChargeBtn = document.getElementById("cancelChargeBtn");
    const cardRecharge = document.getElementById("cardRecharge");
    const amountRecharge = document.getElementById("amountRecharge");
    const submitRechargeBtn = document.getElementById("submitRechargeBtn");

    rechargeBtn.addEventListener("click", handleRechargeSection);
    closeRechargeBtn.addEventListener("click", closeRecharge);
    cancelChargeBtn.addEventListener("click", closeRecharge);

    function handleRechargeSection() {
      rechargeSection.classList.remove("hidden");
    }

    function closeRecharge() {
      rechargeSection.classList.add("hidden");
    }

    user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type+"****"+card.numcards;
    cardRecharge.appendChild(option);
    
  });


  const checkAmount = (amount) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount >= 100 ) {
        resolve("Amount is valid");
      } else {
        reject("Amount invalid");
      }
    }, 200);
  });


  const addRechargeTransaction = (amount) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const credit = {
        id: Date.now(),
        type: "RECHARGE",
        amount: amount,
        date: new Date().toLocaleString(),
        from: "Card Recharge"
      };
      user.wallet.transactions.push(credit);
      user.wallet.balance += amount;
      resolve("Recharge successful");
    }, 300);
  });


const checkCard = (cardNumber) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const card = user.wallet.cards.find(c => c.numcards === cardNumber);
    if (card) {
      const expiryDate = new Date(card.expiry);
      const currentDate = new Date();
      console.log(user.name);
      
      console.log("Card expiry date:", expiryDate);
      console.log("Current date:", currentDate);
      if ((expiryDate - currentDate) > 0) {
        resolve("Card is valid");
      } else {
        reject("Card has expired");
      }
    } else {
      reject("Card not found");
    }
  }, 200);
});





  function recharge(amount) {
   checkAmount(amount)
      .then(() => {//add transaction
        return addRechargeTransaction(amount);

      }).then(() => {
        return checkCard(cardRecharge.value);
      })
      .then((message) => {
        console.log(message);
        renderDashboard();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submitRechargeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const amount = Number(amountRecharge.value);
    recharge(amount);
    closeRecharge();

  });



