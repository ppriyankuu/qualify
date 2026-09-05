// scripts/generate-seed-sql.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITERATIONS = 100_000;
const KEY_LEN = 32;

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LEN * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedBits);

  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

async function main() {
  const adminHash = await hashPassword('Admin@12345');
  const studentHash = await hashPassword('Student@12345');

  const { SEED_SCHOLARSHIPS, DEMO_USERS } = await import('../src/seeds/scholarships.ts');

  let sql = `-- 0002_seed_data.sql
-- Preloaded seed data: 1 Admin, 2 Students, and 12 Authentic Scholarships

`;

  // Insert Users
  for (const user of DEMO_USERS) {
    const hash = user.role === 'admin' ? adminHash : studentHash;
    sql += `INSERT INTO users (id, email, password_hash, role)
VALUES (${escapeSql(user.id)}, ${escapeSql(user.email.toLowerCase())}, ${escapeSql(hash)}, ${escapeSql(user.role)})
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role;\n\n`;

    if (user.profile) {
      const p = user.profile;
      sql += `INSERT INTO student_profiles (
  user_id, full_name, age, gender, family_income,
  education_level, current_course, field_of_study, cgpa,
  domicile_state, area_type, category, is_pwd,
  previous_institution, previous_marks_percentage
) VALUES (
  ${escapeSql(user.id)}, ${escapeSql(p.full_name)}, ${p.age}, ${escapeSql(p.gender)}, ${p.family_income},
  ${escapeSql(p.education_level)}, ${escapeSql(p.current_course)}, ${escapeSql(p.field_of_study)}, ${p.cgpa},
  ${escapeSql(p.domicile_state)}, ${escapeSql(p.area_type)}, ${escapeSql(p.category)}, ${p.is_pwd},
  ${escapeSql(p.previous_institution)}, ${p.previous_marks_percentage}
)
ON CONFLICT(user_id) DO UPDATE SET
  full_name = excluded.full_name,
  age = excluded.age,
  gender = excluded.gender,
  family_income = excluded.family_income,
  education_level = excluded.education_level,
  current_course = excluded.current_course,
  field_of_study = excluded.field_of_study,
  cgpa = excluded.cgpa,
  domicile_state = excluded.domicile_state,
  area_type = excluded.area_type,
  category = excluded.category,
  is_pwd = excluded.is_pwd,
  previous_institution = excluded.previous_institution,
  previous_marks_percentage = excluded.previous_marks_percentage;\n\n`;
    }
  }

  // Insert Scholarships
  for (const s of SEED_SCHOLARSHIPS) {
    sql += `INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  ${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.provider)}, ${escapeSql(s.description)}, ${escapeSql(s.amount_description)},
  ${s.amount_value}, ${escapeSql(s.deadline)}, ${escapeSql(s.official_notice_url)}, 'u1000000-0000-0000-0000-000000000001', ${s.is_published}
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;\n\n`;

    sql += `DELETE FROM eligibility_rules WHERE scholarship_id = ${escapeSql(s.id)};\n`;
    for (const r of s.rules) {
      const ruleId = crypto.randomUUID();
      sql += `INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES (${escapeSql(ruleId)}, ${escapeSql(s.id)}, ${escapeSql(r.field_name)}, ${escapeSql(r.operator)}, ${escapeSql(r.expected_value)}, ${r.is_mandatory}, ${escapeSql(r.rule_description)});\n`;
    }

    sql += `DELETE FROM scholarship_documents WHERE scholarship_id = ${escapeSql(s.id)};\n`;
    for (const d of s.documents) {
      const docId = crypto.randomUUID();
      sql += `INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES (${escapeSql(docId)}, ${escapeSql(s.id)}, ${escapeSql(d.document_name)}, ${d.is_mandatory}, ${escapeSql(d.instructions)});\n`;
    }
    sql += '\n';
  }

  const outPath = path.resolve(__dirname, '../migrations/0002_seed_data.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Successfully generated ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
