// STATE
let state = {
  accountType: null,
  level: null,
  exceptions: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
};

// ACCOUNT TYPE HANDLER
function handleAccountType(type) {
  state.accountType = type;
  const levelContainer = document.getElementById('level-container');
  const unsureMessage = document.getElementById('unsure-message');

  if (type === 'unsure') {
    levelContainer.style.display = 'none';
    unsureMessage.style.display = 'block';
    document.getElementById('result-card').style.display = 'none';
  } else {
    levelContainer.style.display = 'block';
    unsureMessage.style.display = 'none';
  }
}

// LEVEL HANDLER
function handleLevel(level) {
  state.level = level;
  const beginnerPath = document.getElementById('beginner-path');
  const experiencedPath = document.getElementById('experienced-path');

  if (level === 'beginner') {
    beginnerPath.style.display = 'block';
    experiencedPath.style.display = 'none';
  } else {
    beginnerPath.style.display = 'none';
    experiencedPath.style.display = 'block';
  }
}

// STOCK COUNT HANDLER (BEGINNER)
function handleStockCount() {
  const count = parseInt(document.getElementById('stock-count').value) || 0;
  const guidance = document.getElementById('stock-count-guidance');

  let message = '';
  if (count === 0) {
    message = 'You're starting from scratch—that's exciting. For this calculator, let's assume you're building your first position. You can always adjust the numbers once you own more stocks.';
  } else if (count === 1) {
    message = 'You're in the building phase. Adding 1–2 more quality ideas is smart. Avoid spreading yourself thin.';
  } else if (count === 2 || count === 3) {
    message = 'Good foundation. At this stage, depth of knowledge matters more than breadth. Make sure you truly understand each thesis.';
  } else if (count >= 5) {
    message = 'You're managing a diversified portfolio. Before adding more, consider: Can I track all of these equally well?';
  }

  guidance.innerHTML = `<p>${message}</p>`;
  updateBeginner();
}

// BEGINNER CALCULATION
function updateBeginner() {
  const stockName = document.getElementById('stock-name').value.toUpperCase() || 'Position';
  const availableMoney = parseFloat(document.getElementById('available-money').value) || 0;
  const dipPercent = parseFloat(document.getElementById('dip-percent-beginner').value) || 0;
  const maxPosition = parseFloat(document.getElementById('max-position-beginner').value) || 0;
  const positionType = document.querySelector('input[name="position-type"]:checked')?.value;

  if (availableMoney <= 0 || dipPercent <= 0 || maxPosition <= 0 || !positionType) {
    document.getElementById('result-card').style.display = 'none';
    return;
  }

  // FORMULA: Dip % × Available Money
  const rawTranche = (dipPercent / 100) * availableMoney;
  const maxTrancheCap = 0.20 * maxPosition; // 20% of max position
  const finalTranche = Math.min(rawTranche, maxTrancheCap);

  // Show result
  document.getElementById('result-card').style.display = 'block';

  let verdict = '';
  let detail = '';
  let className = 'success';

  if (finalTranche > maxPosition) {
    // Would exceed max
    verdict = `Skip this dip`;
    detail = `Adding $${Math.round(finalTranche)} would exceed your $${Math.round(maxPosition)} max position. Stay disciplined.`;
    className = 'danger';
  } else {
    // Green light
    if (state.accountType === 'practice') {
      verdict = `In this scenario, add $${Math.round(finalTranche)}`;
      detail = `${dipPercent}% dip × $${Math.round(availableMoney)} available = $${Math.round(finalTranche)}. This is how you'd size it with real money.`;
    } else {
      verdict = `Add $${Math.round(finalTranche)}`;
      detail = `${dipPercent}% dip × $${Math.round(availableMoney)} available = $${Math.round(finalTranche)}. Thesis intact, dip confirmed macro-only, ready to execute.`;
    }
    className = 'success';
  }

  const resultText = document.getElementById('result-text');
  resultText.textContent = verdict;
  resultText.className = `result-verdict ${className}`;
  document.getElementById('result-detail').textContent = detail;
}

