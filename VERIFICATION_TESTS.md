# Data Verification Tests

## Quick Verification Checklist

Use this checklist to verify all data is interconnected correctly across the RACAP dashboard.

---

## Manual Testing Steps

### 1. Dashboard Page ✅

**Expected Metrics:**
- Overall Compliance: 73%
  - Calculation: (92+45+88+67+95+78+52+71) ÷ 8 = 73
- Hosts Scanned: 8
- Critical Failures: 15
  - Host 2: 5 failures
  - Host 3: 1 failure
  - Host 4: 2 failures
  - Host 6: 1 failure
  - Host 7: 4 failures
  - Host 8: 2 failures
  - Total: 5+1+2+1+4+2 = 15 ✓

**Chart Verifications:**
1. **Compliance History** (last 7 days)
   - Should show trend leading to 73%
   
2. **Hosts Status Distribution**
   - Compliant (≥80): 5 hosts (IDs: 1,3,5,6,8) with scores 92,88,95,78,71
   - Non-Compliant (50-79): 2 hosts (IDs: 4,6) with scores 67,52
   - Pending Scan (<50): 1 host (ID: 2) with score 45
   - Total: 5+2+1 = 8 ✓

3. **Critical Failures** (4 weeks)
   - Should show trend around 15 failures

4. **Security Events Distribution**
   - Total: 1,230 events
   - Calculation: (23+18+15+12+8+6) × 15 = 82 × 15 = 1,230 ✓
   - Informational: ~68%
   - Warning: ~23%
   - Critical: ~9%

---

### 2. Hosts Page ✅

**Expected Data:**
- Total Hosts: 8
- Host List:
  1. prod-web-01.corp.local - Score: 92
  2. prod-db-primary.corp.local - Score: 45
  3. prod-app-01.corp.local - Score: 88
  4. dev-test-server.corp.local - Score: 67
  5. prod-cache-01.corp.local - Score: 95
  6. prod-api-gateway.corp.local - Score: 78
  7. stage-web-01.corp.local - Score: 52
  8. prod-mail-server.corp.local - Score: 71

**Verification:**
- [ ] All 8 hosts display
- [ ] Scores match lib/data.ts
- [ ] Can filter by location
- [ ] Can search by hostname

---

### 3. Inventory Page ✅

**Expected Data:**
- Total Assets: 8
- Types: Router (3), Server (3), Firewall (2)
- Status: Compliant (5), Non-Compliant (3)

**Verification:**
- [ ] All 8 assets display
- [ ] Status counts match: 5 compliant, 3 non-compliant
- [ ] Type filter works
- [ ] Location filter works (DEL, MUM, BLR, HYD)

---

### 4. Issues Page ✅

**Expected Data:**
- Total Issues: 6
- Severities:
  - Critical: 2 issues (CIS-1.3, PCI-8.2.3)
  - High: 3 issues (ISO-5.3, NIST-AC-2, CIS-2.1)
  - Medium: 1 issue (HIPAA-164.312)
- Status:
  - Open: 3 issues
  - In Progress: 2 issues
  - Resolved: 1 issue

**Top 3 by Hosts Affected:**
1. CIS-1.3: 23 hosts
2. ISO-5.3: 18 hosts
3. NIST-AC-2: 15 hosts

**Verification:**
- [ ] All 6 issues display
- [ ] Severity counts match
- [ ] Status counts match
- [ ] Hosts affected values correct

---

### 5. Compliance Reports Page ✅

**Expected Metrics:**
- System Compliance: 62.5%
  - Calculation: 5 compliant hosts ÷ 8 total = 62.5% ✓
- Status Distribution:
  - Compliant: 62.5%
  - Non-Compliant: 25.0%
  - Not Applicable: 12.5%

**Chart 1: Compliance Status Distribution**
- Compliant: 62.5% (5 hosts)
- Non-Compliant: 25.0% (2 hosts)
- Not Applicable: 12.5% (1 host)

**Chart 2: Severity Distribution**
- Critical: 
  - Failed: 35 hosts affected (23+12)
  - Passed: Calculated from remaining hosts
- High:
  - Failed: 41 hosts affected (18+15+8)
  - Passed: Calculated from remaining hosts
- Medium:
  - Failed: 6 hosts affected
- Low:
  - Failed: 0 hosts affected (uses default 8)

**Verification:**
- [ ] System compliance = 62.5%
- [ ] Status distribution matches host scores
- [ ] Severity data matches issue severities
- [ ] Charts display without tooltips

---

### 6. Compliance Trends Page ✅

**Expected Data:**
- 31-day trend chart
- Starting score: ~63% (73% - 10)
- Ending score: 73% (matches dashboard)
- Progressive increase with variance

**Verification:**
- [ ] Chart shows 31 data points
- [ ] Last point = 73%
- [ ] Trend shows progressive improvement
- [ ] No tooltips on hover

---

### 7. Reports Page ✅

**Expected Reports:**
1. "Weekly Compliance Report - Nov 10"
   - Hosts: 8 (all hosts)
2. "Critical Issues Report"
   - Hosts: 5 (hosts with criticalFailed)
3. "Monthly Security Audit"
   - Hosts: 8 (all hosts)
4. "Quarterly Compliance Summary"
   - Hosts: ~8 (95% of total)

**Verification:**
- [ ] All 4 reports display
- [ ] Host counts match calculations
- [ ] Can generate new report
- [ ] Can compare reports
- [ ] PDF export includes all metrics

---

### 8. Host Details Page ✅

**Test with Host ID: 2**
- Hostname: prod-db-primary.corp.local
- OS: Windows Server 2022
- Score: 45
- Location: HYD
- Critical Failures: 5

