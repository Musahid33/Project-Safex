#!/bin/bash
cd /workspace
# Remove all temp/debug files
rm -f _accounts.txt _appcheck.txt _assignments.txt _before.txt _bigsearch.txt _def.txt _empsearch.txt
rm -f _find_func.py _find_func2.py _func_found.txt _hfs_func.txt _hfs_line.txt _hfs_result.txt
rm -f _occ.txt _officer_accounts.txt _officer_def.txt _ps_out.txt _script_start.txt _search.txt
rm -f _validate_found.txt _vars.txt _verify_fix.txt
rm -f "app code.txt"
rm -f dm_check.txt dm_funcs.txt dm_modal.txt dm_out.txt
rm -f end_of_file.txt end_verify.txt exact_lines.txt exact_match.txt
rm -f find_lucide.txt found.txt found2.txt found3.txt full_func.txt
rm -f func_def.txt func_def2.txt func_output.txt func_search.txt
rm -f js_func_check.txt js_section.txt js_start.txt
rm -f line.txt line_num.txt linecount.txt modal_content.txt
rm -f officer_acc.txt out.txt out2.txt out3.txt output.txt
rm -f result.txt script_open.txt script_start.txt script_tags.txt
rm -f supabase_line.txt system-design.md tail210.txt var_check.txt verify_date.txt
echo "Cleanup done"
ls -1
