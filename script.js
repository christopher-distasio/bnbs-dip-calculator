// STATE
let state = {
  accountType: null,
  level: null,
  exceptions: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
};

// MODAL FUNCTIONS
function openExceptions() {
  document.getElementById('exceptions-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeExceptions() {
  document.getElementById('exceptions-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openHowItWorks() {
  document.getElementById('how-it-works-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeHowItWorks() {
  document.getElementById('how-it-works-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openDryPowderInfo(event) {
  event.preventDefault();
  document.getElementById('dry-powder-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDryPowderInfo() {
  document.getElementById('dry-powder-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openConfidenceCheck(event) {
  event.preventDefault();
  document.getElementById('confidence-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const modal = document.getElementById('confidence-modal');
    modal.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
}

function closeConfidenceCheck() {
  document.getElementById('confidence-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openDeworsificationInfo(event) {
  event.preventDefault();
  document.getElementById('deworsification-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDeworsificationInfo() {
  document.getElementById('deworsification-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openConfidenceTemplate(event) {
  event.preventDefault();
  document.getElementById('confidence-template-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeConfidenceTemplate() {
  document.getElementById('confidence-template-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function startTemplate() {
  const ticker = document.getElementById('template-ticker').value.toUpperCase();
  if (!ticker) {
    alert('Enter a company name or ticker');
    return;
  }
  document.getElementById('template-prompt').style.display = 'none';
  document.getElementById('template-questions').style.display = 'block';
  document.getElementById('template-company-name').textContent = `Analysis: ${ticker}`;
}

function generateTemplate() {
  const ticker = document.getElementById('template-ticker').value.trim().toUpperCase();
  if (!ticker) {
    alert('Please enter a company name or ticker');
    return;
  }

  const prompt = `Analyze ${ticker} using this 12-step framework:

1. Business description: Can you explain what the company does in 1–2 sentences?
2. Tier classification: Is this Core, Satellite, or Speculative for you?
3. Fundamentals (Gate 1): Revenue growing? Margins stable or expanding? Profitability sustainable?
4. Moat: Does this company have a competitive advantage competitors can't easily copy?
5. Failure modes: What could go wrong? Regulatory risk? Competitive pressure? Loss of key customers?
6. Competitive positioning: How does it stack up against rivals? Market leader or also-ran?
7. Management quality: Do the leaders have a track record of good decisions? Do they own significant stock?
8. Valuation (Gate 2): Is the current price reasonable relative to earnings, growth, and risk?
9. Thesis invalidation triggers: What specific changes would make you sell? (Not price—business changes.)
10. Mental overhead: Can you track this position without constant monitoring?
11. Scuttlebutt: What are customers, suppliers, and competitors saying about this company?
12. Final verdict: Do you have strong conviction? Or doubts that a dip can't resolve?

Please answer each question thoroughly so I can validate my conviction before buying.`;

  document.getElementById('template-prompt-text').value = prompt;
  document.getElementById('template-output').style.display = 'block';
}

function copyTemplateToClipboard() {
  const textarea = document.getElementById('template-prompt-text');
  textarea.select();
  document.execCommand('copy');
  alert('✓ Copied to clipboard!');
}

function openInClaude() {
  const prompt = document.getElementById('template-prompt-text').value;
  const encoded = encodeURIComponent(prompt);
  window.open('https://claude.ai', '_blank');
}

function openInChatGPT() {
  const prompt = document.getElementById('template-prompt-text').value;
  const encoded = encodeURIComponent(prompt);
  window.open('https://chatgpt.com', '_blank');
}

function openInGemini() {
  const prompt = document.getElementById('template-prompt-text').value;
  const encoded = encodeURIComponent(prompt);
  window.open('https://gemini.google.com', '_blank');
}

function openInGrok() {
  window.open('https://x.com/grok', '_blank');
}

function scrollToHowItWorks(event) {
  event.preventDefault();
  closeConfidenceCheck();
  openHowItWorks();
  setTimeout(() => {
    const step1 = document.querySelector('.how-it-works-list');
    if (step1) {
      step1.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
}

// Close modals on outside click
window.onclick = function(event) {
  const exceptionsModal = document.getElementById('exceptions-modal');
  const howItWorksModal = document.getElementById('how-it-works-modal');
  
  if (event.target == exceptionsModal) {
    closeExceptions();
  }
  if (event.target == howItWorksModal) {
    closeHowItWorks();
  }
}

// Close modals on outside click
window.onclick = function(event) {
  const exceptionsModal = document.getElementById('exceptions-modal');
  const howItWorksModal = document.getElementById('how-it-works-modal');
  
  if (event.target == exceptionsModal) {
    closeExceptions();
  }
  if (event.target == howItWorksModal) {
    closeHowItWorks();
  }
}

// EXCEPTION CHECKER
function answerException(num, isYes) {
  const item = document.querySelector(`[data-exception="${num}"]`) || 
               Array.from(document.querySelectorAll('.exception-item')).find((el, idx) => idx === num - 1);
  
  if (!item) return;
  
  const yesBtn = item.querySelector('.btn-yes');
  const noBtn = item.querySelector('.btn-no');
  const explanation = item.querySelector('.exception-explanation');
  
  // Update state
  state.exceptions[num] = !isYes;
  
  // Update button states - KEEP ACTIVE CLASS PERSISTENT
  yesBtn.classList.toggle('active', isYes);
  noBtn.classList.toggle('active', !isYes);
  
  // Show/hide explanation based on NO answer
  if (isYes) {
    if (explanation) explanation.style.display = 'none';
    item.classList.remove('checked-unfavorable');
    item.classList.add('checked-favorable');
  } else {
    if (explanation) explanation.style.display = 'block';
    item.classList.remove('checked-favorable');
    item.classList.add('checked-unfavorable');
  }
  
  updateExceptionsVerdict();
}

function updateExceptionsVerdict() {
  const anyUnfavorable = Object.values(state.exceptions).some(v => v);
  const verdictDiv = document.getElementById('verdict');
  
  if (anyUnfavorable) {
    verdictDiv.textContent = "⚠ One or more concerns apply. Review each before buying the dip.";
    verdictDiv.style.color = '#E24B4A';
  } else {
    const allAnswered = Object.keys(state.exceptions).length > 0 && 
                        Object.values(state.exceptions).every(v => v === true || v === false);
    
    if (allAnswered && !anyUnfavorable) {
      verdictDiv.textContent = "✓ You've cleared all concerns. You're ready to buy the dip.";
      verdictDiv.style.color = '#1D9E75';
    } else {
      verdictDiv.textContent = "Go through each item above.";
      verdictDiv.style.color = '#2A2A2A';
    }
  }
}

// ACCOUNT TYPE & LEVEL
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

// START CALCULATOR
function startCalculator() {
  const calcSection = document.getElementById('calculator');
  const calcContent = document.getElementById('calculator-content');
  if (calcSection) {
    calcSection.classList.add('active');
  }
  if (calcContent) {
    calcContent.style.display = 'block';
  }
  if (calcSection) {
    setTimeout(() => calcSection.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

// STOCK COUNT HANDLER
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

// RESET FUNCTIONS
function resetBeginner() {
  document.getElementById('stock-name').value = '';
  document.getElementById('stock-count').value = '';
  document.getElementById('available-money').value = '';
  document.getElementById('dip-percent-beginner').value = '';
  document.getElementById('max-position-beginner').value = '';
  document.querySelector('input[name="position-type"]').checked = false;
  document.getElementById('stock-count-guidance').innerHTML = '';
  document.getElementById('result-card').style.display = 'none';
  updateCalc();
}

function resetExperienced() {
  document.getElementById('stock-name-exp').value = '';
  document.getElementById('cost-basis-exp').value = '';
  document.getElementById('dip-percent-exp').value = '';
  document.getElementById('dry-powder-exp').value = '';
  document.getElementById('max-position-exp').value = '';
  
  for (let i = 1; i <= 6; i++) {
    state.exceptions[i] = false;
  }
  
  document.getElementById('result-card').style.display = 'none';
  updateCalc();
}

// MAIN CALCULATOR TRIGGER
function updateCalc() {
  const checkResultsSection = document.getElementById('check-results-section');
  const resultCard = document.getElementById('result-card');
  let allFilled = false;
  
  if (state.level === 'beginner') {
    const available = parseFloat(document.getElementById('available-money').value) || 0;
    const dip = parseFloat(document.getElementById('dip-percent-beginner').value) || 0;
    const max = parseFloat(document.getElementById('max-position-beginner').value) || 0;
    const posType = document.querySelector('input[name="position-type"]:checked')?.value;
    
    allFilled = available > 0 && dip > 0 && max > 0 && posType;
  } else if (state.level === 'experienced') {
    const cost = parseFloat(document.getElementById('cost-basis-exp').value) || 0;
    const dip = parseFloat(document.getElementById('dip-percent-exp').value) || 0;
    const dry = parseFloat(document.getElementById('dry-powder-exp').value) || 0;
    const max = parseFloat(document.getElementById('max-position-exp').value) || 0;
    
    allFilled = cost > 0 && dip > 0 && dry > 0 && max > 0;
  }
  
  // Show button only if all fields are filled
  if (allFilled) {
    checkResultsSection.style.display = 'flex';
    resultCard.style.display = 'none';
  } else {
    checkResultsSection.style.display = 'none';
    resultCard.style.display = 'none';
  }
}

function showResults() {
  if (state.level === 'beginner') {
    calcBeginner();
  } else if (state.level === 'experienced') {
    calcExperienced();
  }
}

// BEGINNER CALCULATION
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

// EXPERIENCED CALCULATION
function calcExperienced() {
  const cost = parseFloat(document.getElementById('cost-basis-exp').value) || 0;
  const dip = parseFloat(document.getElementById('dip-percent-exp').value) || 0;
  const dry = parseFloat(document.getElementById('dry-powder-exp').value) || 0;
  const max = parseFloat(document.getElementById('max-position-exp').value) || 0;
  
  if (cost <= 0 || dip <= 0 || dry <= 0 || max <= 0) return;
  
  const tranche = Math.min((dip / 100) * cost, 0.20 * cost);
  const afterCost = cost + tranche;
  const dryPowderAfter = dry - tranche;
  const resultCard = document.getElementById('result-card');
  const resultText = document.getElementById('result-text');
  const resultDetail = document.getElementById('result-detail');
  
  resultCard.style.display = 'block';
  
  // Check for exceptions
  const anyException = Object.values(state.exceptions).some(v => v);
  
  if (afterCost > max) {
    resultText.textContent = 'Skip this dip';
    resultText.className = 'result-verdict danger';
    resultDetail.textContent = `Position would hit $${Math.round(afterCost)} (above $${Math.round(max)} max)`;
  } else if (dryPowderAfter < dry * 0.05) {
    resultText.textContent = 'Skip this dip';
    resultText.className = 'result-verdict danger';
    resultDetail.textContent = `Dry powder would drop to $${Math.round(dryPowderAfter)} (below 5% minimum).`;
  } else if (anyException) {
    resultText.textContent = `Add $${Math.round(tranche)} (review exceptions first)`;
    resultText.className = 'result-verdict warning';
    resultDetail.textContent = `One or more exceptions triggered. Use the "Check this first" section before buying.`;
  } else {
    if (state.accountType === 'practice') {
      resultText.textContent = `In this scenario, add $${Math.round(tranche)}`;
      resultDetail.textContent = `${dip}% dip × $${Math.round(cost)} = $${Math.round(tranche)}. (Dry powder after: $${Math.round(dryPowderAfter)})`;
    } else {
      resultText.textContent = `Add $${Math.round(tranche)}`;
      resultDetail.textContent = `${dip}% dip × $${Math.round(cost)} = $${Math.round(tranche)}. (Dry powder after: $${Math.round(dryPowderAfter)})`;
    }
    resultText.className = 'result-verdict success';
  }
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Any initialization if needed
});