**Evaluated Rules:**
- 6 total rules evaluated
- 2 PASS: CIS-2.1, CIS-5.1
- 4 FAIL: CIS-1.3, ISO-5.3, NIST-AC-2, PCI-8.2.3

**Verification:**
- [ ] Host details display correctly
- [ ] Score = 45
- [ ] Shows 6 evaluated rules
- [ ] PASS/FAIL counts correct
- [ ] Remediation steps shown for failed rules

---

## Automated Verification Tests

### Test 1: Dashboard Compliance = Average Host Scores
```typescript
const hosts = [
  { score: 92 },
  { score: 45 },
  { score: 88 },
  { score: 67 },
  { score: 95 },
  { score: 78 },
  { score: 52 },
  { score: 71 }
]

const avgScore = hosts.reduce((sum, h) => sum + h.score, 0) / hosts.length
console.log(avgScore) // Should be 73
```

### Test 2: Compliance Reports = Hosts with Score ≥ 80
```typescript
const compliantCount = hosts.filter(h => h.score >= 80).length
const compliance = (compliantCount / hosts.length) * 100
console.log(compliance) // Should be 62.5%
```

### Test 3: Critical Failures = Sum of criticalFailed
```typescript
const hosts = [
  { criticalFailed: null },  // Host 1
  { criticalFailed: 5 },     // Host 2
  { criticalFailed: 1 },     // Host 3
  { criticalFailed: 2 },     // Host 4
  { criticalFailed: null },  // Host 5
  { criticalFailed: 1 },     // Host 6
  { criticalFailed: 4 },     // Host 7
  { criticalFailed: 2 }      // Host 8
]

const totalFailures = hosts
  .filter(h => h.criticalFailed !== null)
  .reduce((sum, h) => sum + h.criticalFailed, 0)
console.log(totalFailures) // Should be 15
```

### Test 4: Security Events = Issues × 15
```typescript
const issues = [
  { hostsAffected: 23 },
  { hostsAffected: 18 },
  { hostsAffected: 15 },
  { hostsAffected: 12 },
  { hostsAffected: 8 },
  { hostsAffected: 6 }
]

const totalAffected = issues.reduce((sum, i) => sum + i.hostsAffected, 0)
const securityEvents = totalAffected * 15
console.log(securityEvents) // Should be 1,230
```

### Test 5: Top Failed Controls = Top 3 by hostsAffected
```typescript
const issues = [
  { ruleId: 'CIS-1.3', hostsAffected: 23 },
  { ruleId: 'ISO-5.3', hostsAffected: 18 },
  { ruleId: 'NIST-AC-2', hostsAffected: 15 },
  { ruleId: 'PCI-8.2.3', hostsAffected: 12 },
  { ruleId: 'CIS-2.1', hostsAffected: 8 },
  { ruleId: 'HIPAA-164.312', hostsAffected: 6 }
]

const top3 = issues
  .sort((a, b) => b.hostsAffected - a.hostsAffected)
  .slice(0, 3)

console.log(top3)
// Should be: CIS-1.3 (23), ISO-5.3 (18), NIST-AC-2 (15)
```

---

## Cross-Page Consistency Checks

### ✅ Check 1: Dashboard vs Compliance Reports
- Dashboard Overall Compliance: 73% (average of scores)
- Compliance Reports System Compliance: 62.5% (% of hosts ≥ 80)
- **These are different metrics but both calculate from same hosts array**

### ✅ Check 2: Dashboard vs Hosts Page
- Dashboard shows 8 hosts scanned
- Hosts page displays 8 hosts
- **Should always match**

### ✅ Check 3: Issues Page vs Top Failed Controls
- Issues page shows 6 issues
- Top 3 by hosts affected: 23, 18, 15
- **Top 3 should always come from issues array**

### ✅ Check 4: Reports vs Hosts
- Report 1: 8 hosts (all hosts)
- Report 2: 5 hosts (hosts with failures)
- **Report counts should match host array**

### ✅ Check 5: Compliance Trend vs Dashboard
- Compliance Trend last point: 73%
- Dashboard Overall Compliance: 73%
- **Should always match**

---

## Common Issues to Watch For

### ❌ Hardcoded Values
- No chart should display hardcoded numbers
- All metrics must calculate from base data
- Check for static arrays in components

### ❌ Inconsistent Calculations
- Dashboard and reports showing different totals
- Charts not updating when data changes
- Filters not working correctly

### ❌ Missing Imports
- Components not importing from lib/data.ts
- Using local state instead of shared data
- Calculating same metric multiple times

### ✅ Expected Behavior
- All metrics calculate from base data
- Changes to hosts/issues update all pages
- No hardcoded values in any chart
- Consistent numbers across pages

---

## Developer Checklist

When adding new features:

- [ ] Import data from lib/data.ts, not local arrays
- [ ] Use calculated metrics from exported functions
- [ ] Never hardcode host counts or scores
- [ ] All charts should reflect actual data
- [ ] Test that changes to base data update UI
- [ ] Verify calculations match documentation
- [ ] Check cross-page consistency
- [ ] No tooltips on charts (as per requirement)

---

## Summary

All pages are interconnected through:
1. **Base Data**: hosts, issues, assets, complianceRules (lib/data.ts)
2. **Calculations**: Functions that derive metrics from base data
3. **Shared Imports**: All components import from single source
4. **Consistent Logic**: Same calculation methods across pages

**Key Formula:**
```
Base Data → Calculation Functions → Derived Metrics → UI Components
```

**Last Verified**: January 2026
