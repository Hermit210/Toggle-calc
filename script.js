function append(value) {
  const display = document.getElementById("expression");
  if (value === 'π') {
    display.value += Math.PI.toFixed(8);
  } else if (value === 'e') {
    display.value += Math.E.toFixed(8);
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  document.getElementById("expression").value = '';
  document.getElementById("result").textContent = '= 0';
}

function calculate() {
  let expression = document.getElementById("expression").value;
  try {
    expression = expression
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/π/g, Math.PI)
      .replace(/e/g, Math.E)
      .replace(/log\(/g, 'Math.log10(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/\^/g, '**');

    const result = eval(expression);
    document.getElementById("result").textContent = "= " + result;
  } catch (err) {
    document.getElementById("result").textContent = "= Error";
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const currentBg = root.style.getPropertyValue('--bg-color');
  if (currentBg === '#9256a0' || currentBg === '') {
    root.style.setProperty('--bg-color', '#f0f0f0');
    root.style.setProperty('--calc-bg', '#fff');
    root.style.setProperty('--btn-color', '#e0e0e0');
    root.style.setProperty('--accent', '#badaf7');
    root.style.setProperty('--text-color', '#000');
    root.style.setProperty('--equal-color', '#0077ff');
    root.style.setProperty('--clear-color', '#e74c3c');
    root.style.setProperty('--operator-color', '#333');
  } else {
    root.style.setProperty('--bg-color', '#9256a0');
    root.style.setProperty('--calc-bg', '#000');
    root.style.setProperty('--btn-color', '#d5f3f3');
    root.style.setProperty('--accent', '#d7a8f0');
    root.style.setProperty('--text-color', '#333');
    root.style.setProperty('--equal-color', '#f06ca0');
    root.style.setProperty('--clear-color', '#e74c3c');
    root.style.setProperty('--operator-color', '#4b4e6d');
  }
}
