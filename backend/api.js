/**
 * 🏭 Safex Centralized API Service Layer
 *
 * Provides a unified interface for all Supabase database operations.
 * Used by both the Node.js backend (db.js) and browser-side code.
 *
 * @module api
 */

// ─── Browser / Node dual-environment support ────────────────────────────────
let _supabase;

if (typeof window !== 'undefined' && window._supabase) {
  // Running in browser — use the global Supabase client
  _supabase = window._supabase;
} else {
  // Running in Node.js — import from db.js
  _supabase = require('../db');
}

// ═════════════════════════════════════════════════════════════════════════════
// 📋 SAFETY REPORTS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Insert a new safety report.
 * @param {Object} reportData - The report fields.
 * @returns {Promise<Object>} { data, error }
 */
async function insertSafetyReport(reportData) {
  return _supabase.from('safety_reports').insert([reportData]);
}

/**
 * Fetch safety reports filtered by type.
 * @param {string} reportType - The report type to filter by.
 * @param {string} [secondaryType] - Optional secondary type for OR queries.
 * @returns {Promise<Object>} { data, error }
 */
async function fetchSafetyReportsByType(reportType, secondaryType = '') {
  let query = _supabase.from('safety_reports').select('*');
  if (secondaryType) {
    query = query.or(
      `report_type.eq."${reportType}",report_type.eq."${secondaryType}"`
    );
  } else {
    query = query.eq('report_type', reportType);
  }
  return query.order('id', { ascending: false });
}

/**
 * Fetch all safety reports (only status field for metrics).
 * @returns {Promise<Object>} { data, error }
 */
async function fetchSafetyReportStatuses() {
  return _supabase.from('safety_reports').select('status');
}

/**
 * Fetch a single safety report by ID.
 * @param {number} id - Record ID.
 * @returns {Promise<Object>} { data, error }
 */
async function fetchSafetyReportById(id) {
  return _supabase.from('safety_reports').select('*').eq('id', id).single();
}

/**
 * Update a safety report's status and action_status.
 * @param {number} id - Record ID.
 * @param {Object} updates - Fields to update.
 * @returns {Promise<Object>} { data, error }
 */
async function updateSafetyReport(id, updates) {
  return _supabase.from('safety_reports').update(updates).eq('id', id);
}

/**
 * Update a safety report with RCA/CAPA investigation data.
 * @param {number} id - Record ID.
 * @param {Object} investigationData - { why_why_analysis, root_cause, corrective_action, preventive_action, status, action_status }
 * @returns {Promise<Object>} { data, error }
 */
async function updateSafetyReportInvestigation(id, investigationData) {
  return _supabase.from('safety_reports').update(investigationData).eq('id', id);
}

// ═════════════════════════════════════════════════════════════════════════════
// 👷 EMPLOYEE PROFILES
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Search employee profiles by employee ID.
 * @param {string} employeeId - The employee ID to search.
 * @returns {Promise<Object>} { data, error }
 */
async function searchEmployeeById(employeeId) {
  return _supabase
    .from('employee_profiles')
    .select('*')
    .eq('employee_id', employeeId);
}

/**
 * Search employee profiles by name (case-insensitive partial match).
 * @param {string} name - The name to search.
 * @returns {Promise<Object>} { data, error }
 */
async function searchEmployeeByName(name) {
  return _supabase
    .from('employee_profiles')
    .select('*')
    .ilike('full_name', `%${name}%`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 📚 VAULT TABLES
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Insert a record into any vault table.
 * @param {string} table - Table name (e.g., 'vault_audits', 'vault_training').
 * @param {Object} data - The record data.
 * @returns {Promise<Object>} { data, error }
 */
async function insertVaultRecord(table, data) {
  return _supabase.from(table).insert([data]);
}

/**
 * Fetch records from a vault table.
 * @param {string} table - Table name.
 * @param {Object} [options] - { orderBy, ascending, limit }
 * @returns {Promise<Object>} { data, error }
 */
async function fetchVaultRecords(table, options = {}) {
  const { orderBy = 'id', ascending = false, limit: maxRows } = options;
  let query = _supabase.from(table).select('*').order(orderBy, { ascending });
  if (maxRows) query = query.limit(maxRows);
  return query;
}

// ═════════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD METRICS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Fetch dashboard metrics for a specific plant and month range.
 * @param {string} plantId - Plant identifier.
 * @param {string} startDate - ISO date string for start of range.
 * @param {string} endDate - ISO date string for end of range.
 * @returns {Promise<Object>} { data, error }
 */
async function fetchDashboardMetrics(plantId, startDate, endDate) {
  return _supabase
    .from('safety_reports')
    .select('*')
    .eq('location', plantId)
    .gte('submitted_at', startDate)
    .lte('submitted_at', endDate);
}

// ═════════════════════════════════════════════════════════════════════════════
// 🚨 SAFETY ALERTS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Fetch safety alerts by category.
 * @param {string} category - Alert category (lti, fatal, global, employee).
 * @returns {Promise<Object>} { data, error }
 */
async function fetchAlertsByCategory(category) {
  return _supabase
    .from('vault_alerts')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: false });
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎯 EXPORT
// ═════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Safety Reports
  insertSafetyReport,
  fetchSafetyReportsByType,
  fetchSafetyReportStatuses,
  fetchSafetyReportById,
  updateSafetyReport,
  updateSafetyReportInvestigation,

  // Employee Profiles
  searchEmployeeById,
  searchEmployeeByName,

  // Vault Tables
  insertVaultRecord,
  fetchVaultRecords,

  // Dashboard
  fetchDashboardMetrics,

  // Alerts
  fetchAlertsByCategory,
};
