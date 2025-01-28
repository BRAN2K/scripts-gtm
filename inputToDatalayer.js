// Versão para teste no console com monitoramento completo
(function testAllInputs() {
  const debounceTime = 1000;
  const inputSelector =
    'input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea';
  let inputsCache = new Map();

  // Função para escanear todos os inputs
  function scanAllInputs() {
    const allInputs = document.querySelectorAll(inputSelector);
    const currentState = {};

    allInputs.forEach((input) => {
      const identifier =
        input.id ||
        input.name ||
        `input_${Math.random().toString(36).substr(2, 5)}`;
      currentState[identifier] = {
        value: input.value,
        type: input.type,
        changed: inputsCache.has(identifier)
          ? input.value !== inputsCache.get(identifier).value
          : false,
      };
    });

    inputsCache = new Map(Object.entries(currentState));
    return currentState;
  }

  // Função de tratamento de eventos
  function handleInputChange(event) {
    const input = event.target;
    clearTimeout(input.debounceTimer);

    input.debounceTimer = setTimeout(() => {
      const allInputsData = scanAllInputs();
      const changedInput = {
        id: input.id,
        name: input.name,
        type: input.type,
        newValue: input.value,
      };

      console.log(
        "%c=== ATUALIZAÇÃO DE INPUTS ===",
        "color: #4CAF50; font-weight: bold;"
      );
      console.log("Input alterado:", changedInput);
      console.log("Estado atual de todos os inputs:", allInputsData);
      console.log("Simulação dataLayer:", {
        event: "formInputCompleted",
        changedInput: changedInput,
        allInputs: allInputsData,
      });
    }, debounceTime);
  }

  // Inicialização com MutationObserver
  function init() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll(inputSelector).forEach((input) => {
        if (!input.dataset.observed) {
          input.addEventListener("input", handleInputChange);
          input.dataset.observed = "true";
        }
      });
      scanAllInputs();
    });

    observer.observe(document.body, { subtree: true, childList: true });

    // Monitorar eventos em inputs existentes
    document.querySelectorAll(inputSelector).forEach((input) => {
      input.addEventListener("input", handleInputChange);
      input.dataset.observed = "true";
    });

    console.log("%c[TESTE] Monitoramento iniciado", "color: #2196F3;");
    console.log("Inputs iniciais:", scanAllInputs());
  }

  // Iniciar quando o documento estiver pronto
  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
