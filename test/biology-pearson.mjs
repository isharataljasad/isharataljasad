import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const inventory = JSON.parse(readFileSync(new URL('../biology/pearson-inventory.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../biology/index.html', import.meta.url), 'utf8');
assert.equal(inventory.status, 'PUBLIC_PUBLISHER_TOPIC_INVENTORY_ONLY');
assert.equal(inventory.subscriber_session_verified, false);
assert.equal(inventory.complete_course_inventory, false);
assert.equal(inventory.total_video_count_verified, false);
assert.equal(inventory.videos_played_and_reviewed, 0);
assert.equal(inventory.verified_topic_count, inventory.topics.length);
assert.equal(inventory.topics.length, 17);
assert.equal(new Set(inventory.topics.map(t => t.id)).size, inventory.topics.length);
assert.equal(new Set(inventory.topics.map(t => t.url)).size, inventory.topics.length);
assert.equal(new Set(inventory.topics.map(t => t.unit)).size, 9);
assert.match(html, /17<\/strong><small>صفحة موضوع/);
assert.match(html, /0<\/strong><small>فيديو شُغّل/);
assert.match(html, /غير مثبت/);
assert.ok(!/<script\b/i.test(html), 'No inline or external scripts required for the inventory to render');
assert.ok(!/<style\b/i.test(html), 'Do not introduce an inline style blocked by the strict CSP');
for (const topic of inventory.topics) {
  assert.equal(topic.status, 'PUBLIC_TOPIC_PAGE_VERIFIED');
  assert.ok(topic.id.startsWith('BIO-P'));
  assert.ok(topic.skill_ar.length > 8);
  assert.ok(topic.url.startsWith('https://www.pearson.com/channels/biology/explore/'));
  assert.ok(html.includes(topic.id), `${topic.id} must render visibly without JavaScript`);
  assert.ok(html.includes(topic.url.replaceAll('&', '&amp;')) || html.includes(topic.url), `${topic.id} link must be visible`);
  for (const video of topic.sample_public_videos) {
    assert.match(video.duration, /^\d{2}:\d{2}$/);
    assert.ok(video.title.length > 3);
    assert.ok(html.includes(video.duration), `${topic.id} public video duration should be visible`);
  }
}
assert.ok(html.includes('href="/biology/pearson-inventory.json"'));
assert.ok(html.includes('href="/"'));
console.log('Biology Pearson public inventory PASS: 17 distinct topic pages, 9 units, visible static links, transparent access status, CSP-safe HTML.');
