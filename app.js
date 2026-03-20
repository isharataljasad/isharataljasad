const defaultData = {
  patientName: 'Case Zero',
  age: '37',
  sex: 'Female',
  focus: 'Anemia Biology',
  symptoms: 'Fatigue, exertional weakness, reduced exercise tolerance.',
  currentQuestion: 'Is the current biology ready for fair anemia reassessment, or are there active bottlenecks blocking a fair interpretation?',
  clinicianReview: 'Required',
  ferritin: '7',
  hemoglobin: '12.6',
  mchc: '31',
  rdw: '16.5',
  hba1c: '6.3',
  tsh: '4.04',
  crp: '',
  b12: '',
  folate: '',
  ironSat: '',
  notes: 'Current prototype for internal testing only.'
};

function loadData() {
  const saved = localStorage.getItem('anemiaBioOS');
  if (!saved) return { ...defaultData };
  try {
    return { ...defaultData, ...JSON.parse(saved) };
  } catch {
    return { ...defaultData };
  }
}

function saveData(data) {
  localStorage.setItem('anemiaBioOS', JSON.stringify(data));
}

function bindForm() {
  const form = document.querySelector('[data-form="case"]');
  if (!form) return;
  const data = loadData();
  Object.keys(data).forEach((key) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) field.value = data[key];
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const next = loadData();
    for (const [key, value] of formData.entries()) {
      next[key] = value.toString();
    }
    saveData(next);
    alert('Saved in your browser. Go next to Labs or Results.');
  });
}

function valueNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function computeModel(data) {
  const ferritin = valueNum(data.ferritin);
  const hemoglobin = valueNum(data.hemoglobin);
  const mchc = valueNum(data.mchc);
  const rdw = valueNum(data.rdw);
  const hba1c = valueNum(data.hba1c);
  const tsh = valueNum(data.tsh);
  const b12 = valueNum(data.b12);
  const folate = valueNum(data.folate);
  const ironSat = valueNum(data.ironSat);
  const crp = valueNum(data.crp);

  let completeness = 35;
  const missing = [];
  ['b12', 'folate', 'ironSat', 'crp'].forEach((key) => {
    if (!data[key]) missing.push(key);
  });
  completeness += (4 - missing.length) * 10;
  if (data.ferritin) completeness += 10;
  if (data.hemoglobin) completeness += 5;
  completeness = Math.min(100, completeness);

  let score = 100;
  const bottlenecks = [];

  if (ferritin !== null && ferritin < 15) {
    score -= 30;
    bottlenecks.push({ name: 'Iron depletion pattern', severity: 'High', why: 'Ferritin is very low and may block fair anemia reassessment.' });
  }
  if (ironSat !== null && ironSat < 20) {
    score -= 15;
    bottlenecks.push({ name: 'Iron transport limitation', severity: 'Medium', why: 'Iron saturation suggests poor available iron delivery.' });
  }
  if (rdw !== null && rdw > 14.5) {
    score -= 10;
    bottlenecks.push({ name: 'RBC variability signal', severity: 'Medium', why: 'High RDW suggests instability or mixed biology.' });
  }
  if (mchc !== null && mchc < 32) {
    score -= 10;
    bottlenecks.push({ name: 'Low cell hemoglobin concentration', severity: 'Medium', why: 'MCHC pattern may support iron-restricted biology.' });
  }
  if (hba1c !== null && hba1c >= 5.7) {
    score -= 10;
    bottlenecks.push({ name: 'Glycemic friction', severity: 'Medium', why: 'Higher HbA1c may reduce fair biological interpretation.' });
  }
  if (tsh !== null && tsh > 4) {
    score -= 10;
    bottlenecks.push({ name: 'Endocrine friction', severity: 'Medium', why: 'TSH may represent a confounding endocrine signal.' });
  }
  if (b12 === null) {
    score -= 7;
    bottlenecks.push({ name: 'Missing B12', severity: 'Data Gap', why: 'B12 is missing.' });
  }
  if (folate === null) {
    score -= 7;
    bottlenecks.push({ name: 'Missing folate', severity: 'Data Gap', why: 'Folate is missing.' });
  }
  if (ironSat === null) {
    score -= 7;
    bottlenecks.push({ name: 'Missing iron saturation', severity: 'Data Gap', why: 'Iron saturation is missing.' });
  }
  if (crp === null) {
    score -= 7;
    bottlenecks.push({ name: 'Missing CRP', severity: 'Data Gap', why: 'Inflammation signal is missing.' });
  }

  score = Math.max(0, Math.round(score));

  let state = 'Ready for reassessment';
  let stateClass = 'status-ok';
  let summary = 'The biology appears ready for fair anemia reassessment.';

  if (completeness < 70 || score < 50) {
    state = 'Not Ready';
    stateClass = 'status-danger';
    summary = 'Current biology is not ready for fair anemia reassessment. Correct bottlenecks and complete missing data first.';
  } else if (score < 75) {
    state = 'Conditionally Improving';
    stateClass = 'status-warn';
    summary = 'The case is improving but still has enough friction to limit a fair final judgment.';
  }

  if (hemoglobin !== null && hemoglobin < 10) {
    state = 'Red Flag Hold';
    stateClass = 'status-danger';
    summary = 'Low hemoglobin triggers a red-flag hold. Normal flow should stop for clinician review.';
    bottlenecks.unshift({ name: 'Low hemoglobin red flag', severity: 'Critical', why: 'Hemoglobin is below the prototype safety threshold.' });
  }

  return { completeness, score, state, stateClass, summary, bottlenecks };
}

