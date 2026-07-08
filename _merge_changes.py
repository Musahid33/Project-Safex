#!/usr/bin/env python3
"""Merge old file features into current index.html"""
with open('index.html', 'r') as f:
    content = f.read()

changes = 0

# 1. Fix Search button: external link -> button with modal
old1 = '<a href="https://musahid33.github.io/emveess-safety-portal/" target="_blank" class="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnPublicSearch">\n                <i data-lucide="search" class="w-3.5 h-3.5"></i> Employee Search\n            </a>'
new1 = '<button onclick="openPublicSearchModal()" class="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnPublicSearch">\n                <i data-lucide="search" class="w-3.5 h-3.5"></i> Search\n            </button>'
if old1 in content:
    content = content.replace(old1, new1)
    changes += 1
    print("1. Search button: external link -> modal button")
else:
    print("1. SKIP - Search pattern not found")

# 2. Fix Officer button text
old2 = 'Officer Login'
new2 = 'Officer'
if old2 in content:
    content = content.replace(old2, new2)
    changes += 1
    print("2. Officer button: 'Officer Login' -> 'Officer'")
else:
    print("2. SKIP - Officer Login not found")

# 3. Fix Conduct DM: external link -> button with modal
old3 = '<a href="https://script.google.com/macros/s/AKfycbyKpFHGJlliJyzuDfYHn3eDaDyD12mfdviUQa44fpAd9JgyzQ5I2st65Rj-7XLrlqf9/exec" target="_blank" class="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnDmConduct">\n                <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> Conduct DM\n            </a>'
new3 = '<button onclick="openDmConduct()" class="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold py-2 px-1 rounded-md transition shadow-sm" id="btnDmConduct">\n                <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> Conduct DM\n            </button>'
if old3 in content:
    content = content.replace(old3, new3)
    changes += 1
    print("3. DM button: external link -> modal button")
else:
    print("3. SKIP - DM pattern not found")

# 4. Add DM modal before </body>
dm_modal = '\n    <!-- 📋 DM CONDUCT MODAL -->\n    <div id="dmConductModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">\n        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4">\n            <div class="bg-amber-600 text-white px-4 py-3.5 flex justify-between items-center sticky top-0">\n                <h3 class="font-black text-sm uppercase tracking-wide">📋 Daily Morning (DM) Conduct</h3>\n                <button onclick="closeDmConduct()" class="text-white font-bold text-lg">✕</button>\n            </div>\n            <form onsubmit="handleDmSubmit(event)" class="p-4 space-y-3 overflow-y-auto max-h-[80vh]">\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">📅 Date</label>\n                    <input type="date" id="dmDate" required class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">🕐 Shift</label>\n                    <select id="dmShift" required class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500">\n                        <option value="">Select Shift</option>\n                        <option value="Morning">Morning (6 AM - 2 PM)</option>\n                        <option value="Afternoon">Afternoon (2 PM - 10 PM)</option>\n                        <option value="Night">Night (10 PM - 6 AM)</option>\n                    </select>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">📍 Location / Area</label>\n                    <input type="text" id="dmLocation" required placeholder="E.g., Blast Furnace, Site-4" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">👥 Number of Attendees</label>\n                    <input type="number" id="dmAttendees" required min="1" placeholder="E.g., 12" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">💬 Key Topics Discussed</label>\n                    <textarea id="dmTopics" required rows="3" placeholder="List the main safety topics discussed..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">⚠️ Safety Observations / Issues Raised</label>\n                    <textarea id="dmIssues" rows="2" placeholder="Any safety concerns or observations noted..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">✅ Action Items</label>\n                    <textarea id="dmActions" rows="2" placeholder="Action items assigned during the meeting..." class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"></textarea>\n                </div>\n                <div>\n                    <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">👤 Conducted By</label>\n                    <input type="text" id="dmConductedBy" required placeholder="Name of person conducting the DM" class="w-full text-xs border border-gray-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-amber-500"/>\n                </div>\n                <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md">\n                    ✅ Submit DM Record\n                </button>\n            </form>\n        </div>\n    </div>\n'
if '</body>' in content:
    content = content.replace('</body>', dm_modal + '</body>')
    changes += 1
    print("4. DM modal added before </body>")
else:
    print("4. SKIP - </body> not found")

# 5. Add DM functions before </script>
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
if '</script>' in content:
    content = content.replace('</script>', dm_js + '\n    </script>')
    changes += 1
    print("5. DM functions added before </script>")
else:
    print("5. SKIP - </script> not found")

with open('index.html', 'w') as f:
    f.write(content)
print(f"\nTotal changes applied: {changes}")
