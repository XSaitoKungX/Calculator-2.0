const BOARD_ID = "board";
const INPUTBOX_ID = "inputbox";
const CALC_DISPLAY_ID = "calc-display";
const CALCULATE_BUTTON_ID = "calculate-button";
const TASTE_CLASSES = "taste";
const ERROR_CLASSES = "error";

const SPACE_REQUIRED_REGEX = /(\d|\))\s*(\+|\-|\*|\/)\s*/g;
const VALID_INPUT_REGEX = /^[\d .,\(\)\+\-\*\/]*$/;

const board = document.getElementById(BOARD_ID);
const inputbox = document.getElementById(INPUTBOX_ID);
const calcDisplay = document.getElementById(CALC_DISPLAY_ID);
const calculateButton = document.getElementById(CALCULATE_BUTTON_ID);
const tasten = document.getElementsByClassName(TASTE_CLASSES);

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 15,
  useGrouping: false,
});

let currentinput = "";

// Die Liste der Tasten durchgehen
for (const taste of tasten) {
  // Jeder Taste sagen, was passieren soll, wenn man auf sie klickt
  taste.addEventListener("click", function (event) {
    // 1. Rechenweg-board leeren
    calcDisplay.textContent = "";

    // 2. Herausfinden, welches Zeichen auf der angeklickten Taste abgebildet ist
    const clickedChar = event.target.textContent;

    // Je nach angeklickter Taste unterschiedliche Dinge tun
    switch (clickedChar) {
      case "DEL":
        // Das letzte Zeichen aus dem inputbox entfernen
        inputbox.value = inputbox.value.trimEnd().slice(0, -1).trimEnd();

        // currentinput mit dem Inhalt des inputboxes synchronisieren
        currentinput = inputbox.value;
        break;

      case "AC":
        // Das gesamte inputbox leeren
        inputbox.value = "";
        currentinput = "";
        break;

      case "=":
        try {
          // Das result der eingegeben Rechnung ermitteln
          const result = new Function("return " + inputbox.value.replaceAll(",", "."))();

          // Das result formatieren und in das inputbox schreiben
          inputbox.value = formatter.format(result);

          // Die Rechnung, die zum result geführt hat, in das Rechenweg-Feld schreiben
          calcDisplay.textContent = currentinput;

          // currentinput mit dem Inhalt des inputboxes synchronisieren
          currentinput = inputbox.value;

          // Fehlerklasse von der Rechenweg-board nehmen
          calcDisplay.classList.remove(ERROR_CLASSES);
        } catch {
          // Fehlermeldung in die Rechenweg-board schreiben
          calcDisplay.textContent = "- ERROR -";
          calcDisplay.classList.add(ERROR_CLASSES);
        }

        break;

      default:
        // Das Zeichen der angeklickten Taste an die Eingabe anhängen
        inputbox.value += clickedChar;

        // Die Operatoren mit Leerzeichen umschließen
        inputbox.value = inputbox.value.replaceAll(SPACE_REQUIRED_REGEX, "$1 $2 ");

        // Wert der currentinput-Variablen aktualisieren
        currentinput = inputbox.value;
        break;
    }
  });
}

inputbox.addEventListener("input", function (event) {
  // 1. Prüfen, ob es sich um eine gültige Eingabe handelt
  if (VALID_INPUT_REGEX.test(inputbox.value)) {
    // Wert der currentinput-Variablen aktualisiern
    currentinput = inputbox.value;
  } else {
    // Ungültige Eingabe -> Eingabe ablehnen!
    inputbox.value = currentinput;
  }
});

inputbox.addEventListener("keydown", function (event) {
  // Wurde die Enter-Taste gedrückt?
  if (event.key === "Enter") {
    // Das tun, was auch beim Klick auf die = Taste geschieht
    calculateButton.click();
  }
});