// EXPERIENCED CALCULATION
function updateExperienced() {
  const stockName = document.getElementById('stock-name-exp').value.toUpperCase() || 'Position';
  const costBasis = parseFloat(document.getElementById('cost-basis-exp').value) || 0;
  const dipPercent = parseFloat(document.getElementById('dip-percent-exp').value) || 0;
  const dryPowder = parseFloat(document.getElementById('dry-powder-exp').value) || 0;
  const maxPosition = parseFloat(document.getElementById('max-position-exp').value) || 0;

  if (costBasis <= 0 || dipPercent <= 0 || dryPowder <= 0 || maxPosition <= 0) {
    document.getElementById('result-card').style.display = 'none';
    return;
  }

  // FORMULA: Dip % × Cost Basis
  const rawTranche = (dipPercent / 100) * costBasis;
  const maxTrancheCap = 0.20 * costBasis; // 20% of cost basis
  const finalTranche = Math.min(rawTranche, maxTrancheCap);
  const postExecutionCost = costBasis + finalTranche;
  const dryPowderAfter = dryPowder - finalTranche;
  const dryPowderPercent = (dryPowderAfter / (dryPowder + costBasis + finalTranche)) * 100;

  // Show result
  document.getElementById('result-card').style.display = 'block';

  let verdict = '';
  let detail = '';
  let className = 'success';

  const anyException = Object.values(state.exceptions).some(v => v);

  if (postExecutionCost > maxPosition) {
    // Tier ceiling exceeded
    verdict = `Skip this dip`;
    detail = `Position would hit $${Math.round(postExecutionCost)} (above $${Math.round(maxPosition)} max). Tier ceiling exceeded.`;
    className = 'danger';
  } else if (dryPowderAfter < dryPowder * 0.10) {
    // Would drop below 10% dry powder
    verdict = `Skip this dip`;
    detail = `Dry powder would drop to $${Math.round(dryPowderAfter)} (${Math.round(dryPowderPercent)}%). Stay above 10% minimum.`;
    className = 'danger';
  } else if (anyException) {
    // Exceptions triggered
    verdict = `Add $${Math.round(finalTranche)} (review exceptions)`;
    detail = `One or more exceptions triggered. Review them before executing. Thesis, valuation, and conviction intact but conditions warrant review.`;
    className = 'warning';
  } else {
    // Green light
    if (state.accountType === 'practice') {
      verdict = `In this scenario, add $${Math.round(finalTranche)}`;
      detail = `${dipPercent}% dip × $${Math.round(costBasis)} cost basis = $${Math.round(finalTranche)}. Execution-ready framework. (Dry powder after: $${Math.round(dryPowderAfter)})`;
    } else {
      verdict = `Add $${Math.round(finalTranche)}`;
      detail = `Thesis intact, dip confirmed macro-only, headroom available. ${dipPercent}% dip × $${Math.round(costBasis)} = execution-ready. (Dry powder after: $${Math.round(dryPowderAfter)})`;
    }
    className = 'success';
  }

  const resultText = document.getElementById('result-text');
  resultText.textContent = verdict;
  resultText.className = `result-verdict ${className}`;
  document.getElementById('result-detail').textContent = detail;
}

// EXCEPTION TOGGLE
function toggleException(num) {
  state.exceptions[num] = !state.exceptions[num];
  const btn = document.querySelector(`button[onclick="toggleException(${num})"]`);
  
  if (state.exceptions[num]) {
    btn.textContent = 'Yes';
    btn.classList.add('yes');
  } else {
    btn.textContent = 'No';
    btn.classList.remove('yes');
  }

  updateExperienced();
}

// SCROLL TO CALCULATOR SMOOTH
document.addEventListener('DOMContentLoaded', () => {
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      const calculator = document.getElementById('calculator');
      calculator.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
