/**
 * Curtain Price Calculator - MVP
 * Standalone calculator with demo data
 */

// ===== Demo Data =====
const DEMO_DATA = {
  mountTypes: [
    { id: 'standard', name: 'Standard Rod', priceModifier: 0 },
    { id: 'double', name: 'Double Rod', priceModifier: 35 },
    { id: 'ceiling', name: 'Ceiling Mount', priceModifier: 55 },
    { id: 'track', name: 'Track System', priceModifier: 45 },
    { id: 'tension', name: 'Tension Rod', priceModifier: 15 },
  ],
  headerTypes: [
    { id: 'grommet', name: 'Grommet', priceModifier: 25 },
    { id: 'tab', name: 'Tab Top', priceModifier: 20 },
    { id: 'pinch', name: 'Pinch Pleat', priceModifier: 45 },
    { id: 'rod', name: 'Rod Pocket', priceModifier: 15 },
    { id: 'ring', name: 'Ring Top', priceModifier: 35 },
    { id: 'wave', name: 'Wave Pleat', priceModifier: 55 },
  ],
  defaults: {
    fullnessFactor: 2,      // Curtains typically need 2x width for pleats
    installationFee: 85,
    hemmingFee: 45,
    currency: 'USD',
  },
};

// ===== DOM Elements =====
const elements = {
  width: document.getElementById('width'),
  height: document.getElementById('height'),
  mountType: document.getElementById('mountType'),
  headerType: document.getElementById('headerType'),
  fabricCost: document.getElementById('fabricCost'),
  installation: document.getElementById('installation'),
  hemming: document.getElementById('hemming'),
  totalPrice: document.getElementById('totalPrice'),
  breakdown: document.getElementById('breakdown'),
};

// ===== Initialize =====
function init() {
  populateSelects();
  attachListeners();
  calculate();
}

// ===== Populate Dropdowns =====
function populateSelects() {
  DEMO_DATA.mountTypes.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name}${item.priceModifier ? ` (+$${item.priceModifier})` : ''}`;
    elements.mountType.appendChild(option);
  });

  DEMO_DATA.headerTypes.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name}${item.priceModifier ? ` (+$${item.priceModifier})` : ''}`;
    elements.headerType.appendChild(option);
  });
}

// ===== Event Listeners =====
function attachListeners() {
  const inputs = [
    elements.width,
    elements.height,
    elements.mountType,
    elements.headerType,
    elements.fabricCost,
    elements.installation,
    elements.hemming,
  ];

  inputs.forEach((el) => {
    el.addEventListener('input', debounce(calculate, 150));
    el.addEventListener('change', calculate);
  });
}

function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), ms);
  };
}

// ===== Calculation Logic =====
function calculate() {
  const width = parseFloat(elements.width.value) || 0;
  const height = parseFloat(elements.height.value) || 0;
  const fabricCostPerSqm = parseFloat(elements.fabricCost.value) || 0;
  const mountId = elements.mountType.value;
  const headerId = elements.headerType.value;
  const includeInstallation = elements.installation.checked;
  const includeHemming = elements.hemming.checked;

  // Convert cm to m for fabric calculation
  const widthM = width / 100;
  const heightM = height / 100;

  // Fabric area: width × fullness × height (fullness for pleats)
  const fabricAreaSqm = widthM * DEMO_DATA.defaults.fullnessFactor * heightM;
  const fabricTotal = fabricAreaSqm * fabricCostPerSqm;

  const mount = DEMO_DATA.mountTypes.find((m) => m.id === mountId);
  const header = DEMO_DATA.headerTypes.find((h) => h.id === headerId);

  const mountFee = mount ? mount.priceModifier : 0;
  const headerFee = header ? header.priceModifier : 0;
  const installationFee = includeInstallation ? DEMO_DATA.defaults.installationFee : 0;
  const hemmingFee = includeHemming ? DEMO_DATA.defaults.hemmingFee : 0;

  const total =
    fabricTotal + mountFee + headerFee + installationFee + hemmingFee;

  updateDisplay(total, {
    fabric: fabricTotal,
    mount: mountFee,
    header: headerFee,
    installation: installationFee,
    hemming: hemmingFee,
  });
}

// ===== Update UI =====
function updateDisplay(total, breakdown) {
  // Animate price change
  elements.totalPrice.textContent = formatCurrency(total);
  elements.totalPrice.classList.add('updated');
  elements.totalPrice.addEventListener(
    'animationend',
    () => elements.totalPrice.classList.remove('updated'),
    { once: true }
  );

  // Build breakdown HTML
  const items = [
    { label: 'Fabric', value: breakdown.fabric },
    { label: 'Mount type', value: breakdown.mount },
    { label: 'Header type', value: breakdown.header },
    { label: 'Installation', value: breakdown.installation },
    { label: 'On-site hemming', value: breakdown.hemming },
  ];

  const listItems = items
    .filter((item) => item.value > 0)
    .map(
      (item) => `
      <div class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
        <span class="text-muted">${item.label}</span>
        <span class="fw-semibold">$${formatCurrency(item.value)}</span>
      </div>
    `
    )
    .join('');

  elements.breakdown.innerHTML = listItems
    ? `<div class="list-group list-group-flush">${listItems}</div>`
    : '';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

// ===== Run =====
init();
