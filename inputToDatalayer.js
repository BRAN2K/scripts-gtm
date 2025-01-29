(function testAllInputs() {
  var debounceTime = 1000;
  var inputSelector =
    "#id_email, #id_nome, #id_cpf, #id_telefone_celular, #id_cep, #id_endereco, #id_numero, #id_complemento, #id_referencia, #id_bairro, #id_cidade, #id_estado, #id_pais_id";

  // Função para escanear todos os inputs
  function scanAllInputs() {
    var allInputs = document.querySelectorAll(inputSelector);
    var currentState = {};

    allInputs.forEach(function (input) {
      var identifier =
        input.id ||
        input.name ||
        "input_" + Math.random().toString(36).substr(2, 5);
      currentState[identifier] = {
        value: input.value,
      };
    });

    return currentState;
  }

  // Função de tratamento de eventos
  function handleInputChange(event) {
    var input = event.target;
    clearTimeout(input.debounceTimer);

    input.debounceTimer = setTimeout(function () {
      var allInputsData = scanAllInputs();
      var changedInput = {
        id: input.id,
        name: input.name,
        newValue: input.value,
      };

      console.log(
        "%c[BRIN] Input[" +
          changedInput.name +
          '] alterado para: "' +
          changedInput.newValue +
          '"',
        "color: #2196F3;"
      );
      LIgtagDataLayer.push({
        event: "formInputCompleted",
        changedInput: changedInput,
        allInputs: allInputsData,
      });
    }, debounceTime);
  }

  // Inicialização com MutationObserver
  function init() {
    var observer = new MutationObserver(function () {
      document.querySelectorAll(inputSelector).forEach(function (input) {
        if (!input.dataset.observed) {
          input.addEventListener("input", handleInputChange);
          input.dataset.observed = "true";
        }
      });
      scanAllInputs();
    });

    observer.observe(document.body, { subtree: true, childList: true });

    // Monitorar eventos em inputs existentes
    document.querySelectorAll(inputSelector).forEach(function (input) {
      input.addEventListener("input", handleInputChange);
      input.dataset.observed = "true";
    });

    console.log("%c[BRIN] Monitoramento iniciado", "color: #2196F3;");
    LIgtagDataLayer.push({
      event: "formInputInitiated",
      allInputs: scanAllInputs(),
    });
  }

  init();
})();
