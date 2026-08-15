#!/usr/bin/env bash
# No secret of any kind may exist in shipped client code.
# Run from the deployment root. EXPECT: every line prints CLEAN.
set -u
files=$(find . -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.css' -o -name '*.json' \) \
  -not -path './test/*' -not -path './security/*' -not -path './node_modules/*' -not -path './docs/*')
probe() { if grep -RIlE "$2" $files >/dev/null 2>&1; then echo "FINDING  $1"; grep -RInE "$2" $files | head -5; else echo "CLEAN    $1"; fi; }
probe "service_role reference"        'service_role'
probe "secret key prefix"             'sb_secret_'
probe "legacy JWT (anon or service)"  'eyJhbGciOi'
# Only an assignment to a LITERAL is a finding. Reading process.env.X, or naming
# a constant, is how the gate is supposed to work and must not raise a false alarm.
probe "hard-coded secret literal"    '(SECRET|PRIVATE_KEY|PASSWORD|SUPABASE_SERVICE)[A-Za-z_]*\s*[:=]\s*["'"'"'][^"'"'"']{8,}'
probe "password hash literal"        'pbkdf2\$sha256\$[0-9]{4,}\$[A-Za-z0-9_-]{10,}\$'
probe "session token literal"        '(FOAAD_SESSION_SECRET|FOAAD_ACCESS_PASSWORD_HASH)\s*=\s*["'"'"']'
probe "unexpected external origin"    'https?://(?!umoaquvxkoagmirascgm\.supabase\.co)[a-z0-9.-]+\.(com|net|io|dev)' 
echo "--- keys actually present in client code ---"
grep -RIhoE 'sb_[a-z]+_[A-Za-z0-9_-]+' $files | sort -u