function renderDashboard() {
  const host = document.querySelector('[data-dashboard]');
  if (!host) return;
  const data = loadData();
  const model = computeModel(data);
  host.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <h3>Case</h3>
        <p><strong>Patient:</strong> ${data.patientName}</p>
        <p><strong>Focus:</strong> ${data.focus}</p>
        <p><strong>Question:</strong> ${data.currentQuestion}</p>
      </div>
      <div class="card">
        <h3>Current State</h3>
        <p><span class="status ${model.stateClass}">${model.state}</span></p>
        <p>${model.summary}</p>
      </div>
      <div class="card">
        <h3>Readiness Score</h3>
        <div class="kpi">${model.score}/100</div>
        <p class="small">Prototype logic only.</p>
      </div>
      <div class="card">
        <h3>Data Completeness</h3>
        <div class="kpi">${model.completeness}%</div>
        <p class="small">Higher is better.</p>
      </div>
    </div>
  `;
}

function renderResults() {
  const host = document.querySelector('[data-results]');
  if (!host) return;
  const data = loadData();
  const model = computeModel(data);
  const rows = model.bottlenecks.map((b, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${b.name}</td>
      <td>${b.severity}</td>
      <td>${b.why}</td>
    </tr>
  `).join('');

  host.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <h3>Current State</h3>
        <p><span class="status ${model.stateClass}">${model.state}</span></p>
        <p>${model.summary}</p>
      </div>
      <div class="card">
        <h3>Decision</h3>
        <p><strong>Readiness Score:</strong> ${model.score}/100</p>
        <p><strong>Data Completeness:</strong> ${model.completeness}%</p>
        <p><strong>Clinician Review:</strong> ${data.clinicianReview}</p>
      </div>
    </div>
    <div class="card" style="margin-top:20px;">
      <h3>Top Bottlenecks</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Rank</th><th>Bottleneck</th><th>Severity</th><th>Why it matters</th></tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="4">No bottlenecks detected in the current prototype.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLabs() {
  const host = document.querySelector('[data-labs]');
  if (!host) return;
  const data = loadData();
  const labs = [
    ['Ferritin', data.ferritin, 'ng/mL'],
    ['Hemoglobin', data.hemoglobin, 'g/dL'],
    ['MCHC', data.mchc, 'g/dL'],
    ['RDW', data.rdw, '%'],
    ['HbA1c', data.hba1c, '%'],
    ['TSH', data.tsh, 'mIU/L'],
    ['CRP', data.crp || 'Missing', 'mg/L'],
    ['B12', data.b12 || 'Missing', 'pg/mL'],
    ['Folate', data.folate || 'Missing', 'ng/mL'],
    ['Iron Saturation', data.ironSat || 'Missing', '%']
  ];
  host.innerHTML = `
    <div class="card">
      <h3>Current Lab Set</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Test</th><th>Value</th><th>Unit</th></tr></thead>
          <tbody>
            ${labs.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function resetPrototype() {
  localStorage.removeItem('anemiaBioOS');
  alert('Prototype data reset. Refresh the page.');
}
