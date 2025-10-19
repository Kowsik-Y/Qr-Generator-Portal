#!/usr/bin/env node

/**
 * DIAGNOSTIC SCRIPT - Run this to check your setup
 * 
 * Usage:
 * node diagnostic.js
 */

const https = require('https');
const http = require('http');

console.log('\n🔍 DIAGNOSTIC TOOL - Quiz Portal Inactive Courses/Tests\n');
console.log('=' .repeat(60));

// Configuration
const BACKEND_URL = 'http://localhost:3000';
const TOKEN = process.env.TOKEN || 'YOUR_TOKEN_HERE';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}${path}`;
    const options = {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    http.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', reject);
  });
}

async function runDiagnostics() {
  try {
    // Test 1: Check backend is running
    log('\n📡 Test 1: Checking if backend is running...', 'blue');
    try {
      const response = await makeRequest('/api/courses');
      if (response.status === 200 || response.status === 401) {
        log('✅ Backend is running!', 'green');
      } else {
        log(`⚠️  Backend responded with status: ${response.status}`, 'yellow');
      }
    } catch (error) {
      log('❌ Backend is NOT running!', 'red');
      log(`   Error: ${error.message}`, 'red');
      log('\n   Start backend with: cd backend && npm run dev', 'yellow');
      return;
    }

    // Test 2: Check courses endpoint
    log('\n📚 Test 2: Fetching courses (active only)...', 'blue');
    const coursesResponse = await makeRequest('/api/courses');
    if (coursesResponse.status === 200) {
      const courses = coursesResponse.data.courses || coursesResponse.data;
      log(`✅ Found ${courses.length} courses`, 'green');
      const active = courses.filter(c => c.is_active).length;
      const inactive = courses.filter(c => !c.is_active).length;
      log(`   Active: ${active}, Inactive: ${inactive}`, 'bright');
      
      if (inactive > 0) {
        log('   ⚠️  WARNING: Inactive courses showing without include_inactive param!', 'yellow');
      }
    } else if (coursesResponse.status === 401) {
      log('⚠️  Not authenticated! Set TOKEN environment variable', 'yellow');
      log('   Example: export TOKEN="your_jwt_token_here"', 'yellow');
    } else {
      log(`❌ Failed: ${coursesResponse.status}`, 'red');
    }

    // Test 3: Check courses with include_inactive
    log('\n📚 Test 3: Fetching courses (including inactive)...', 'blue');
    const allCoursesResponse = await makeRequest('/api/courses?include_inactive=true');
    if (allCoursesResponse.status === 200) {
      const courses = allCoursesResponse.data.courses || allCoursesResponse.data;
      log(`✅ Found ${courses.length} total courses`, 'green');
      const active = courses.filter(c => c.is_active).length;
      const inactive = courses.filter(c => !c.is_active).length;
      log(`   Active: ${active}, Inactive: ${inactive}`, 'bright');
      
      if (inactive === 0) {
        log('   ⚠️  No inactive courses found!', 'yellow');
        log('   Run: UPDATE courses SET is_active = false WHERE id = 1;', 'yellow');
      } else {
        log('   ✅ Inactive courses exist!', 'green');
        courses.filter(c => !c.is_active).forEach(c => {
          log(`      - ${c.title} (ID: ${c.id})`, 'bright');
        });
      }
    } else {
      log(`❌ Failed: ${allCoursesResponse.status}`, 'red');
    }

    // Test 4: Check tests endpoint
    log('\n📝 Test 4: Checking tests endpoint...', 'blue');
    const testsResponse = await makeRequest('/api/tests');
    if (testsResponse.status === 200) {
      const tests = testsResponse.data.tests || testsResponse.data;
      log(`✅ Found ${tests.length} tests`, 'green');
      const active = tests.filter(t => t.is_active).length;
      const inactive = tests.filter(t => !t.is_active).length;
      log(`   Active: ${active}, Inactive: ${inactive}`, 'bright');
      
      if (inactive === 0) {
        log('   ℹ️  No inactive tests found', 'yellow');
      } else {
        log('   ✅ Inactive tests exist!', 'green');
        tests.filter(t => !t.is_active).forEach(t => {
          log(`      - ${t.title} (ID: ${t.id})`, 'bright');
        });
      }
    } else {
      log(`❌ Failed: ${testsResponse.status}`, 'red');
    }

    // Summary
    log('\n' + '='.repeat(60), 'blue');
    log('\n📊 SUMMARY:', 'bright');
    log('\n1. If backend is NOT running:', 'yellow');
    log('   → cd backend && npm run dev', 'yellow');
    log('\n2. If no inactive courses/tests:', 'yellow');
    log('   → Run SQL: UPDATE courses SET is_active = false WHERE id = 1;', 'yellow');
    log('\n3. If not authenticated:', 'yellow');
    log('   → Get token from browser console: localStorage.getItem("token")', 'yellow');
    log('   → Set: export TOKEN="your_token_here"', 'yellow');
    log('\n4. If inactive courses exist but not showing in app:', 'yellow');
    log('   → Check frontend console logs', 'yellow');
    log('   → Make sure logged in as teacher/admin', 'yellow');
    log('\n');

  } catch (error) {
    log(`\n❌ Diagnostic failed: ${error.message}`, 'red');
  }
}

// Run diagnostics
runDiagnostics();
