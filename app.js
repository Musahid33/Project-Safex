// Import the database connection from db.js
const supabase = require('./db');

/**
 * 🏭 Tata Steel - Safety Profile Search Engine
 * @param {string} officerPlantId - The plant ID where the safety officer is logged in
 * @param {string} searchEmployeeId - The Employee ID being searched
 */
async function searchEmployeeProfile(officerPlantId, searchEmployeeId) {
    try {
        // Fetch data from Supabase
        const { data, error } = await supabase
            .from('employee_profiles')
            .select('*')
            .eq('employee_id', searchEmployeeId);

        if (error) {
            console.error("❌ Database query error:", error.message);
            return;
        }

        // Check if employee record exists
        if (!data || data.length === 0) {
            console.log(`\n🔍 Search ID: ${searchEmployeeId} -> ❌ Record Not Found!`);
            return;
        }

        const employee = data[0];

        console.log(`\n--------------------------------------------------`);
        console.log(`🔍 SEARCH ID: ${searchEmployeeId}`);
        console.log(`🏭 YOUR STATIONED PLANT: ${officerPlantId}`);
        console.log(`--------------------------------------------------`);

        // 🔒 SECURITY CHECK - Lock data for different plants
        if (employee.active_plant_id !== officerPlantId) {
            console.log(`🛑 SECURITY ALERT: Access Denied!`);
            console.log(`⚠️ Worker '${employee.full_name}' belongs to [${employee.active_plant_id}].`);
            console.log(`🚫 You are currently stationed at [${officerPlantId}] and cannot view this profile.`);
            console.log(`--------------------------------------------------`);
            return;
        }

        // 🟢 Access Granted if Plant IDs match
        console.log(`✅ ACCESS GRANTED: Profile Verified!`);
        console.log(`👤 Name: ${employee.full_name}`);
        console.log(`🩸 Blood Group: ${employee.blood_group}`);
        console.log(`🏥 Medical Status: ${employee.medical_fitness_status}`);
        console.log(`🪪 Gate Pass Expiry: ${employee.gate_pass_expiry}`);
        console.log(`🛡️ Safety Induction Date: ${employee.last_induction_date}`);
        console.log(`--------------------------------------------------`);

    } catch (err) {
        console.error("⚠️ System Error:", err);
    }
}

// ==========================================
// 🧪 LIVE TESTING SIMULATION
// ==========================================
// Simulating an officer logged in at Kalinganagar plant
const currentOfficerPlant = 'TSL-Kalinganagar';

async function runDemo() {
    // Test 1: Accessing a worker from the same plant (Should be ALLOWED)
    await searchEmployeeProfile(currentOfficerPlant, 'TSL-EMP-101');

    // Test 2: Accessing a worker from Jamshedpur plant (Should be BLOCKED)
    setTimeout(async () => {
        await searchEmployeeProfile(currentOfficerPlant, 'TSL-EMP-102');
    }, 2500);
}

runDemo();

// ==========================================
// 🧠 LIVE DIRECTORY LOOKUP FOR WORKERS (AUTO-FILL)
// ==========================================
async function triggerLiveNameLookup(nameValue) {
    const statusSpan = document.getElementById('lookupStatus');
    const empIdInput = document.getElementById('reportEmpId');
    const desInput = document.getElementById('reportDesignation');
    
    // 🔒 Sanitize search input
    const cleanName = sanitizeInput ? sanitizeInput(nameValue.trim()) : nameValue.trim();
    
    if (cleanName.length < 3) { 
        statusSpan.innerText = ""; empIdInput.value = ""; desInput.value = ""; return; 
    }
    
    statusSpan.innerText = "🔍 Searching directory...";
    statusSpan.className = "text-[9px] text-amber-500 mt-0.5 block";
    
    try {
        // Initialize Supabase client if _supabase is not defined
        if (typeof _supabase === 'undefined') {
            console.warn("⚠️ Supabase client not initialized. Skipping lookup.");
            statusSpan.innerText = "❌ Directory unavailable.";
            statusSpan.className = "text-[9px] text-rose-500 mt-0.5 block";
            return;
        }
        
        const { data } = await _supabase.from('employee_profiles').select('*').ilike('full_name', `%${cleanName}%`);
        if (data && data.length > 0) {
            statusSpan.innerText = "✅ Profile Matched!"; 
            statusSpan.className = "text-[9px] text-emerald-600 mt-0.5 block";
            empIdInput.value = data[0].employee_id; 
            desInput.value = "ABC Field Specialist";
        } else { 
            statusSpan.innerText = "❌ Not found."; 
            statusSpan.className = "text-[9px] text-rose-500 mt-0.5 block"; 
            empIdInput.value = ""; desInput.value = ""; 
        }
    } catch (err) { 
        console.error("❌ Lookup Error:", err);
        statusSpan.innerText = "❌ Search failed.";
        statusSpan.className = "text-[9px] text-rose-500 mt-0.5 block";
    }
}

