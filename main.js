let balance = 0;
const transactions = [];

// Elementos do DOM
const balanceAmount = document.getElementById("balanceAmount");
const transactionList = document.getElementById("transactionList");
const transactionForm = document.getElementById("transactionForm");
const transactionType = document.getElementById("transactionType");
const transactionAmount = document.getElementById("transactionAmount");

// Função para atualizar o saldo na tela
function updateBalance() {
  balanceAmount.textContent = `$${balance.toFixed(2)}`;
}

// Função para exibir as transações na tela
function updateTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const sign = transaction.type === "income" ? "+" : "-";
    const listItem = document.createElement("li");
    listItem.innerHTML = `
              <span>${
                transaction.type === "income" ? "Entrada" : "Saída"
              }: $${transaction.amount.toFixed(2)}</span>
              <br>
              <span>Descrição: ${transaction.description}</span>
              <div>
                  <button onclick="editTransaction(${index})">Editar</button>
                  <button onclick="deleteTransaction(${index})">Apagar</button>
              </div>
          `;
    transactionList.appendChild(listItem);
  });
}

// Função para adicionar uma transação
function addTransaction(type, amount, description) {
  const transaction = {
    type: type,
    amount: amount,
    description: description,
  };
  transactions.push(transaction);
  if (type === "income") {
    balance += amount;
  } else {
    balance -= amount;
  }
  updateBalance();
  updateTransactions();
}

// Função para deletar uma transação
function deleteTransaction(index) {
  const deletedTransaction = transactions.splice(index, 1)[0];
  if (deletedTransaction.type === "income") {
    balance -= deletedTransaction.amount;
  } else {
    balance += deletedTransaction.amount;
  }
  updateBalance();
  updateTransactions();
}

// Função para editar uma transação
function editTransaction(index) {
  const transactionToEdit = transactions[index];
  transactionType.value = transactionToEdit.type;
  transactionAmount.value = transactionToEdit.amount.toFixed(2);

  // Armazenar o índice da transação sendo editada em um atributo data no formulário
  transactionForm.setAttribute("data-index", index);
}

// Evento para adicionar transação ao formulário
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const type = transactionType.value;
  const amount = parseFloat(transactionAmount.value);
  const description = transactionDescription.value; // Captura a descrição

  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, insira um valor válido.");
    return;
  }

  const dataIndex = transactionForm.getAttribute("data-index");

  if (dataIndex !== null) {
    // Edição de transação existente
    const index = parseInt(dataIndex);
    const oldTransaction = transactions[index];

    // Atualizar a transação existente
    if (oldTransaction.type === "income") {
      balance -= oldTransaction.amount;
    } else {
      balance += oldTransaction.amount;
    }

    if (type === "income") {
      balance += amount;
    } else {
      balance -= amount;
    }

    oldTransaction.type = type;
    oldTransaction.amount = amount;
    oldTransaction.description = description; // Atualiza a descrição
  } else {
    // Adição de nova transação
    addTransaction(type, amount, description);
  }

  updateBalance();
  updateTransactions();
  transactionForm.removeAttribute("data-index");
  transactionForm.reset();
});
