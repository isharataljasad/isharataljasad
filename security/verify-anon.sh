#!/usr/bin/env bash
# ============================================================================
# FOAAD · ANONYMOUS-KEY BEHAVIOUR PROBE
# Confirms what the PUBLISHED key can actually do against the LIVE API.
# CHECK 6 (write probes) attempts writes. Run against staging first.
# Usage: bash security/verify-anon.sh
# ============================================================================
URL="https://umoaquvxkoagmirascgm.supabase.co"
KEY="sb_publishable_HFWDLuAB_8n4d_sg9zAG5g_D85cbaHI"
H=(-H "apikey: $KEY" -H "Authorization: Bearer $KEY")
code() { curl -s -o /tmp/body -w "%{http_code}" "$@"; }

echo "A1 · read corpus            EXPECT 200 + 33 rows"
c=$(code "${H[@]}" "$URL/rest/v1/cards?hizb_id=eq.H01&select=card_id")
echo "   HTTP $c  rows=$(grep -o 'card_id' /tmp/body | wc -l)"

echo "A2 · schema enumeration     EXPECT: only the tables you intend to expose"
code "${H[@]}" "$URL/rest/v1/" >/dev/null
python3 -c "import json;d=json.load(open('/tmp/body'));print('   exposed paths:',[k for k in d.get('paths',{}) if k!='/'])" 2>/dev/null || echo "   (inspect /tmp/body manually)"

echo "A3 · INSERT into cards      EXPECT 401 or 403 (NOT 201)"
echo "   HTTP $(code -X POST "${H[@]}" -H 'Content-Type: application/json' \
  -d '{"card_id":"ZZ-99","hizb_id":"ZZ","index":99,"surah":"x","ayah":"x","verse_text":"x","tadabbur_text":"x"}' \
  "$URL/rest/v1/cards")"

echo "A4 · UPDATE cards           EXPECT 401/403, or 200 with 0 rows affected"
echo "   HTTP $(code -X PATCH "${H[@]}" -H 'Content-Type: application/json' \
  -H 'Prefer: return=representation' -d '{"surah":"TAMPERED"}' \
  "$URL/rest/v1/cards?card_id=eq.H01-01")  body=$(head -c 120 /tmp/body)"

echo "A5 · DELETE cards           EXPECT 401/403, or 200 with 0 rows affected"
echo "   HTTP $(code -X DELETE "${H[@]}" -H 'Prefer: return=representation' \
  "$URL/rest/v1/cards?card_id=eq.H01-01")  body=$(head -c 120 /tmp/body)"

echo "A6 · probe non-corpus names EXPECT 404 or 401 for every one"
for t in users profiles sessions events observations notes research nodes transitions evidence pilot consent; do
  printf "   %-14s HTTP %s\n" "$t" "$(code "${H[@]}" "$URL/rest/v1/$t?select=*&limit=1")"
done

echo "A7 · auth endpoint open?    EXPECT 400/403/404 if signups are disabled"
echo "   HTTP $(code -X POST "${H[@]}" -H 'Content-Type: application/json' \
  -d '{"email":"probe@example.com","password":"Probe12345!"}' "$URL/auth/v1/signup")"

echo "A8 · storage buckets        EXPECT 400/401/404 (no public bucket listing)"
echo "   HTTP $(code "${H[@]}" "$URL/storage/v1/bucket")"
