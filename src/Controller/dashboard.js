import { findUserById, getAllUsers } from "../Model/database.js";

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (!currentUser) {
    window.location = "../View/login.html";
}




const greetingName = document.getElementById("greetingName");
const availableBalance = document.getElementById("availableBalance");
const monthlyExpenses = document.getElementById("monthlyExpenses");
const monthlyIncome = document.getElementById("monthlyIncome");
const activeCards = document.getElementById("activeCards");

greetingName.textContent = currentUser.name;

availableBalance.textContent =
currentUser.wallet.balance + " " + currentUser.wallet.currency;



const expenses = currentUser.wallet.transactions.filter(function(t){
    return t.type === "debit";
});

const totalExpenses = expenses.reduce(function(s,t){
    return s + t.amount;
},0);


const income = currentUser.wallet.transactions.filter(function(t){
    return t.type === "credit";
});

const totalIncome = income.reduce(function(s,t){
    return s + t.amount;
},0);


monthlyExpenses.textContent =
totalExpenses + " " + currentUser.wallet.currency;

monthlyIncome.textContent =
totalIncome + " " + currentUser.wallet.currency;

activeCards.textContent =
currentUser.wallet.cards.length;



// ---------------- TRANSFER ----------------

const quickTransfer = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transfer-section");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");

const transferForm = document.getElementById("transferForm");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCardSelect = document.getElementById("sourceCard");
const amountInput = document.getElementById("amount");



function addOpt(select,text,value){

    const option = document.createElement("option");

    option.text = text;
    option.value = value;

    select.add(option);
}



const users = getAllUsers();

beneficiarySelect.options.length = 0;
addOpt(beneficiarySelect,"Choisir un bénéficiaire","");

for(let i=0;i<users.length;i++){

    if(users[i].id != currentUser.id){

        addOpt(beneficiarySelect,users[i].name,users[i].id);

    }
}



sourceCardSelect.options.length = 0;
addOpt(sourceCardSelect,"Sélectionner une carte","");

for(let i=0;i<currentUser.wallet.cards.length;i++){

    const c = currentUser.wallet.cards[i];

    addOpt(sourceCardSelect,c.type+" - "+c.numcards,c.numcards);

}



quickTransfer.addEventListener("click",function(){

    transferSection.classList.remove("hidden");

});


closeTransferBtn.addEventListener("click",function(){

    transferSection.classList.add("hidden");

});


cancelTransferBtn.addEventListener("click",function(){

    transferSection.classList.add("hidden");

    transferForm.reset();

});



// ---------------- CALLBACKS ----------------


function checkAmount(amount,cb){

    if(amount <= 0){

        cb("Montant invalide");

        return;
    }

    cb(null,amount);
}



function checkSolde(sender,cardNum,amount,cb){

    if(!sender){

        cb("Utilisateur introuvable");

        return;
    }

    if(sender.wallet.balance < amount){

        cb("Solde wallet insuffisant");

        return;
    }

    let card = null;

    for(let i=0;i<sender.wallet.cards.length;i++){

        if(sender.wallet.cards[i].numcards == cardNum){

            card = sender.wallet.cards[i];
        }
    }

    if(!card){

        cb("Carte introuvable");

        return;
    }

    if(card.balance < amount){

        cb("Solde carte insuffisant");

        return;
    }

    cb(null,card);
}



function checkBeneficiary(beneficiaryId,cb){

    const beneficiary = findUserById(beneficiaryId);

    if(!beneficiary){

        cb("Bénéficiaire introuvable");

        return;
    }

    if(beneficiary.id == currentUser.id){

        cb("Impossible même utilisateur");

        return;
    }

    cb(null,beneficiary);
}



function createTransaction(amount,cb){

    const debitTx = {

        type:"debit",
        amount:amount

    };

    const creditTx = {

        type:"credit",
        amount:amount

    };

    cb(null,debitTx,creditTx);
}



function applyDebitCredit(sender,beneficiary,card,amount,debitTx,creditTx,cb){

    sender.wallet.balance =
    sender.wallet.balance - amount;

    card.balance =
    card.balance - amount;

    sender.wallet.transactions.push(debitTx);



    beneficiary.wallet.balance =
    beneficiary.wallet.balance + amount;

    if(beneficiary.wallet.cards.length > 0){

        beneficiary.wallet.cards[0].balance =
        beneficiary.wallet.cards[0].balance + amount;

    }

    beneficiary.wallet.transactions.push(creditTx);

    cb(null);
}



// ---------------- SUBMIT ----------------


transferForm.addEventListener("submit",function(e){

    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const beneficiaryId = beneficiarySelect.value;
    const cardNum = sourceCardSelect.value;

    const sender = findUserById(currentUser.id);



    checkAmount(amount,function(err,validAmount){

        if(err){ alert(err); return; }


        checkSolde(sender,cardNum,validAmount,function(err2,card){

            if(err2){ alert(err2); return; }


            checkBeneficiary(beneficiaryId,function(err3,beneficiary){

                if(err3){ alert(err3); return; }


                createTransaction(validAmount,function(err4,debitTx,creditTx){

                    if(err4){ alert(err4); return; }


                    applyDebitCredit(sender,beneficiary,card,validAmount,debitTx,creditTx,function(err5){

                        if(err5){ alert(err5); return; }


                        sessionStorage.setItem(
                            "currentUser",
                            JSON.stringify(sender)
                        );



                        availableBalance.textContent =
                        sender.wallet.balance + " " + sender.wallet.currency;



                        const exp = sender.wallet.transactions.filter(function(t){
                            return t.type === "debit";
                        });

                        const inc = sender.wallet.transactions.filter(function(t){
                            return t.type === "credit";
                        });



                        monthlyExpenses.textContent =
                        exp.reduce(function(s,t){
                            return s + t.amount;
                        },0) + " " + sender.wallet.currency;



                        monthlyIncome.textContent =
                        inc.reduce(function(s,t){
                            return s + t.amount;
                        },0) + " " + sender.wallet.currency;



                        transferForm.reset();
                        transferSection.classList.add("hidden");

                        alert("Transfert effectué");

                    });

                });

            });

        });

    });

});