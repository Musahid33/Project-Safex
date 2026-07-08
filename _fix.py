#!/usr/bin/env python3
import sys
with open('index.html', 'r') as f:
    content = f.read()

# Find the exact header block
marker = '<!-- Login Quick Actions -->'
start = content.find(marker)
if start == -1:
    print("ERROR: marker not found")
    sys.exit(1)

# Find the end of the header block (next comment or </header>)
end_marker = '</header>'
end = content.find(end_marker, start)
if end == -1:
    print("ERROR: </header> not found")
    sys.exit(1)

old_block = content[start:end]
print(f"Found block from {start} to {end}")
print(f"Old block starts with: {old_block[:80]}")

# Build new block
new_block = '''        <!-- Login Quick Actions -->
        <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800">
            <button onclick="openPublicSearchModal()" class="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnPublicSearch">
                <i data-lucide="search" class="w-3.5 h-3.5"></i> Search
            </button>
            <button onclick="openOfficerModal()" class="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold py-2 px-1 rounded-md border border-slate-700 transition shadow-sm" id="btnOfficerSearch">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-400"></i> Officer
            </button>
            <button onclick="openDmConduct()" class="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnDmConduct">
                <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> Conduct DM
            </button>
        </div>
    </header>'''

content = content[:start] + new_block + content[end+len(end_marker):]

# Add DM modal before </body>
dm_modal = '''
    <!-- 📋 DM CONDUCT MODAL -->
    <div id="dmConductModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4">
            <div class="bg-amber-600 text-white px-4 py-3.5 flex justify-between items-center sticky top-0">
                <h3 class="font-black text-sm uppercase tracking-wide">📋 Daily Morning (DM) Conduct</h3>
                <button onclick="closeDmConduct()" class="text-white font-bold text-lg">✕</button>
            </div>
            <form onsubmit="handleDmSubmit(event)" class="p-4 space-y-3 overflow-y-auto max-h-[80vh]">
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">📅 Date</label>
                    <input type="date" id="dmDate" required class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">🕐 Shift</label>
                    <select id="dmShift" required class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500">
                        <option value="">Select Shift</option>
                        <option value="Morning">Morning (6 AM - 2 PM)</option>
                        <option value="Afternoon">Afternoon (2 PM - 10 PM)</option>
                        <option value="Night">Night (10 PM - 6 AM)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">📍 Location / Area</label>
                    <input type="text" id="dmLocation" required placeholder="E.g., Blast Furnace, Site-4" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">👥 Number of Attendees</label>
                    <input type="number" id="dmAttendees" required min="1" placeholder="E.g., 12" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">💬 Key Topics Discussed</label>
                    <textarea id="dmTopics" required rows="3" placeholder="List the main safety topics discussed..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">⚠️ Safety Observations / Issues Raised</label>
                    <textarea id="dmIssues" rows="2" placeholder="Any safety concerns or observations noted..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">✅ Action Items</label>
                    <textarea id="dmActions" rows="2" placeholder="Action items assigned during the meeting..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">👤 Conducted By</label>
                    <input type="text" id="dmConductedBy" required placeholder="Name of person conducting the DM" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>
                </div>
                <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md">
                    ✅ Submit DM Record
                </button>
            </form>
        </div>
    </div>
'''
content = content.replace('</body>', dm_modal + '\n</body>')

# Add DM functions before </script>
dm_js = '''
        // 📋 DM CONDUCT FUNCTIONS
        function openDmConduct() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dmDate').value = today;
            document.getElementById('dmConductModal').classList.remove('hidden');
        }
        function closeDmConduct() {
            document.getElementById('dmConductModal').classList.add('hidden');
        }
        async function handleDmSubmit(event) {
            event.preventDefault();
            const date = document.getElementById('dmDate').value;
            const shift = document.getElementById('dmShift').value;
            const location = document.getElementById('dmLocation').value;
            const attendees = parseInt(document.getElementById('dmAttendees').value);
            const topics = document.getElementById('dmTopics').value;
            const issues = document.getElementById('dmIssues').value;
            const actions = document.getElementById('dmActions').value;
            const conductedBy = document.getElementById('dmConductedBy').value;

            const btn = event.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = '⏳ Submitting...';

            try {
                const { data, error } = await _supabase
                    .from('dm_records')
                    .insert([{
                        date: date,
                        shift: shift,
                        location: location,
                        attendees: attendees,
                        topics_discussed: topics,
                        issues_raised: issues,
                        action_items: actions,
                        conducted_by: conductedBy,
                        created_at: new Date().toISOString()
                    }]);

                if (error) throw error;

                alert('✅ DM Record submitted successfully!');
                closeDmConduct();
                event.target.reset();
            } catch(err) {
                alert('❌ Error submitting DM record: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '✅ Submit DM Record';
            }
        }
'''
content = content.replace('</script>', dm_js + '\n    </script>')

with open('index.html', 'w') as f:
    f.write(content)
print("SUCCESS: All changes applied!")
