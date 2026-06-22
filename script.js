let state = { accountType: null, level: null };

function setAccountType(type) {
  state.accountType = type;
  const levelSection = document.getElementById('level-section');
  const unsureMsg = document.getElementById('unsure-message');
  
  if (type === 'unsure') {
    levelSection.style.display = 'none';
    unsureMsg.style.display = 'block';
  } else {
    levelSection.style.display = 'block';
    unsureMsg.style.display = 'none';
  }
}

function setLevel(level) {
  state.level = level;
  const beginnerQ = document.getElementById('beginner-questions');
  const experiencedQ = document.getElementById('experienced-questions');
  
  if (level === 'beginner') {
    beginnerQ.style.display = 'block';
    experiencedQ.style.display = 'none';
  } else {
    beginnerQ.style.display = 'none';
    experiencedQ.style.display = 'block';
  }
}

function updateStockCount() {
  const count = parseInt(document.getElementById('stock-count').value) || 0;
  const guidance = document.getElementById('stock-count-guidance');
  let message = '';
  
  if (count === 0) {
    message = 'You\'re starting from scratch. For this calculator, assume you\'re building your first position.';
  } else if (count === 1) {
    message = 'You\'re in the building phase. Adding 1–2 more quality ideas is smart.';
  } else if (count === 2 || count === 3) {
    message = 'Good foundation. Make sure you understand each thesis deeply.';
  } else if (count >= 5) {
    message = 'You\'re managing a diversified portfolio. Before adding more, can you track all of these equally well?';
  }
  
  guidance.innerHTML = `<p>${message}</p>`;
  updateCalc();
}

function updateCalc() {
  if (state.level === 'beginner') {
    calcBeginner();
  } else if (state.level === 'experienced') {
    calcExperienced();
  }
}

function calcBeginner() {
  const available = parseFloat(document.getElementById('available-money').value) || 0;
  const dip = parseFloat(document.getElementById('dip-percent-beginner').value) || 0;
  const max = parseFloat(document.getElementById('max-position-beginner').value) || 0;
  const posType = document.querySelector('input[name="position-type"]:checked')?.value;
  
  if (available <= 0 || dip <= 0 || max <= 0 || !posType) return;
  
  const tranche = Math.min((dip / 100) * available, 0.20 * max);
  const resultCard = document.getElementById('result-card');
  const resultText = document.getElementById('result-text');
  const resultDetail = document.getElementById('result-detail');
  
  resultCard.style.display = 'block';
  resultText.textContent = `Add $${Math.round(tranche)}`;
  resultText.className = 'result-verdict success';
  resultDetail.textContent = `${dip}% dip × $${Math.round(available)} available = $${Math.round(tranche)}`;
}

function calcExperienced() {
  const cost = parseFloat(document.getElementById('cost-basis-exp').value) || 0;
  const dip = parseFloat(document.getElementById('dip-percent-exp').value) || 0;
  const dry = parseFloat(document.getElementById('dry-powder-exp').value) || 0;
  const max = parseFloat(document.getElementById('max-position-exp').value) || 0;
  
  if (cost <= 0 || dip <= 0 || dry <= 0 || max <= 0) return;
  
  const tranche = Math.min((dip / 100) * cost, 0.20 * cost);
  const afterCost = cost + tranche;
  const resultCard = document.getElementById('result-card');
  const resultText = document.getElementById('result-text');
  const resultDetail = document.getElementById('result-detail');
  
  resultCard.style.display = 'block';
  
  if (afterCost > max) {
    resultText.textContent = 'Skip this dip';
    resultText.className = 'result-verdict danger';
    resultDetail.textContent = `Position would hit $${Math.round(afterCost)} (above $${Math.round(max)} max)`;
  } else {
    resultText.textContent = `Add $${Math.round(tranche)}`;
    resultText.className = 'result-verdict success';
    resultDetail.textContent = `${dip}% dip × $${Math.round(cost)} = $${Math.round(tranche)}`;
  }
}

// START CALCULATOR BUTTON
function startCalculator() {
  const calcSection = document.getElementById('calculator');
  const calcContent = document.getElementById('calculator-content');
  if (calcContent) {
    calcContent.style.display = 'block';
  }
  if (calcSection) {
    setTimeout(() => calcSection.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

// SCROLL TO CALCULATOR SMOOTH
document.addEventListener('DOMContentLoaded', () => {
  // Any other initialization if needed
});
