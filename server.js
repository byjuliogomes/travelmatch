const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");
const buttonPDF = document.getElementById("downloadBtn");
const buttonCopied = document.getElementById("copiedBtn");

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
});

const OPENAI_API_KEY = "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";

function SendQuestion() {
  var sQuestion = inputQuestion.value;

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Quero uma receita de ${sQuestion} (se possível, adicione algum leite vegetal A Tal da Castanha na receita)`,
      max_tokens: 3000, // tamanho da resposta
      temperature: 0.5, // criatividade na resposta
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (result.value) result.value += "\n";

      if (json.error?.message) {
        result.value += `Error: ${json.error.message}`;
      } else if (json.choices?.[0].text) {
        var text = json.choices[0].text || "Sem resposta";

        result.value += "Aqui está sua receita: " + text;
        buttonPDF.style.display = "block";
        copiedBtn.style.display = "block";
        whatsBtn.style.display = "block";
      }

      result.scrollTop = result.scrollHeight;
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      inputQuestion.value = "";
      inputQuestion.disabled = false;
      inputQuestion.focus();
    });

  if (result.value) result.value += "\n\n\n";

  result.value += `${sQuestion}`;
  inputQuestion.value = "Carregando...";
  inputQuestion.disabled = true;

  result.scrollTop = result.scrollHeight;
}

// Seleciona o elemento de textarea de resultados
var resultTextarea = document.querySelector("#result");

// Adiciona um evento de input ao textarea de entrada
document.querySelector("#inputQuestion").addEventListener("input", function () {
  // Obtém o valor do textarea de entrada
  var inputQuestionValue = this.value.trim();

  // Verifica se o valor não está vazio e mostra o textarea de resultados
  if (inputQuestionValue !== "") {
    resultTextarea.style.display = "block";
  } else {
    resultTextarea.style.display = "none";
  }
});

// Define o estilo CSS personalizado
const css = `
    * {
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.5;
    }
    h1, h2, h3, h4, h5, h6 {
        margin-top: 20px;
        margin-bottom: 10px;
    }
    p {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .recipe-img {
        max-width: 100%;
        height: auto;
        margin-top: 20px;
        margin-bottom: 20px;
    }
`;

// Define o conteúdo HTML a ser convertido em PDF
const content = document.getElementById("result").innerHTML;

function generatePDF() {
  // Obtém o conteúdo HTML da resposta
  const content = document.getElementById("result").value;
  console.log(content);

  // Define as opções de configuração do PDF
  const opt = {
    margin: 0.5,
    filename: "receita.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  // Cria o PDF com a biblioteca html2pdf.js
  html2pdf().set(opt).from(content).save();
}




const clipboardButton = document.querySelector('.clipboard-button');

clipboardButton.addEventListener('click', () => {
    const recipe = document.querySelector('#result').value;
    navigator.clipboard.writeText(recipe).then(() => {
        alert('Receita copiada para a área de transferência!');
    });
});


function shareOnWhatsApp() {
    const receita = document.getElementById('result').value;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(receita)}`;
    window.open(url, '_blank');
  }
  