// ==========================================
// 💥 DYNAMIC SMART FORMS SHOW/HIDE LOGIC ENGINE
// ==========================================
let activeReportType = "";

function openReportingForm(type) {
    activeReportType = type;
    document.getElementById('modalFormTitle').innerText = "Log " + type;
    document.getElementById('reportingModal').classList.remove('hidden');

    // फॉर्म के सेक्शन्स
    const lblLocation = document.getElementById('lblLocation');
    const reportLocation = document.getElementById('reportLocation');
    const lblDept = document.getElementById('lblDept');
    const reportDept = document.getElementById('reportDept');
    const lblDesc = document.getElementById('lblDesc');
    const reportDesc = document.getElementById('reportDesc');
    
    const dateTimeContainer = document.getElementById('dateTimeContainer');
    const reportDateTime = document.getElementById('reportDateTime');
    const actionContainer = document.getElementById('actionContainer');
    
    // नए डायनेमिक कंटेनर्स
    const feedbackCategoryContainer = document.getElementById('feedbackCategoryContainer');
    const riskRatingContainer = document.getElementById('riskRatingContainer');
    const observationTypeContainer = document.getElementById('observationTypeContainer');
    const photoUploadContainer = document.getElementById('photoUploadContainer');

    // डिफ़ॉल्ट टाइम सेट करना
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    reportDateTime.value = now.toISOString().slice(0, 16);

    // डिफ़ॉल्ट रूप से विशेष फ़ील्ड्स को छुपाएं
    feedbackCategoryContainer.classList.add('hidden');
    riskRatingContainer.classList.add('hidden');
    observationTypeContainer.classList.add('hidden');
    
    // 📷 1. फ़ोटो अपलोड की विजिबिलिटी सेट करना (ONLY Near Miss, Hazard, UC/UA, Observation, Accidents में रहेगा)
    if (['Near Miss', 'Hazard', 'UC / UA', 'Safety Observation', 'Red Risk', 'Property Damage', 'LTI', 'Fatal', 'First Aid'].includes(type)) {
        photoUploadContainer.classList.remove('hidden');
    } else {
        photoUploadContainer.classList.add('hidden'); // Feedback, Grievance, Suggestion में गायब!
    }

    // 🌟 2. फ़ीडबैक स्पेशल मोड इनेबल करना
    if (type === 'Feedback') {
        feedbackCategoryContainer.classList.remove('hidden');
    }

    // 🌟 3. रिस्क रेटिंग इनेबल करना (For Hazard & UC / UA)
    if (type === 'Hazard' || type === 'UC / UA') {
        riskRatingContainer.classList.remove('hidden');
    }

    // 🌟 4. ऑब्जर्वेशन टाइप इनेबल करना (For Safety Observation)
    if (type === 'Safety Observation') {
        observationTypeContainer.classList.remove('hidden');
    }

    // 🔄 5. लेबल्स और इनपुट अरेंजमेंट कस्टमाइज़ करना
    if (['Grievance', 'Feedback', 'Suggestion'].includes(type)) {
        lblLocation.innerText = "Concern Area / Shop Floor";
        reportLocation.placeholder = "E.g., Sheet Mill A";
        lblDept.innerText = "Concerned Department";
        reportDept.placeholder = "E.g., HR / Admin";
        lblDesc.innerText = "Details of Submission";
        reportDesc.placeholder = "Type your feedback, grievance or suggestions...";
        
        dateTimeContainer.classList.add('hidden');
        reportDateTime.removeAttribute('required');
        actionContainer.classList.add('hidden');
    } else {
        lblLocation.innerText = "Incident Location";
        reportLocation.placeholder = "E.g., Blast Furnace Site-4";
        lblDept.innerText = "Incident Department";
        reportDept.placeholder = "E.g., Operations";
        lblDesc.innerText = "Incident Description";
        reportDesc.placeholder = "Describe the hazard or observation clearly...";
        
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

// ==========================================
// 🎯 UNIVERSAL SUBMIT WITH SUPABASE INSERT
// ==========================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // 🔒 Rate limit check
    if (typeof checkRateLimit === 'function' && !checkRateLimit()) return;
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '⏳ Submitting...';
    
    try {
        // 🔒 Sanitize all user inputs
        const worker = sanitizeInput ? sanitizeInput(document.getElementById('reportWorkerName').value) : document.getElementById('reportWorkerName').value;
        const empId = sanitizeInput ? sanitizeInput(document.getElementById('reportEmpId').value) : document.getElementById('reportEmpId').value || '';
        const designation = sanitizeInput ? sanitizeInput(document.getElementById('reportDesignation').value) : document.getElementById('reportDesignation').value || '';
        const loc = sanitizeInput ? sanitizeInput(document.getElementById('reportLocation').value) : document.getElementById('reportLocation').value;
        const dept = sanitizeInput ? sanitizeInput(document.getElementById('reportDept').value) : document.getElementById('reportDept').value || '';
        const dateTime = document.getElementById('reportDateTime').value || new Date().toISOString().slice(0, 16);
        const desc = sanitizeInput ? sanitizeInput(document.getElementById('reportDesc').value) : document.getElementById('reportDesc').value;
        const severity = document.getElementById('reportSeverity') ? document.getElementById('reportSeverity').value : '';
        const action = sanitizeInput ? sanitizeInput(document.getElementById('reportAction').value) : document.getElementById('reportAction').value || '';
        const photoInput = document.getElementById('reportPhoto');
        const isAnonymous = document.getElementById('reportAnonymous') ? document.getElementById('reportAnonymous').checked : false;
        
        // Convert photo to base64 if present
        let photoBase64 = '';
        if (photoInput && photoInput.files.length > 0) {
            photoBase64 = await fileToBase64(photoInput.files[0]);
        }
        
        // Determine report type from activeReportType
        let reportType = activeReportType;
        // Map observation types
        if (reportType === 'Safety Observation') {
            const obsType = document.getElementById('reportObservationType');
            if (obsType) reportType = obsType.value || 'Safety Observation';
        }
        // Map feedback types
        if (reportType === 'Feedback') {
            const fbType = document.getElementById('reportFeedbackType');
            if (fbType) reportType = 'Feedback - ' + fbType.value;
        }
        
        // Build the insert object matching safety_reports table columns
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
            submitted_at: new Date().toISOString()
        };
        
        // Insert into Supabase safety_reports table
        const { error } = await _supabase.from('safety_reports').insert([insertData]);
        if (error) throw error;
        
        // Success
        alert(`✅ ${reportType} Report Submitted Successfully!\n\n👤 ${isAnonymous ? 'Anonymous' : worker}\n📍 ${loc}\n🖼️ ${photoBase64 ? '📸 Photo Attached' : '🚫 No Photo'}\n\nData saved to Supabase Vault. Officer can review it.`);
        
        closeReportingForm();
        e.target.reset();
        document.getElementById('lookupStatus').innerText = "";
        
    } catch (err) {
        alert('❌ Error submitting report: ' + err.message);
        console.error('Submit Error:', err);
    } finally {
        btn.disabled = false;
        btn.textContent = '✅ Submit to Vault';
    }
}

// 📸 Helper: Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) { resolve(''); return; }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}