-- 0002_seed_data.sql
-- Preloaded seed data: 1 Admin, 2 Students, and 12 Authentic Scholarships

INSERT INTO users (id, email, password_hash, role)
VALUES ('u1000000-0000-0000-0000-000000000001', 'admin@scholarships.gov.in', 'pbkdf2:100000:58566e480cab41d16822b95a4d457b70:cd7edf0a321336d309d8deef1e216f54cc9233334c423143dcdcfa3b16aa87c3', 'admin')
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role;

INSERT INTO users (id, email, password_hash, role)
VALUES ('u1000000-0000-0000-0000-000000000002', 'student1@test.com', 'pbkdf2:100000:76631466ce57a5f71d27082d33d724ca:7c88032c8135a5f71c994cc0a4525e6eb8686c149a078771d7f4aa9452a7a509', 'student')
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role;

INSERT INTO student_profiles (
  user_id, full_name, age, gender, family_income,
  education_level, current_course, field_of_study, cgpa,
  domicile_state, area_type, category, is_pwd,
  previous_institution, previous_marks_percentage
) VALUES (
  'u1000000-0000-0000-0000-000000000002', 'Ananya Sharma', 20, 'female', 320000,
  'undergraduate', 'B.Tech Computer Science', 'Engineering', 8.4,
  'Assam', 'urban', 'General', 0,
  'Cotton University Senior Secondary', 88.5
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
  previous_marks_percentage = excluded.previous_marks_percentage;

INSERT INTO users (id, email, password_hash, role)
VALUES ('u1000000-0000-0000-0000-000000000003', 'student2@test.com', 'pbkdf2:100000:76631466ce57a5f71d27082d33d724ca:7c88032c8135a5f71c994cc0a4525e6eb8686c149a078771d7f4aa9452a7a509', 'student')
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role;

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000001', 'Post-Matric Scholarship for SC/ST Students (Assam/North-East)', 'Government of Assam & Ministry of Tribal Affairs', 'Provides financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stages to enable them to complete their education.', '₹30,000 per annum + Tuition Fee reimbursement',
  30000, '2026-11-30', 'https://scholarships.gov.in', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000001';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('dae5e071-c6aa-4e1a-b89f-ff1b4a2bc7d3', 'a1000000-0000-0000-0000-000000000001', 'category', 'IN', 'SC, ST', 1, 'Applicant must belong to Scheduled Caste (SC) or Scheduled Tribe (ST) category.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('8a377ff4-4a3c-43c9-b140-44a8b983d0b5', 'a1000000-0000-0000-0000-000000000001', 'domicile_state', 'IN', 'Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura', 1, 'Applicant must be a permanent resident of a North-Eastern state.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('8fa392a3-3700-43f2-9df7-a82bab274c6f', 'a1000000-0000-0000-0000-000000000001', 'family_income', 'LTE', '250000', 1, 'Annual family income must not exceed ₹2,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('c00bc091-16ca-4f73-a33c-f283bba61424', 'a1000000-0000-0000-0000-000000000001', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Must be enrolled in undergraduate, postgraduate, or recognized diploma courses.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000001';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('93ac07cd-4193-45c4-9a46-0cf83492a723', 'a1000000-0000-0000-0000-000000000001', 'Caste Certificate', 1, 'Issued by the competent district authority / Sub-Divisional Officer.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('673f38e3-9132-400c-b2eb-4f412918dd86', 'a1000000-0000-0000-0000-000000000001', 'Income Certificate', 1, 'Current financial year certificate issued by Circle Officer / Revenue Authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('056642c5-2229-4ff4-8b91-ce1cbf4f211f', 'a1000000-0000-0000-0000-000000000001', 'Permanent Resident Certificate (PRC)', 1, 'Proof of domicile in Assam / North-East state.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('7d227dfe-f459-4243-b06a-310ddf8a99b9', 'a1000000-0000-0000-0000-000000000001', 'Previous Year Marksheet', 1, 'Self-attested copy of qualifying examination marksheet.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('b1e16714-4ffa-4da8-830a-7d11f1187a8b', 'a1000000-0000-0000-0000-000000000001', 'Bank Passbook Copy', 1, 'First page showing student name, account number, and IFSC code.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000002', 'Pragati Scholarship for Girl Students in Technical Education (AICTE)', 'All India Council for Technical Education (AICTE)', 'A national scheme aimed at empowering young women by providing financial support to pursue technical and engineering education in AICTE approved institutions.', '₹50,000 per annum for degree / diploma course duration',
  50000, '2026-12-15', 'https://www.aicte-india.org/schemes/students-development-schemes/pragati', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000002';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('28b0d1c2-57b7-4b46-82a0-e5fa7852b9a0', 'a1000000-0000-0000-0000-000000000002', 'gender', 'EQ', 'female', 1, 'Exclusively open for female candidates.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('f44a347e-d365-4e8a-9084-bad1803ac7fc', 'a1000000-0000-0000-0000-000000000002', 'field_of_study', 'IN', 'Engineering, Technology, Computer Science', 1, 'Must be pursuing technical degree or engineering.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('4216e61e-a8df-4d78-8252-b096b94989a7', 'a1000000-0000-0000-0000-000000000002', 'family_income', 'LTE', '800000', 1, 'Annual family income must not exceed ₹8,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('e418c913-170f-41df-9858-c115f7fefada', 'a1000000-0000-0000-0000-000000000002', 'cgpa', 'GTE', '6.0', 1, 'Minimum current CGPA of 6.0 out of 10.0.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000002';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('46b983e6-be08-4252-9102-1ce65d312f8d', 'a1000000-0000-0000-0000-000000000002', 'AICTE Centralized Admission Allotment Letter', 1, 'Proof of admission into 1st year of degree/diploma.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('28f3f871-ca0a-4362-a0fd-c63adf63bb99', 'a1000000-0000-0000-0000-000000000002', 'Annual Family Income Certificate', 1, 'Issued by Tahsildar / competent executive magistrate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('8d29d2ad-7bca-42e5-8eeb-b88e47123e23', 'a1000000-0000-0000-0000-000000000002', 'Class 10th and 12th Marksheets', 1, 'Attested copies of secondary and senior secondary marksheets.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('5aaf0b1e-7ee5-41b5-ad29-fa3d9e4f78ff', 'a1000000-0000-0000-0000-000000000002', 'Aadhaar Card', 1, 'Valid Aadhaar linked with mobile and active bank account.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('e8b48578-956f-4f75-87b9-a0d9a70a4fb9', 'a1000000-0000-0000-0000-000000000002', 'College Bonafide Certificate', 1, 'Signed and stamped by Head of Institution / Principal.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000003', 'Central Sector Scheme of Scholarships for College and University Students', 'Department of Higher Education (Ministry of Education)', 'Merit-cum-means scholarship for meritorious students from low-income families pursuing regular graduate and post-graduate degree courses.', '₹20,000 per annum for college & university study',
  20000, '2026-11-15', 'https://scholarships.gov.in', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000003';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('e5511ef3-8de1-4bd6-9315-0cba0842760e', 'a1000000-0000-0000-0000-000000000003', 'family_income', 'LTE', '450000', 1, 'Gross annual parental income must be less than or equal to ₹4,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('5b78a989-3632-424d-8f3b-16fb16aaae40', 'a1000000-0000-0000-0000-000000000003', 'previous_marks_percentage', 'GTE', '80.0', 1, 'Must have scored above 80th percentile (or >= 80%) in Class 12 board examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('03649354-53df-4d40-bdef-29a2cc560975', 'a1000000-0000-0000-0000-000000000003', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be pursuing regular higher education degree courses.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('9c6dc396-605c-4917-9a87-0d94e31f2277', 'a1000000-0000-0000-0000-000000000003', 'cgpa', 'GTE', '6.5', 0, 'Recommended ongoing CGPA >= 6.5 for renewal.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000003';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('e6a96553-f26b-45f7-97e7-18fd99c5df98', 'a1000000-0000-0000-0000-000000000003', 'Class 12th Board Marksheet', 1, 'Showing board percentile or aggregate marks.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('93ff2e23-a9d4-4bae-abf8-c5708bb55f17', 'a1000000-0000-0000-0000-000000000003', 'Income Certificate', 1, 'Certified by Tahsildar or Block Development Officer.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('934f4dad-9895-4c2f-9039-b150f02e40e7', 'a1000000-0000-0000-0000-000000000003', 'College Fee Receipt & Bonafide Certificate', 1, 'Verification of current enrollment in full-time regular course.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('b79e0182-58b5-4a3b-8725-b4bc5501adeb', 'a1000000-0000-0000-0000-000000000003', 'Aadhaar Card', 1, 'Aadhaar card copy.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000004', 'National Means-cum-Merit Scholarship Scheme (NMMSS)', 'Department of School Education & Literacy (Govt of India)', 'Aims to arrest the drop-out rate among economically weaker students and encourage them to continue secondary stage education.', '₹12,000 per annum (₹1,000 per month)',
  12000, '2026-10-31', 'https://scholarships.gov.in', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000004';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('740a469b-e5ed-48da-bd5e-1c30d7da5621', 'a1000000-0000-0000-0000-000000000004', 'education_level', 'EQ', 'school', 1, 'Exclusively for students enrolled in secondary school (Class 9 to 12).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('df6a3b58-0d6d-440b-96bd-ac4ef90b40fe', 'a1000000-0000-0000-0000-000000000004', 'family_income', 'LTE', '350000', 1, 'Annual parental income from all sources must not exceed ₹3,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('2adc910c-54b9-4d9c-808d-e29af94e1a13', 'a1000000-0000-0000-0000-000000000004', 'previous_marks_percentage', 'GTE', '55.0', 1, 'Minimum 55% marks or equivalent grade in the qualifying examination.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000004';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('0474437a-76dd-4401-875d-67be0c345e47', 'a1000000-0000-0000-0000-000000000004', 'Parental Income Certificate', 1, 'Government certified income certificate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('33b3899d-5f36-4f9d-920f-dce8f1b99729', 'a1000000-0000-0000-0000-000000000004', 'NMMSS Selection Examination Result Card', 1, 'Proof of qualifying state-level NMMS examination.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('af2315fc-7aeb-4f5e-99b5-87ba51e98f1e', 'a1000000-0000-0000-0000-000000000004', 'School Headmaster Attestation Letter', 1, 'Certificate confirming current study in Government / Local Body school.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000005', 'ONGC Foundation Scholarship for Meritorious SC/ST/OBC Students', 'Oil and Natural Gas Corporation (ONGC) Foundation', 'Corporate CSR initiative offering monetary assistance to meritorious underprivileged students pursuing Engineering, MBBS, Geology, Geophysics, or MBA.', '₹48,000 per annum (₹4,000 per month)',
  48000, '2026-10-15', 'https://ongcscholar.org', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000005';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('2870b63e-522c-4e64-a278-f9799851ef69', 'a1000000-0000-0000-0000-000000000005', 'category', 'IN', 'SC, ST, OBC', 1, 'Applicant must belong to SC, ST, or OBC community.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('6e42e659-1cf9-40fe-9d93-a47e40d13c38', 'a1000000-0000-0000-0000-000000000005', 'family_income', 'LTE', '200000', 1, 'Total annual family income must not exceed ₹2,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('cf824e0d-ff9e-434e-99bf-eb99038894fa', 'a1000000-0000-0000-0000-000000000005', 'field_of_study', 'IN', 'Engineering, Medical, Science, Management, Commerce', 1, 'Must be pursuing Engineering, Medicine, Geosciences, or MBA.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('8fbdb159-7b71-4b2d-8a9b-a69a3c6bc339', 'a1000000-0000-0000-0000-000000000005', 'cgpa', 'GTE', '6.0', 1, 'Minimum 6.0 CGPA on a 10-point scale or equivalent 60% marks.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000005';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d5b8a19f-787d-44f6-8f5b-00d759d45638', 'a1000000-0000-0000-0000-000000000005', 'Caste / Community Certificate', 1, 'Central / State format SC/ST/OBC certificate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('82c37138-fe66-4aad-b915-4eac0283dfdb', 'a1000000-0000-0000-0000-000000000005', 'Income Certificate', 1, 'Certified by Revenue Officer not below the rank of Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('1d20bf8b-1879-4e7b-8f2e-6c9fdf32f359', 'a1000000-0000-0000-0000-000000000005', 'Previous Examination Marksheet', 1, 'Class 12th or previous degree marksheet showing >= 60%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('a5b46ba1-a220-4f9f-82f2-04922b5b0f9b', 'a1000000-0000-0000-0000-000000000005', 'College Admission Verification Certificate (ECS Form)', 1, 'Duly verified by Dean / Head of Institute.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000006', 'Sitaram Jindal Foundation Scholarship Scheme', 'Sitaram Jindal Foundation', 'Merit-cum-means scholarship helping underprivileged students who are keen to continue their higher studies in general, professional, and diploma courses.', '₹30,000 per annum for undergraduate & postgraduate courses',
  30000, '2026-12-31', 'https://www.sitaramjindalfoundation.org/scholarships.php', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000006';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('755482df-afaa-4b13-a36e-a3bfeba73762', 'a1000000-0000-0000-0000-000000000006', 'family_income', 'LTE', '400000', 1, 'Family income must be within ₹4,00,000 per annum (rural: ₹2.5L, urban: ₹4L).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('5914f1a3-4b1b-410b-bad0-f3b1dda66c32', 'a1000000-0000-0000-0000-000000000006', 'cgpa', 'GTE', '6.5', 1, 'Minimum CGPA of 6.5 (equivalent to 65% for boys, 60% for girls).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('b3f0f4b7-a127-4dda-ab05-555d37406c45', 'a1000000-0000-0000-0000-000000000006', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Applicable for UG, PG, and technical diploma courses.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000006';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('1e47141a-4317-4f23-9ba3-c485c5d966c2', 'a1000000-0000-0000-0000-000000000006', 'Last Examination Marksheet', 1, 'Attested marksheet of the most recent academic year/semester.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('a3a9a835-9449-4cc5-b5f3-75e5668ad99b', 'a1000000-0000-0000-0000-000000000006', 'Annual Family Income Certificate', 1, 'Certificate issued by competent revenue authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('44550b84-74e3-45da-9662-56e444273c07', 'a1000000-0000-0000-0000-000000000006', 'Principal / Head of Institution Recommendation Letter', 1, 'Annexure form stamped by college authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('f8bf26cb-871e-44af-8192-a708c3854700', 'a1000000-0000-0000-0000-000000000006', 'Current Year Fee Receipts', 1, 'Receipts showing tuition and hostel fee payments.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000007', 'HDFC Educational Crisis Scholarship Support (ECSS)', 'HDFC Bank Parivartan', 'Assists vulnerable students who are at risk of dropping out due to personal or financial crisis, such as loss of earning family member or catastrophic medical emergency.', '₹75,000 one-time financial support grant',
  75000, '2026-09-30', 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility/parivartan', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000007';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('cb9e2292-d93c-46b8-99f6-215925cef79e', 'a1000000-0000-0000-0000-000000000007', 'family_income', 'LTE', '600000', 1, 'Family annual income must be less than or equal to ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('7580c35f-729d-42e2-8204-9d342becd540', 'a1000000-0000-0000-0000-000000000007', 'previous_marks_percentage', 'GTE', '55.0', 1, 'Applicant must have scored at least 55% marks in previous year.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('0418040a-180f-4bf8-b389-497cb3f4ab25', 'a1000000-0000-0000-0000-000000000007', 'education_level', 'IN', 'undergraduate, postgraduate, diploma, school', 1, 'Open to school and college students facing crisis.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000007';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('8ad830aa-d61c-41ae-9c91-21b82f214387', 'a1000000-0000-0000-0000-000000000007', 'Proof of Crisis / Emergency', 1, 'Death certificate of earning parent or critical illness hospital report.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('25d54544-22ed-4e3e-b812-622e53c309a3', 'a1000000-0000-0000-0000-000000000007', 'College / School Admission Slip & ID Card', 1, 'Proof of active student status.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('8ed64425-d2f8-46ef-a4fd-9543329ed8f5', 'a1000000-0000-0000-0000-000000000007', 'Previous Academic Year Marksheet', 1, 'Marksheet showing at least 55% marks.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('c34f2b7a-cd34-46af-b535-03b4f32d75b3', 'a1000000-0000-0000-0000-000000000007', 'Income Proof / Affidavit', 1, 'Income certificate or notarized salary affidavit.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('eaa8253c-a80e-4370-86e3-7edfb6a632f2', 'a1000000-0000-0000-0000-000000000007', 'Bank Account Passbook / Cancelled Cheque', 1, 'Student or joint bank account details.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000008', 'Keep India Smiling Foundational Scholarship Programme', 'Colgate-Palmolive (India) Limited & Buddy4Study', 'Provides foundational support to deserving students to pursue higher education, diploma, or sports training without financial distress.', '₹30,000 per year for up to 3 years',
  30000, '2026-10-30', 'https://www.colgate.com/en-in/about/community-programs/keep-india-smiling', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000008';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('2b677d43-3d0e-4033-ac66-1c1c63cb2bef', 'a1000000-0000-0000-0000-000000000008', 'family_income', 'LTE', '500000', 1, 'Annual family income must not exceed ₹5,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('28669f27-78c4-4110-8e60-9ba678ad1408', 'a1000000-0000-0000-0000-000000000008', 'previous_marks_percentage', 'GTE', '60.0', 1, 'Minimum 60% marks in Class 12 board examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('8c8493ad-5695-44b5-816c-0ff605bed2af', 'a1000000-0000-0000-0000-000000000008', 'education_level', 'IN', 'undergraduate, diploma', 1, 'Must be enrolled in 3 or 4-year undergraduate degree / diploma.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000008';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('a1d96a84-38ee-4a6c-a255-e538215c5068', 'a1000000-0000-0000-0000-000000000008', 'Photo Identity Proof (Aadhaar / Voter ID)', 1, 'Government issued photo identity.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('877fa5aa-1725-41cc-8d7e-e08e2fc27da0', 'a1000000-0000-0000-0000-000000000008', 'Class 12th Board Marksheet', 1, 'Showing minimum 60% aggregate marks.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('ad60119d-eb17-4028-971a-8d554df189a7', 'a1000000-0000-0000-0000-000000000008', 'Income Proof (ITR / Salary Slip / Income Certificate)', 1, 'Proof of family income below ₹5,00,000.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('fc24fc51-0ecc-4a75-ad20-906aaf61a1f3', 'a1000000-0000-0000-0000-000000000008', 'College Admission Letter / Fee Receipt', 1, 'Proof of undergraduate college enrollment.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000009', 'Kotak Kanya Scholarship for Girl Students in Higher Education', 'Kotak Education Foundation', 'Financial support to meritorious girl students from economically weaker sections to pursue professional graduation courses in top institutes.', '₹1,50,000 per annum until completion of degree',
  150000, '2026-11-10', 'https://kotak.kotakeducation.org/kotak-kanya-scholarship/', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000009';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('878bda73-b4ba-469f-9a0c-e76fe3dbec51', 'a1000000-0000-0000-0000-000000000009', 'gender', 'EQ', 'female', 1, 'Exclusively open for female students.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('6c9f0902-1cb0-4989-9d8b-fdb632dee56d', 'a1000000-0000-0000-0000-000000000009', 'previous_marks_percentage', 'GTE', '85.0', 1, 'Class 12 board marks must be 85% or above.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('66aff722-328a-4458-a39c-4b9ddb193679', 'a1000000-0000-0000-0000-000000000009', 'family_income', 'LTE', '600000', 1, 'Annual family income must not exceed ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('d4cb97b8-49cb-4633-a48c-ffca70337a7e', 'a1000000-0000-0000-0000-000000000009', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in 1st year of professional degree program.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('5e4b48b4-4043-4323-9ea6-d75b88a47236', 'a1000000-0000-0000-0000-000000000009', 'field_of_study', 'IN', 'Engineering, Medical, Architecture, Design, Law', 1, 'Applicable for Engineering, Medicine, Architecture, Design, or Law degrees.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000009';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('9f9eb466-f702-467e-8168-efd6e8059f43', 'a1000000-0000-0000-0000-000000000009', 'Class 12th Board Marksheet', 1, 'Showing at least 85% aggregate score.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('7fad4a1b-9606-47f2-a20e-83d0538d7fc0', 'a1000000-0000-0000-0000-000000000009', 'Income Proof (Form 16 / ITR / Tehsildar Certificate)', 1, 'Valid income document for the current assessment year.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('928f2d30-94a3-4411-9e18-33218b6cef84', 'a1000000-0000-0000-0000-000000000009', 'College Admission Letter with Fee Structure', 1, 'Showing official break-up of tuition and institutional fees.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('127b94e1-d252-4aac-aa7a-2bf79bf77755', 'a1000000-0000-0000-0000-000000000009', 'Aadhaar Card', 1, 'Self-attested Aadhaar card of the applicant.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000010', 'L''Oréal India For Young Women in Science Scholarship', 'L''Oréal India Foundation', 'A scholarship exclusively for young women wishing to pursue higher education in scientific fields, encouraging women representation in STEM.', '₹2,50,000 total grant for undergraduate science education',
  250000, '2026-10-25', 'https://www.loreal.com/en/india/articles/commitments/for-young-women-in-science/', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000010';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('b6769f3e-308a-4dd9-87a0-e45ed66ab490', 'a1000000-0000-0000-0000-000000000010', 'gender', 'EQ', 'female', 1, 'Exclusively for female students.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('7d449940-d6e5-4e8a-89ea-ce2249727822', 'a1000000-0000-0000-0000-000000000010', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in undergraduate science/engineering stream.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('a9b4f6ea-cb5e-4592-8207-53b7b13cfcfe', 'a1000000-0000-0000-0000-000000000010', 'field_of_study', 'IN', 'Science, Engineering, Medical, Biotechnology', 1, 'Must be pursuing Pure Science, Applied Science, Engineering, or Medicine.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('7a4bc234-7842-4852-bd16-c6545295b74b', 'a1000000-0000-0000-0000-000000000010', 'previous_marks_percentage', 'GTE', '85.0', 1, 'Minimum 85% marks in Science stream (PCM / PCB / PCMB) in Class 12.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('72c7df73-f987-4c34-897a-8d1ad189bb34', 'a1000000-0000-0000-0000-000000000010', 'family_income', 'LTE', '600000', 1, 'Annual family income must not exceed ₹6,00,000.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000010';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('223be5f4-ff9b-49c2-9be8-044aa0220790', 'a1000000-0000-0000-0000-000000000010', 'Class 10th and 12th Marksheets', 1, 'Showing science stream grades and aggregate percentage >= 85%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('87e8e5a2-6b9e-4afd-8c2b-f81d3be63ce4', 'a1000000-0000-0000-0000-000000000010', 'Proof of Family Income', 1, 'Salary slip, ITR acknowledgment, or government income certificate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('4531b0b2-2dc2-4245-b29a-ec3f0af0cc2e', 'a1000000-0000-0000-0000-000000000010', 'College Admission Letter', 1, 'Confirmation of enrollment in recognized science degree.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('095b94dc-5113-4e85-9eb2-e3a8afc997a4', 'a1000000-0000-0000-0000-000000000010', 'Science Teacher / Principal Recommendation Letter', 1, 'Letter highlighting scientific interest and academic aptitude.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000011', 'Prime Minister''s Special Scholarship Scheme (PMSSS) for Engineering & Medicine', 'All India Council for Technical Education (AICTE) & Ministry of Education', 'Provides opportunities to youth of UTs of Jammu & Kashmir and Ladakh to pursue higher education in colleges outside J&K.', '₹1,25,000 per annum academic fee + maintenance allowance',
  125000, '2026-11-20', 'https://www.aicte-india.org/bureaus/pms', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000011';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('03f345d6-4d8b-4f8a-b1dd-a452d8b32903', 'a1000000-0000-0000-0000-000000000011', 'domicile_state', 'IN', 'Jammu and Kashmir, Ladakh', 1, 'Applicant must hold domicile of UT of Jammu & Kashmir or Ladakh.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('1acda99d-1ada-4404-bcee-a89f8d78e298', 'a1000000-0000-0000-0000-000000000011', 'family_income', 'LTE', '800000', 1, 'Annual family income must be within ₹8,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('9e4f14dc-ebb1-4b0d-9618-424883400f2f', 'a1000000-0000-0000-0000-000000000011', 'education_level', 'EQ', 'undergraduate', 1, 'Must be seeking admission into undergraduate professional degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('6fe6ef38-f328-4403-a720-4071c9e51b17', 'a1000000-0000-0000-0000-000000000011', 'field_of_study', 'IN', 'Engineering, Medical, Nursing, Pharmacy', 1, 'Applicable for Engineering, Medical, Nursing, and Pharmacy degrees.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000011';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('1d5aaa0b-8877-4357-9973-e97582afb619', 'a1000000-0000-0000-0000-000000000011', 'Domicile Certificate of J&K / Ladakh', 1, 'Official domicile certificate issued by competent authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('89ad1add-fa4b-4082-92d8-c7969daee221', 'a1000000-0000-0000-0000-000000000011', 'Family Income Certificate', 1, 'Certified by Tehsildar or competent revenue authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('c971b3ce-fa3e-4b2e-ba2e-ea115a8b8371', 'a1000000-0000-0000-0000-000000000011', 'Class 12th Board Marksheet', 1, 'Marksheet from JKBOSE or CBSE board.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('6f2cec46-e934-4c0c-b14b-f6446aaa50da', 'a1000000-0000-0000-0000-000000000011', 'AICTE Allotment / Verification Letter', 1, 'AICTE PMSSS counseling allotment slip.');

INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000012', 'North Eastern Council (NEC) Merit Scholarship for Professional Courses', 'North Eastern Council (NEC), Ministry of DoNER', 'Financial support to permanent residents of the 8 North-Eastern states enrolled in recognized professional higher education courses.', '₹36,000 per annum for professional degree courses',
  36000, '2026-12-20', 'https://necouncil.gov.in/schemes-programmes', 'u1000000-0000-0000-0000-000000000001', 1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000012';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('0aae355f-1e9e-4fff-a935-d64ba4bc9b10', 'a1000000-0000-0000-0000-000000000012', 'domicile_state', 'IN', 'Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim', 1, 'Must be a permanent resident of any of the 8 North-Eastern States.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('620a1367-8d86-4f95-8f64-455ebbbb50d6', 'a1000000-0000-0000-0000-000000000012', 'cgpa', 'GTE', '7.0', 1, 'Minimum CGPA of 7.0 (or 70% aggregate marks).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('f692c606-c844-4836-8db6-67eac9285714', 'a1000000-0000-0000-0000-000000000012', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be enrolled in undergraduate or postgraduate professional degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('96a10041-0b25-4172-815b-3597d6a4aa80', 'a1000000-0000-0000-0000-000000000012', 'field_of_study', 'IN', 'Engineering, Medical, Agriculture, Technology, Science', 1, 'Engineering, Medicine, Agriculture, Veterinary, or Technology degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('1170b8ce-b95d-418a-a040-af4c6f4b5900', 'a1000000-0000-0000-0000-000000000012', 'family_income', 'LTE', '800000', 1, 'Annual family income must not exceed ₹8,00,000.');
DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000012';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('5315743b-5dcb-41bb-a840-cfa31acfefee', 'a1000000-0000-0000-0000-000000000012', 'Permanent Resident Certificate (PRC)', 1, 'Issued by District Magistrate / Sub-Divisional Officer of NE state.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('291be1a9-abe6-48e4-a9d0-b25a9e773ea2', 'a1000000-0000-0000-0000-000000000012', 'Family Income Certificate', 1, 'Current financial year certificate from Circle Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('aa926545-6d89-4be7-b944-28802b1a811c', 'a1000000-0000-0000-0000-000000000012', 'Previous Semester Marksheet / Degree Certificate', 1, 'Marksheet showing at least 70% or 7.0 CGPA.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('768d8ddd-d206-407e-8d8b-b538f7273786', 'a1000000-0000-0000-0000-000000000012', 'College Bonafide Certificate', 1, 'Issued and stamped by Head of the Institution.');


-- =========================================================================
-- 13. Prime Minister's Scholarship Scheme for Central Armed Police Forces (PMSS CAPF)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000013',
  'Prime Minister''s Scholarship Scheme for Central Armed Police Forces (PMSS CAPF)',
  'Welfare & Rehabilitation Board (WARB), Ministry of Home Affairs',
  'Provides educational assistance to dependent wards and widows of Central Armed Police Forces (BSF, CRPF, CISF, ITBP, SSB) & Assam Rifles personnel pursuing professional degree courses.',
  '₹36,000 per annum (₹3,000/mo for girls, ₹2,500/mo for boys)',
  36000,
  '2026-11-30',
  'https://scholarships.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000013';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000131', 'a1000000-0000-0000-0000-000000000013', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be enrolled in approved professional degree courses (Engineering, MBBS, Dental, Nursing, MBA, MCA).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000132', 'a1000000-0000-0000-0000-000000000013', 'previous_marks_percentage', 'GTE', '60', 1, 'Must have secured at least 60% marks in 10+2 / Diploma / Graduation.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000133', 'a1000000-0000-0000-0000-000000000013', 'age', 'LTE', '25', 1, 'Applicant must be between 18 and 25 years of age.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000013';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000131', 'a1000000-0000-0000-0000-000000000013', 'Serving / Ex-Serviceman Certificate', 1, 'Issued by the competent Force authority / WARB.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000132', 'a1000000-0000-0000-0000-000000000013', 'Bonafide Student Certificate', 1, 'Issued by Registrar / Principal of the professional college.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000133', 'a1000000-0000-0000-0000-000000000013', '10+2 / Qualifying Marksheet', 1, 'Self-attested copy of marksheet with minimum 60% aggregate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000134', 'a1000000-0000-0000-0000-000000000013', 'Bank Passbook (Aadhaar linked)', 1, 'Bank account in the name of student showing account number & IFSC.');


-- =========================================================================
-- 14. Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000014',
  'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
  'Higher Education Department, Government of West Bengal',
  'Financial assistance to meritorious students from economically weaker sections domiciled in West Bengal to pursue Higher Secondary, Undergraduate, Postgraduate, and Professional studies.',
  '₹18,000 to ₹60,000 per annum depending on course',
  18000,
  '2026-12-31',
  'https://svmcm.wbhed.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000014';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000141', 'a1000000-0000-0000-0000-000000000014', 'domicile_state', 'EQ', 'West Bengal', 1, 'Applicant must be a permanent resident of West Bengal.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000142', 'a1000000-0000-0000-0000-000000000014', 'family_income', 'LTE', '250000', 1, 'Annual family income must not exceed ₹2,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000143', 'a1000000-0000-0000-0000-000000000014', 'previous_marks_percentage', 'GTE', '60', 1, 'Minimum 60% aggregate marks in the last board / university qualifying examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000144', 'a1000000-0000-0000-0000-000000000014', 'education_level', 'IN', 'undergraduate, postgraduate, diploma, school', 1, 'Enrolled in post-matric higher secondary, undergraduate, or postgraduate level.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000014';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000141', 'a1000000-0000-0000-0000-000000000014', 'Income Certificate', 1, 'Issued by BDO / SDO / Joint BDO / Executive Officer of Municipality.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000142', 'a1000000-0000-0000-0000-000000000014', 'Domicile Certificate', 1, 'Aadhaar card, Voter card, or Ration card showing West Bengal address.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000143', 'a1000000-0000-0000-0000-000000000014', 'Last Qualifying Examination Marksheet', 1, 'Both sides of the marksheet showing 60%+ aggregate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000144', 'a1000000-0000-0000-0000-000000000014', 'Admission Receipt', 1, 'Receipt of admission fees for current academic year.');


-- =========================================================================
-- 15. Tata Trusts Medical and Healthcare Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000015',
  'Tata Trusts Medical and Healthcare Scholarship',
  'Tata Trusts',
  'Need-based financial assistance for meritorious students pursuing undergraduate and postgraduate studies in Medical Sciences, BDS, Pharmacy, and Allied Healthcare in recognized Indian institutions.',
  'Up to ₹50,000 per academic year towards tuition fees',
  50000,
  '2026-10-31',
  'https://www.tatatrusts.org',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000015';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000151', 'a1000000-0000-0000-0000-000000000015', 'field_of_study', 'IN', 'Medicine, Healthcare, Pharmacy, Nursing, Medical Sciences', 1, 'Must be enrolled in MBBS, BDS, Nursing, Pharmacy, or Allied Health Sciences.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000152', 'a1000000-0000-0000-0000-000000000015', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be pursuing a full-time undergraduate or postgraduate healthcare degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000153', 'a1000000-0000-0000-0000-000000000015', 'family_income', 'LTE', '600000', 1, 'Gross annual family income must be ≤ ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000154', 'a1000000-0000-0000-0000-000000000015', 'previous_marks_percentage', 'GTE', '65', 1, 'Must have secured minimum 65% in Class 12 / previous professional exam.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000015';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000151', 'a1000000-0000-0000-0000-000000000015', 'NEET Scorecard / College Admission Allotment', 1, 'Proof of admission into recognized government or private medical college.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000152', 'a1000000-0000-0000-0000-000000000015', 'Family Income Proof (ITR / Form 16)', 1, 'Latest ITR or employer salary slip of earning parents.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000153', 'a1000000-0000-0000-0000-000000000015', 'College Fee Structure', 1, 'Official fee breakdown signed by college authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000015', 'Previous Academic Marksheets', 1, 'Class 12th board marksheet and semester results.');


-- =========================================================================
-- 16. ICAR National Talent Scholarship (NTS) for Agriculture & Allied Sciences
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000016',
  'ICAR National Talent Scholarship (NTS) for Agriculture & Allied Sciences',
  'Indian Council of Agricultural Research (ICAR), Govt. of India',
  'Awarded to meritorious students who take admission in State Agricultural Universities and Central Agricultural Universities outside their home state through All India Entrance Examination.',
  '₹36,000 per annum (₹3,000 per month for UG students)',
  36000,
  '2026-11-20',
  'https://icar.org.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000016';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000161', 'a1000000-0000-0000-0000-000000000016', 'field_of_study', 'IN', 'Agriculture, Horticulture, Forestry, Veterinary Science, Fisheries, Agricultural Engineering', 1, 'Must be enrolled in an Agriculture or Allied Sciences degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000162', 'a1000000-0000-0000-0000-000000000016', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Enrolled in B.Sc (Hons) Agriculture / Allied or M.Sc programs.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000163', 'a1000000-0000-0000-0000-000000000016', 'cgpa', 'GTE', '7.0', 1, 'Must maintain minimum 7.0 / 10.0 OGPA in agricultural university exams.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000016';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000161', 'a1000000-0000-0000-0000-000000000016', 'ICAR Allotment Letter', 1, 'Proof of admission through ICAR All-India quota seat.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000162', 'a1000000-0000-0000-0000-000000000016', 'University Bonafide Certificate', 1, 'Signed by Registrar of the Agricultural University.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000163', 'a1000000-0000-0000-0000-000000000016', 'Semester Grade Report', 1, 'Proving minimum 7.0 OGPA / CGPA maintenance.');


-- =========================================================================
-- 17. Post-Matric Scholarship Scheme for Minorities (MoMA)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000017',
  'Post-Matric Scholarship Scheme for Minorities (MoMA)',
  'Ministry of Minority Affairs, Government of India',
  'Empowers students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) to pursue higher education from Class 11 up to Ph.D. stage.',
  '₹20,000 per annum + Maintenance Allowance',
  20000,
  '2026-11-30',
  'https://scholarships.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000017';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000171', 'a1000000-0000-0000-0000-000000000017', 'family_income', 'LTE', '200000', 1, 'Annual family income must not exceed ₹2,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000172', 'a1000000-0000-0000-0000-000000000017', 'previous_marks_percentage', 'GTE', '50', 1, 'Minimum 50% marks in the previous final board / degree examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000173', 'a1000000-0000-0000-0000-000000000017', 'education_level', 'IN', 'school, undergraduate, postgraduate, diploma', 1, 'Studying in Class 11, 12, Diploma, ITI, Undergraduate, or Postgraduate level.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000017';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000171', 'a1000000-0000-0000-0000-000000000017', 'Minority Community Self-Declaration', 1, 'Self-declaration affidavit of belonging to notified minority community.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000172', 'a1000000-0000-0000-0000-000000000017', 'Income Certificate', 1, 'Issued by authorized Revenue Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000173', 'a1000000-0000-0000-0000-000000000017', 'Previous Examination Marksheet', 1, 'Showing minimum 50% aggregate score.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000174', 'a1000000-0000-0000-0000-000000000017', 'Fee Receipt of Current Course', 1, 'Official receipt acknowledging payment of institutional fees.');


-- =========================================================================
-- 18. Aditya Birla Capital Scholarship for Professional Degree Students
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000018',
  'Aditya Birla Capital Scholarship for Professional Degree Students',
  'Aditya Birla Capital Foundation',
  'Provides financial support to meritorious students enrolled in professional undergraduate courses (Engineering, Commerce, Management, and Law) across India.',
  '₹60,000 one-time financial grant',
  60000,
  '2026-10-15',
  'https://www.adityabirlacapital.com',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000018';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000181', 'a1000000-0000-0000-0000-000000000018', 'family_income', 'LTE', '600000', 1, 'Gross annual family income must be ≤ ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000182', 'a1000000-0000-0000-0000-000000000018', 'previous_marks_percentage', 'GTE', '60', 1, 'Must have scored at least 60% in Class 12 or preceding year.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000183', 'a1000000-0000-0000-0000-000000000018', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in full-time professional UG degree (B.Tech, B.Com, BBA, BA LLB).');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000018';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000181', 'a1000000-0000-0000-0000-000000000018', 'Government ID Proof', 1, 'Aadhaar card or Voter ID of student.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000182', 'a1000000-0000-0000-0000-000000000018', 'Income Certificate / Salary Slips', 1, 'Issued by competent authority or recent 3 months salary slips.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000183', 'a1000000-0000-0000-0000-000000000018', 'College Admission Letter & ID Card', 1, 'Current student ID card and admission proof.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000184', 'a1000000-0000-0000-0000-000000000018', 'Bank Account Passbook / Cancelled Cheque', 1, 'Student savings account in any scheduled bank.');


-- =========================================================================
-- 19. Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000019',
  'Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)',
  'Ministry of Social Justice & Empowerment, Govt. of India',
  'Centrally sponsored scheme designed for general/non-reserved category students belonging to economically backward classes (EBC) pursuing post-matriculation studies.',
  '₹15,000 per annum + Compulsory Non-Refundable Fee reimbursement',
  15000,
  '2026-12-15',
  'https://socialjustice.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000019';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000191', 'a1000000-0000-0000-0000-000000000019', 'category', 'IN', 'General, EWS', 1, 'Must belong to General Category or Economically Weaker Section (EWS).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000192', 'a1000000-0000-0000-0000-000000000019', 'family_income', 'LTE', '100000', 1, 'Annual family income from all sources must not exceed ₹1,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000193', 'a1000000-0000-0000-0000-000000000019', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Studying in recognized post-matric course at a recognized college.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000019';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000191', 'a1000000-0000-0000-0000-000000000019', 'Income Certificate', 1, 'Issued by Revenue Authority not below the rank of Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000192', 'a1000000-0000-0000-0000-000000000019', 'EBC / General Category Declaration', 1, 'Self-affidavit confirming non-reserved category status.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000193', 'a1000000-0000-0000-0000-000000000019', 'Marksheet of Qualifying Examination', 1, 'Proof of having passed the previous academic milestone.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000194', 'a1000000-0000-0000-0000-000000000019', 'Institutional Bonafide Certificate', 1, 'Signed by Principal or Head of Institution.');


-- =========================================================================
-- 20. Google Generation Scholarship (APAC) for Women in Computer Science
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000020',
  'Google Generation Scholarship (APAC) for Women in Computer Science',
  'Google Inc.',
  'Supports women studying computer science and gaming to become leaders in tech, providing tuition scholarship and access to Google networking retreats.',
  '₹2,00,000 ($2,500 USD equivalent tuition award)',
  200000,
  '2026-11-01',
  'https://buildyourfuture.withgoogle.com/scholarships',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000020';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000020', 'gender', 'EQ', 'female', 1, 'Must identify as a female student.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000020', 'field_of_study', 'IN', 'Engineering, Computer Science, Information Technology, AI', 1, 'Must be studying Computer Science, Computer Engineering, or related technical field.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000203', 'a1000000-0000-0000-0000-000000000020', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be enrolled in 1st, 2nd, or 3rd year of undergraduate or postgraduate studies.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000204', 'a1000000-0000-0000-0000-000000000020', 'cgpa', 'GTE', '7.5', 1, 'Strong academic record with minimum 7.5 CGPA / equivalent.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000020';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000020', 'Resume / CV', 1, 'Detailing technical projects, coding skills, and community work.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000020', 'Current Academic Transcript', 1, 'Official semester transcript showing CGPA ≥ 7.5.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000203', 'a1000000-0000-0000-0000-000000000020', 'Diversity and Tech Leadership Essay', 1, 'Essay responses explaining passion for computer science and diversity in tech.');


-- =========================================================================
-- 21. National Law Universities (NLU) Need-Cum-Merit Legal Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000021',
  'National Law Universities (NLU) Need-Cum-Merit Legal Scholarship',
  'Bar Council of India Trust & Department of Justice',
  'Financial assistance for underprivileged and deserving law students admitted to 5-year integrated BA LLB / BBA LLB courses in recognized National Law Universities.',
  '₹75,000 per annum towards hostel and tuition fees',
  75000,
  '2026-10-30',
  'https://doj.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000021';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000211', 'a1000000-0000-0000-0000-000000000021', 'field_of_study', 'IN', 'Law, Legal Studies, Law & Legal Studies', 1, 'Must be enrolled in an approved full-time law program (BA LLB / BBA LLB / LLM).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000212', 'a1000000-0000-0000-0000-000000000021', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be studying in an undergraduate or postgraduate law course.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000213', 'a1000000-0000-0000-0000-000000000021', 'family_income', 'LTE', '500000', 1, 'Annual family income must not exceed ₹5,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000214', 'a1000000-0000-0000-0000-000000000021', 'cgpa', 'GTE', '6.5', 1, 'Must maintain minimum 6.5 CGPA in university semester examinations.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000021';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000211', 'a1000000-0000-0000-0000-000000000021', 'CLAT / AILET Admission Scorecard & Allotment', 1, 'Proof of entrance examination rank and NLU admission letter.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000212', 'a1000000-0000-0000-0000-000000000021', 'Parental Income Certificate', 1, 'Issued by competent revenue authority or ITR statement.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000213', 'a1000000-0000-0000-0000-000000000021', 'College ID Card & Bonafide Certificate', 1, 'Signed by Dean / Registrar of the National Law University.');


-- =========================================================================
-- 22. Mahindra All India Talent Scholarship (MAITS) for Polytechnic Diploma
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000022',
  'Mahindra All India Talent Scholarship (MAITS) for Polytechnic Diploma',
  'K. C. Mahindra Education Trust',
  'Awarded to deserving students from rural and economically weaker backgrounds who have secured admission in government-recognized Polytechnic Diploma institutes.',
  '₹10,000 per annum for 3 years (₹30,000 total)',
  10000,
  '2026-09-30',
  'https://www.kcmet.org',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000022';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000221', 'a1000000-0000-0000-0000-000000000022', 'education_level', 'EQ', 'diploma', 1, 'Must be enrolled in a recognized 3-year Polytechnic Diploma course.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000222', 'a1000000-0000-0000-0000-000000000022', 'family_income', 'LTE', '150000', 1, 'Annual family income must be less than ₹1,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000223', 'a1000000-0000-0000-0000-000000000022', 'previous_marks_percentage', 'GTE', '60', 1, 'Passed 10th or 12th standard with minimum 60% aggregate marks.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000022';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000221', 'a1000000-0000-0000-0000-000000000022', '10th / 12th Board Marksheet', 1, 'Certified copy of marksheet showing minimum 60%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000222', 'a1000000-0000-0000-0000-000000000022', 'Polytechnic Admission Letter / Fee Receipt', 1, 'Proof of admission to 1st year diploma engineering course.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000223', 'a1000000-0000-0000-0000-000000000022', 'Family Income Proof', 1, 'BDO / Tehsildar certificate or BPL card copy.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000224', 'a1000000-0000-0000-0000-000000000022', 'Student Bank Passbook', 1, 'Copy of front page of bank account.');


-- =========================================================================
-- 23. NHFDC Trust Fund Scholarship for Students with Disabilities
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000023',
  'NHFDC Trust Fund Scholarship for Students with Disabilities',
  'Department of Empowerment of Persons with Disabilities, Govt. of India',
  'Trust Fund scholarship for differently-abled students pursuing professional or technical degree and postgraduate courses from recognized Indian universities.',
  '₹48,000 per annum (₹3,000/mo maintenance + ₹12,000/yr book grant)',
  48000,
  '2026-11-15',
  'https://www.nhfdc.nic.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000023';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000231', 'a1000000-0000-0000-0000-000000000023', 'is_pwd', 'EQ', '1', 1, 'Applicant must be a person with benchmark disability (40% or more).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000232', 'a1000000-0000-0000-0000-000000000023', 'family_income', 'LTE', '300000', 1, 'Gross annual family income must not exceed ₹3,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000233', 'a1000000-0000-0000-0000-000000000023', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Enrolled in professional or technical degree / diploma programs.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000234', 'a1000000-0000-0000-0000-000000000023', 'previous_marks_percentage', 'GTE', '50', 1, 'Minimum 50% marks in the qualifying board or degree examination.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000023';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000231', 'a1000000-0000-0000-0000-000000000023', 'Disability Certificate (UDID Card)', 1, 'Government UDID card or medical board certificate showing ≥40% disability.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000232', 'a1000000-0000-0000-0000-000000000023', 'Income Certificate', 1, 'Issued by authorized Revenue Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000233', 'a1000000-0000-0000-0000-000000000023', 'University Bonafide Certificate', 1, 'Signed by Dean / Principal confirming current full-time enrollment.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000023', 'Previous Marksheet', 1, 'Proof of scoring at least 50% in qualifying examination.');


-- =========================================================================
-- 24. DCE Kerala Suvarna Jubilee Merit Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000024',
  'DCE Kerala Suvarna Jubilee Merit Scholarship',
  'Directorate of Collegiate Education, Government of Kerala',
  'State merit-cum-means scholarship for first-year undergraduate and postgraduate students from Below Poverty Line (BPL) families in Kerala.',
  '₹10,000 per annum',
  10000,
  '2026-11-25',
  'https://dcescholarship.kerala.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000024';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000241', 'a1000000-0000-0000-0000-000000000024', 'domicile_state', 'EQ', 'Kerala', 1, 'Applicant must be a native / permanent resident of Kerala.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000242', 'a1000000-0000-0000-0000-000000000024', 'family_income', 'LTE', '100000', 1, 'Belonging to BPL category or annual family income ≤ ₹1,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000243', 'a1000000-0000-0000-0000-000000000024', 'previous_marks_percentage', 'GTE', '50', 1, 'Must have secured minimum 50% in Plus-Two or Degree exam.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000244', 'a1000000-0000-0000-0000-000000000024', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Enrolled in regular UG or PG course in a recognized college in Kerala.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000024';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000241', 'a1000000-0000-0000-0000-000000000024', 'Kerala Nativity / Domicile Certificate', 1, 'Issued by Village Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000242', 'a1000000-0000-0000-0000-000000000024', 'BPL Ration Card / Income Certificate', 1, 'Showing BPL category or income ≤ ₹1,00,000.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000243', 'a1000000-0000-0000-0000-000000000024', 'Qualifying Marksheet', 1, 'Plus Two or Degree examination marksheet.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000244', 'a1000000-0000-0000-0000-000000000024', 'Student Bank Passbook', 1, 'First page of savings bank account passbook.');


-- =========================================================================
-- 25. Infosys Foundation "Aarohan" Social Innovation and STEM Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000025',
  'Infosys Foundation "Aarohan" Social Innovation and STEM Scholarship',
  'Infosys Foundation',
  'Promotes social innovation and educational equity by providing comprehensive tuition assistance to deserving students from rural and semi-urban communities enrolled in STEM and design degrees.',
  '₹1,00,000 per annum for tuition & living costs',
  100000,
  '2026-10-31',
  'https://www.infosys.com/infosys-foundation',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000025';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000251', 'a1000000-0000-0000-0000-000000000025', 'area_type', 'EQ', 'rural', 1, 'Must belong to a rural village or gram panchayat jurisdiction.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000252', 'a1000000-0000-0000-0000-000000000025', 'family_income', 'LTE', '450000', 1, 'Annual family income must not exceed ₹4,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000253', 'a1000000-0000-0000-0000-000000000025', 'field_of_study', 'IN', 'Engineering, Science, Computer Science, Architecture, STEM', 1, 'Enrolled in STEM, Engineering, Computer Science, or Architecture.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000254', 'a1000000-0000-0000-0000-000000000025', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in a 4-year undergraduate degree program.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000255', 'a1000000-0000-0000-0000-000000000025', 'previous_marks_percentage', 'GTE', '70', 1, 'Minimum 70% in Class 12 board examination.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000025';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000251', 'a1000000-0000-0000-0000-000000000025', 'Rural Residence Certificate', 1, 'Issued by Gram Panchayat Pradhan or BDO.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000252', 'a1000000-0000-0000-0000-000000000025', 'Family Income Certificate', 1, 'Income certificate issued by Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000253', 'a1000000-0000-0000-0000-000000000025', 'Class 12 Board Certificate & Marksheet', 1, 'Showing aggregate percentage ≥ 70%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000254', 'a1000000-0000-0000-0000-000000000025', 'College Admission Allotment Letter & Fee Receipt', 1, 'Proof of admission into undergraduate STEM course.');

