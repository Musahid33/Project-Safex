/**
 * 🏭 Safex Core Application Logic
 *
 * Tata Steel Safety Profile Search Engine & Reporting System.
 * This module runs in the browser and provides:
 *  - Employee profile search with cross-plant access control
 *  - Live name lookup for auto-filling forms
 *  - Dynamic smart form show/hide logic
 *  - Universal form submission with Supabase insert
 *
 * @module app
 */

// Import the database connection from db.js (Node.js context)
// In browser context, _supabase is available globally from the HTML script tag.
const supabase = (typeof require !== 'undefined') ? require('./db') : null;

// ═════════════════════════════════════════════════════════════════════════════
// 🏭 EMPLOYEE PROFILE SEARCH (Node.js / CLI context)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Search employee profile with cross-plant access control.
 * @param {string} officerPlantId - The plant ID where the safety officer is stationed.
 * @param {string} searchEmployeeId - The Employee ID being searched.
 */
async function searchEmployeeProfile(officerPlantId, searchEmployeeId) {
  try {
    const { data, error } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('employee_id', searchEmployeeId);

    if (error) {
      console.error('❌ Database query error:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log(`\n🔍 Search ID: ${searchEmployeeId} -> ❌ Record Not Found!`);
      return;
    }

    const employee = data[0];

    console.log(`\n--------------------------------------------------`);
    console.log(`🔍 SEARCH ID: ${searchEmployeeId}`);
    console.log(`🏭 YOUR STATIONED PLANT: ${officerPlantId}`);
    console.log(`--------------------------------------------------`);

    // 🔒 Security check — lock data for different plants
    if (employee.active_plant_id !== officerPlantId) {
      console.log(`🛑 SECURITY ALERT: Access Denied!`);
      console.log(`⚠️ Worker '${employee.full_name}' belongs to [${employee.active_plant_id}].`);
      console.log(`🚫 You are currently stationed at [${officerPlantId}] and cannot view this profile.`);
      console.log(`--------------------------------------------------`);
      return;
    }

    // 🟢 Access granted
    console.log(`✅ ACCESS GRANTED: Profile Verified!`);
    console.log(`👤 Name: ${employee.full_name}`);
    console.log(`🩸 Blood Group: ${employee.blood_group}`);
    console.log(`🏥 Medical Status: ${employee.medical_fitness_status}`);
    console.log(`🪪 Gate Pass Expiry: ${employee.gate_pass_expiry}`);
    console.log(`🛡️ Safety Induction Date: ${employee.last_induction_date}`);
    console.log(`--------------------------------------------------`);
  } catch (err) {
    console.error('⚠️ System Error:', err);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🧠 LIVE DIRECTORY LOOKUP FOR WORKERS (Browser context)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Trigger a live name lookup to auto-fill employee ID and designation.
 * Called on input event of the worker name field.
 * @param {string} nameValue - The typed name to search.
 */
async function triggerLiveNameLookup(nameValue) {
  const statusSpan = document.getElementById('lookupStatus');
  const empIdInput = document.getElementById('reportEmpId');
  const desInput = document.getElementById('reportDesignation');

  // Sanitize search input
  const cleanName =
    typeof sanitizeInput === 'function'
      ? sanitizeInput(nameValue.trim())
      : nameValue.trim();

  if (cleanName.length < 3) {
    statusSpan.innerText = '';
    empIdInput.value = '';
    desInput.value = '';
    return;
  }

  statusSpan.innerText = '🔍 Searching directory...';
  statusSpan.className = 'text-[9px] text-amber-500 mt-0.5 block';

  try {
    if (typeof _supabase === 'undefined') {
      console.warn('⚠️ Supabase client not initialized. Skipping lookup.');
      statusSpan.innerText = '❌ Directory unavailable.';
      statusSpan.className = 'text-[9px] text-rose-500 mt-0.5 block';
      return;
    }

    const { data } = await _supabase
      .from('employee_profiles')
      .select('*')
      .ilike('full_name', `%${cleanName}%`);

    if (data && data.length > 0) {
      statusSpan.innerText = '✅ Profile Matched!';
      statusSpan.className = 'text-[9px] text-emerald-600 mt-0.5 block';
      empIdInput.value = data[0].employee_id;
      desInput.value = 'ABC Field Specialist';
    } else {
      statusSpan.innerText = '❌ Not found.';
      statusSpan.className = 'text-[9px] text-rose-500 mt-0.5 block';
      empIdInput.value = '';
      desInput.value = '';
    }
  } catch (err) {
    console.error('❌ Lookup Error:', err);
    statusSpan.innerText = '❌ Search failed.';
    statusSpan.className = 'text-[9px] text-rose-500 mt-0.5 block';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 💥 DYNAMIC SMART FORMS SHOW/HIDE LOGIC ENGINE
// ═════════════════════════════════════════════════════════════════════════════

let activeReportType = '';

/**
 * Open the reporting form modal with dynamic field visibility based on report type.
 * @param {string} type - The report type (e.g., 'Near Miss', 'Hazard', 'Feedback').
 */
function openReportingForm(type) {
  activeReportType = type;
  document.getElementById('modalFormTitle').innerText = 'Log ' + type;
  document.getElementById('reportingModal').classList.remove('hidden');

  const lblLocation = document.getElementById('lblLocation');
  const reportLocation = document.getElementById('reportLocation');
  const lblDept = document.getElementById('lblDept');
  const reportDept = document.getElementById('reportDept');
  const lblDesc = document.getElementById('lblDesc');
  const reportDesc = document.getElementById('reportDesc');
  const dateTimeContainer = document.getElementById('dateTimeContainer');
  const reportDateTime = document.getElementById('reportDateTime');
  const actionContainer = document.getElementById('actionContainer');
  const feedbackCategoryContainer = document.getElementById('feedbackCategoryContainer');
  const riskRatingContainer = document.getElementById('riskRatingContainer');
  const observationTypeContainer = document.getElementById('observationTypeContainer');
  const photoUploadContainer = document.getElementById('photoUploadContainer');

  // Set default time
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  reportDateTime.value = now.toISOString().slice(0, 16);

  // Hide special containers by default
  feedbackCategoryContainer.classList.add('hidden');
  riskRatingContainer.classList.add('hidden');
  observationTypeContainer.classList.add('hidden');

  // 📷 Photo upload visibility
  if (
    [
      'Near Miss',
      'Hazard',
      'UC / UA',
      'Safety Observation',
      'Red Risk',
      'Property Damage',
      'LTI',
      'Fatal',
      'First Aid',
    ].includes(type)
  ) {
    photoUploadContainer.classList.remove('hidden');
  } else {
    photoUploadContainer.classList.add('hidden');
  }

  // 🌟 Feedback special mode
  if (type === 'Feedback') {
    feedbackCategoryContainer.classList.remove('hidden');
  }

  // 🌟 Risk rating for Hazard & UC/UA
  if (type === 'Hazard' || type === 'UC / UA') {
    riskRatingContainer.classList.remove('hidden');
  }

  // 🌟 Observation type for Safety Observation
  if (type === 'Safety Observation') {
    observationTypeContainer.classList.remove('hidden');
  }

  // 🔄 Customize labels for Grievance/Feedback/Suggestion
  if (['Grievance', 'Feedback', 'Suggestion'].includes(type)) {
    lblLocation.innerText = 'Concern Area / Shop Floor';
    reportLocation.placeholder = 'E.g., Sheet Mill A';
    lblDept.innerText = 'Concerned Department';
    reportDept.placeholder = 'E.g., HR / Admin';
    lblDesc.innerText = 'Details of Submission';
    reportDesc.placeholder = 'Type your feedback, grievance or suggestions...';
    dateTimeContainer.classList.add('hidden');
    reportDateTime.removeAttribute('required');
    actionContainer.classList.add('hidden');
  } else {
    lblLocation.innerText = 'Incident Location';
    reportLocation.placeholder = 'E.g., Blast Furnace Site-4';
    lblDept.innerText = 'Incident Department';
    reportDept.placeholder = 'E.g., Operations';
    lblDesc.innerText = 'Incident Description';
    reportDesc.placeholder = 'Describe the hazard or observation clearly...';
    dateTimeContainer.classList.remove('hidden');
    reportDateTime.setAttribute('required', 'true');
    actionContainer.classList.remove('hidden');
  }
}

function closeReportingForm() {
  document.getElementById('reportingModal').classList.add('hidden');
}

function openAccidentSelectModal() {
  document.getElementById('accidentSelectModal').classList.remove('hidden');
}

function closeAccidentSelectModal() {
  document.getElementById('accidentSelectModal').classList.add('hidden');
}

function selectAccidentType(type) {
  closeAccidentSelectModal();
  openReportingForm(type);
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎯 UNIVERSAL SUBMIT WITH SUPABASE INSERT
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Handle form submission for safety reports.
 * Sanitizes inputs, converts photo to base64, and inserts into Supabase.
 * @param {Event} e - The form submit event.
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  // Rate limit check
  if (typeof checkRateLimit === 'function' && !checkRateLimit()) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = '⏳ Submitting...';

  try {
    // Sanitize all user inputs
    const worker = sanitizeInput
      ? sanitizeInput(document.getElementById('reportWorkerName').value)
      : document.getElementById('reportWorkerName').value;
    const empId = sanitizeInput
      ? sanitizeInput(document.getElementById('reportEmpId').value)
      : document.getElementById('reportEmpId').value || '';
    const designation = sanitizeInput
      ? sanitizeInput(document.getElementById('reportDesignation').value)
      : document.getElementById('reportDesignation').value || '';
    const loc = sanitizeInput
      ? sanitizeInput(document.getElementById('reportLocation').value)
      : document.getElementById('reportLocation').value;
    const dept = sanitizeInput
      ? sanitizeInput(document.getElementById('reportDept').value)
      : document.getElementById('reportDept').value || '';
    const dateTime =
      document.getElementById('reportDateTime').value ||
      new Date().toISOString().slice(0, 16);
    const desc = sanitizeInput
      ? sanitizeInput(document.getElementById('reportDesc').value)
      : document.getElementById('reportDesc').value;
    const severity = document.getElementById('reportSeverity')
      ? document.getElementById('reportSeverity').value
      : '';
    const action = sanitizeInput
      ? sanitizeInput(document.getElementById('reportAction').value)
      : document.getElementById('reportAction').value || '';
    const photoInput = document.getElementById('reportPhoto');
    const isAnonymous = document.getElementById('reportAnonymous')
      ? document.getElementById('reportAnonymous').checked
      : false;

    // Convert photo to base64 if present
    let photoBase64 = '';
    if (photoInput && photoInput.files.length > 0) {
      photoBase64 = await fileToBase64(photoInput.files[0]);
    }

    // Determine report type
    let reportType = activeReportType;
    if (reportType === 'Safety Observation') {
      const obsType = document.getElementById('reportObservationType');
      if (obsType) reportType = obsType.value || 'Safety Observation';
    }
    if (reportType === 'Feedback') {
      const fbType = document.getElementById('reportFeedbackType');
      if (fbType) reportType = 'Feedback - ' + fbType.value;
    }

    // Build insert object
    const insertData = {
      report_type: reportType,
      worker_name: isAnonymous ? 'Anonymous' : worker,
      employee_id: empId || 'N/A',
      department: dept || 'N/A',
      location: loc || 'N/A',
      date_time: dateTime,
      description: desc,
      severity_rating: severity || 'N/A',
      immediate_action: action,
      photo_base64: photoBase64,
      status: 'Open',
      action_status: 'Open',
      submitted_at: new Date().toISOString(),
    };

    // Insert into Supabase
    const { error } = await _supabase
      .from('safety_reports')
      .insert([insertData]);
    if (error) throw error;

    alert(
      `✅ ${reportType} Report Submitted Successfully!\n\n👤 ${isAnonymous ? 'Anonymous' : worker}\n📍 ${loc}\n🖼️ ${photoBase64 ? '📸 Photo Attached' : '🚫 No Photo'}\n\nData saved to Supabase Vault. Officer can review it.`
    );

    closeReportingForm();
    e.target.reset();
    document.getElementById('lookupStatus').innerText = '';
  } catch (err) {
    alert('❌ Error submitting report: ' + err.message);
    console.error('Submit Error:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = '✅ Submit to Vault';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 📸 HELPER: Convert file to base64
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Convert a File object to a base64 data URL.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} Base64 data URL.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎯 EXPORTS (for Node.js / testing)
// ═════════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchEmployeeProfile,
    triggerLiveNameLookup,
    openReportingForm,
    closeReportingForm,
    openAccidentSelectModal,
    closeAccidentSelectModal,
    selectAccidentType,
    handleFormSubmit,
    fileToBase64,
  };
}
