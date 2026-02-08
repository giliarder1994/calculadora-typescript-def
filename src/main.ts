import "./style.css";

type Operator = "+" | "-" | "*" | "/";

class Calculator {
  private currentInput:string = "";
  private previousInput:string = "";
  private operator: Operator | null = null;
  private readonly MAX_DIGITS = 11;
  public appendNumber(value:string):void {
    const digitsCount = this.currentInput.replace(",", "").length;

    // Bloqueia se atingir o limite
    if (digitsCount >= this.MAX_DIGITS && value !== ",") return;
    
    // Se clicar na vírgula
    if(value === ",") {
      if (this.currentInput.includes(",")) return;
      if (this.currentInput === ""){
        this.currentInput = "0,";
      } else {
        this.currentInput += ",";
      }
    } else {
      if(this.currentInput === "0") {
        this.currentInput = value;
      }else {
        this.currentInput += value;
      }
    }
    this.updateDisplay();
  }

  public chooseOperator(operator: Operator): void {
    if (this.currentInput === "") return;

    if (this.previousInput !== "") {
      this.compute();
    }

    this.operator = operator;
    this.previousInput = this.currentInput;
    this.currentInput = "";

    this.updateOperatorDisplay();
  }
  
  public compute():void {
    let computation:number;
    const prev = parseFloat(this.previousInput.replace(",", "."));
    const current = parseFloat(this.currentInput.replace(",", "."));
    if (isNaN(prev) || isNaN(current)) return;
    switch(this.operator){
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentInput = this.formatResult(computation);
    this.operator = null;
    this.updateOperatorDisplay();
    this.previousInput = "";
    this.updateDisplay();
  }

  public updateDisplay():void {
    const display = document.getElementById('display') as HTMLInputElement;
    display.value = this.currentInput;
  }

  private updateOperatorDisplay(): void {
    const operatorDisplay = document.getElementById("operator-display")!;
    operatorDisplay.innerText = this.operator ?? "";
  }

  public clear():void {
    this.currentInput = "";
    this.previousInput = "";
    this.operator = null;
    this.updateDisplay();
    this.updateOperatorDisplay();
  } 

  private formatResult(value: number): string {
    let text = value.toString().replace(".", ",");

    // Remove vírgula para contar apenas dígitos
    const digitsOnly = text.replace(",", "");

    if (digitsOnly.length <= this.MAX_DIGITS) {
      return text;
    }

    // Se estourar, usa notação científica
    return value.toExponential(4).replace(".", ",");
  }
}

const calculator = new Calculator();
document.getElementById('buttons')!.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if(target.classList.contains('number')) {
    calculator.appendNumber(target.innerText);
  }else if(target.classList.contains('operator')) {
    calculator.chooseOperator(target.innerText as Operator);
  }else if(target.classList.contains('equals')) {
    calculator.compute();
  }else if (target.classList.contains('clear')) {
    calculator.clear();
  }
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if(!isNaN(Number(event.key))) {
    calculator.appendNumber(event.key);
  }

  if(["+", "-", "*", "/"].includes(event.key)){
    calculator.chooseOperator(event.key as Operator);
  }

  if(event.key === "Enter") {
    calculator.compute();
  }

  if(event.key === "Escape"){
    calculator.clear();
  }

  if(event.key === "," || event.key === ".") {
    calculator.appendNumber(",");
  }
})